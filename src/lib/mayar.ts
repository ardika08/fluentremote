import { createHmac, timingSafeEqual } from "node:crypto";
import { randomUUID } from "node:crypto";

import { and, desc, eq } from "drizzle-orm";

import { getDb, isDatabaseConfigured } from "@/db";
import { purchaseOrders } from "@/db/schema";
import { getServerSession } from "@/lib/auth-server";
import { issueLicenseForUser } from "@/lib/license";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type MayarInvoiceResponse = {
  statusCode: number;
  messages: string;
  data?: {
    id?: string;
    transactionId?: string;
    transaction_id?: string;
    link?: string;
  };
};

type MayarPaymentDetailResponse = {
  statusCode: number;
  messages: string;
  data?: {
    id?: string;
    status?: string;
    transactionId?: string;
    transaction_id?: string;
    amount?: number;
    link?: string;
  };
};

type MayarWebhookPayload = {
  event?: string;
  data?: {
    id?: string;
    transactionId?: string;
    status?: string;
    transactionStatus?: string;
    createdAt?: string;
    updatedAt?: string;
    merchantId?: string;
    merchantEmail?: string;
    merchantName?: string;
    customerName?: string;
    customerEmail?: string;
    customerMobile?: string;
    amount?: number;
    productId?: string;
    productName?: string;
    productType?: string;
    paymentMethod?: string | null;
    paymentUrl?: string;
  };
};

type PurchaseOrderSummary = {
  id: string;
  status: "pending" | "paid" | "expired" | "failed";
  checkoutUrl: string | null;
  customerMobile: string;
};

// ---------------------------------------------------------------------------
// Config helpers
// ---------------------------------------------------------------------------

function getBaseUrl() {
  return process.env.BETTER_AUTH_URL ?? "http://localhost:3000";
}

function getMayarBaseUrl() {
  return process.env.MAYAR_BASE_URL ?? "https://api.mayar.id/hl/v1";
}

function getMayarApiKey() {
  const apiKey = process.env.MAYAR_API_KEY;
  if (!apiKey) throw new Error("MAYAR_API_KEY_MISSING");
  return apiKey;
}

/**
 * MAYAR_WEBHOOK_SECRET is used for HMAC-SHA256 signature verification.
 * Set this in your Mayar dashboard under Webhook → Secret.
 * Falls back to MAYAR_WEBHOOK_TOKEN for backward-compatibility during migration.
 */
function getMayarWebhookSecret() {
  const secret = process.env.MAYAR_WEBHOOK_SECRET ?? process.env.MAYAR_WEBHOOK_TOKEN;
  if (!secret) throw new Error("MAYAR_WEBHOOK_SECRET_MISSING");
  return secret;
}

function getMayarAmount() {
  return process.env.MAYAR_PRICE_AMOUNT ?? "99000";
}

function getMayarDescription() {
  return process.env.MAYAR_PRODUCT_DESCRIPTION ?? "FluentRemote lifetime access";
}

function getMayarCurrency() {
  return process.env.MAYAR_CURRENCY ?? "IDR";
}

function buildWebhookUrl() {
  return `${getBaseUrl()}/api/payments/mayar/webhook`;
}

function buildRedirectUrl() {
  return `${getBaseUrl()}/checkout/success`;
}

function mapMayarPaymentStatus(status: string | null | undefined) {
  const normalized = status?.toLowerCase().trim();

  if (normalized === "paid") return "paid" as const;
  if (normalized === "expired" || normalized === "closed") return "expired" as const;
  if (normalized === "failed" || normalized === "cancelled") return "failed" as const;
  return "pending" as const;
}

// ---------------------------------------------------------------------------
// Invoice API (replaces payment-link checkout)
// ---------------------------------------------------------------------------

/**
 * Creates a Mayar invoice for the current authenticated user.
 * Uses the Invoice API (/hl/v1/invoice/create) so payment details
 * (name, email) are pre-filled and no mobile number is required.
 */
export async function createMayarCheckout(): Promise<PurchaseOrderSummary> {
  if (!isDatabaseConfigured()) {
    throw new Error("DATABASE_REQUIRED");
  }

  const session = await getServerSession();
  if (!session?.user) {
    throw new Error("AUTH_REQUIRED");
  }

  const db = getDb();
  const user = session.user;

  // Check for existing pending order first
  const existingOrder = await db.query.purchaseOrders.findFirst({
    where: and(
      eq(purchaseOrders.userId, user.id),
      eq(purchaseOrders.status, "pending"),
    ),
    orderBy: [desc(purchaseOrders.createdAt)],
  });

  if (existingOrder?.checkoutUrl) {
    return {
      id: existingOrder.id,
      status: existingOrder.status,
      checkoutUrl: existingOrder.checkoutUrl,
      customerMobile: existingOrder.customerMobile ?? "",
    };
  }

  // Create invoice via Mayar Invoice API
  const invoiceRes = await fetch(`${getMayarBaseUrl()}/invoice/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getMayarApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: user.name ?? user.email?.split("@")[0] ?? "Customer",
      email: user.email,
      mobile: "08000000000", // placeholder — invoice API requires this field
      description: getMayarDescription(),
      items: [
        {
          quantity: 1,
          rate: getMayarAmount(),
          description: getMayarDescription(),
        },
      ],
      redirectUrl: buildRedirectUrl(),
    }),
  });

  const invoiceData: MayarInvoiceResponse = await invoiceRes.json();

  if (!invoiceRes.ok || invoiceData.statusCode !== 200) {
    console.error("[mayar] Invoice creation error:", invoiceData);
    throw new Error("MAYAR_INVOICE_FAILED");
  }

  const checkoutUrl = invoiceData.data?.link;
  if (!checkoutUrl) {
    throw new Error("MAYAR_INVOICE_NO_LINK");
  }

  const transactionId =
    invoiceData.data?.transactionId ?? invoiceData.data?.transaction_id ?? null;

  const orderId = randomUUID();

  await db.insert(purchaseOrders).values({
    id: orderId,
    userId: user.id,
    mayarTransactionId: transactionId,
    status: "pending",
    checkoutUrl,
    customerName: user.name ?? user.email?.split("@")[0] ?? "Customer",
    customerEmail: user.email ?? "",
    customerMobile: "",
    amount: getMayarAmount(),
    currency: getMayarCurrency(),
  });

  return {
    id: orderId,
    status: "pending",
    checkoutUrl,
    customerMobile: "",
  };
}

// ---------------------------------------------------------------------------
// Webhook verification — HMAC-SHA256
// ---------------------------------------------------------------------------

/**
 * Verifies an incoming Mayar webhook using HMAC-SHA256 signature.
 *
 * Mayar sends the signature in the `x-mayar-signature` header as
 * `sha256=<hex-digest>` computed over the raw request body using the
 * webhook secret. Falls back to token comparison for backward-compat.
 */
export async function verifyMayarWebhookRequest(request: Request): Promise<boolean> {
  const secret = getMayarWebhookSecret();

  // Clone before reading — body can only be read once
  const cloned = request.clone();
  const rawBody = await cloned.text();

  // Primary: HMAC-SHA256 signature header
  const sigHeader = request.headers.get("x-mayar-signature");
  if (sigHeader) {
    const expectedSig = `sha256=${createHmac("sha256", secret).update(rawBody).digest("hex")}`;
    try {
      return timingSafeEqual(Buffer.from(sigHeader), Buffer.from(expectedSig));
    } catch {
      return false;
    }
  }

  // Fallback: plain token comparison (legacy / test environment)
  const queryToken = new URL(request.url).searchParams.get("token");
  const headerToken =
    request.headers.get("x-mayar-webhook-token") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  return queryToken === secret || headerToken === secret;
}

// ---------------------------------------------------------------------------
// Webhook fulfillment
// ---------------------------------------------------------------------------

export async function completePurchaseFromMayarWebhook(
  payload: MayarWebhookPayload,
): Promise<void> {
  const db = getDb();

  const transactionId =
    payload.data?.transactionId ?? payload.data?.id ?? null;

  const status = mapMayarPaymentStatus(
    payload.data?.status ?? payload.data?.transactionStatus,
  );

  if (status !== "paid") {
    // Non-paid events — update order status if we have a record
    if (transactionId) {
      await db
        .update(purchaseOrders)
        .set({ status })
        .where(eq(purchaseOrders.mayarTransactionId, transactionId));
    }
    return;
  }

  // Find the order by transaction ID
  let order = transactionId
    ? await db.query.purchaseOrders.findFirst({
        where: eq(purchaseOrders.mayarTransactionId, transactionId),
      })
    : null;

  // Fallback: find by customer email
  if (!order && payload.data?.customerEmail) {
    order = await db.query.purchaseOrders.findFirst({
      where: and(
        eq(purchaseOrders.status, "pending"),
      ),
      orderBy: [desc(purchaseOrders.createdAt)],
    });
  }

  if (!order) {
    throw new Error("ORDER_NOT_FOUND");
  }

  // Mark as paid
  await db
    .update(purchaseOrders)
    .set({ status: "paid" })
    .where(eq(purchaseOrders.id, order.id));

  // Issue license for the user
  await issueLicenseForUser(order.userId);
}

// ---------------------------------------------------------------------------
// Status polling
// ---------------------------------------------------------------------------

async function syncPurchaseOrderWithMayar(
  order: typeof purchaseOrders.$inferSelect,
): Promise<PurchaseOrderSummary> {
  if (!order.mayarTransactionId) {
    return {
      id: order.id,
      status: order.status,
      checkoutUrl: order.checkoutUrl,
      customerMobile: order.customerMobile ?? "",
    };
  }

  try {
    const res = await fetch(
      `${getMayarBaseUrl()}/payment/${order.mayarTransactionId}`,
      {
        headers: {
          Authorization: `Bearer ${getMayarApiKey()}`,
        },
      },
    );

    if (!res.ok) {
      throw new Error("MAYAR_STATUS_FETCH_FAILED");
    }

    const data: MayarPaymentDetailResponse = await res.json();
    const latestStatus = mapMayarPaymentStatus(data.data?.status);

    if (latestStatus !== order.status) {
      const db = getDb();
      await db
        .update(purchaseOrders)
        .set({ status: latestStatus })
        .where(eq(purchaseOrders.id, order.id));

      if (latestStatus === "paid") {
        await issueLicenseForUser(order.userId);
      }

      return {
        id: order.id,
        status: latestStatus,
        checkoutUrl: order.checkoutUrl,
        customerMobile: order.customerMobile ?? "",
      };
    }
  } catch {
    // Sync failure is non-fatal — return cached order
  }

  return {
    id: order.id,
    status: order.status,
    checkoutUrl: order.checkoutUrl,
    customerMobile: order.customerMobile ?? "",
  };
}

export async function getCurrentUserLatestPurchase(): Promise<PurchaseOrderSummary | null> {
  if (!isDatabaseConfigured()) return null;

  const session = await getServerSession();
  if (!session?.user) return null;

  const db = getDb();
  const order = await db.query.purchaseOrders.findFirst({
    where: eq(purchaseOrders.userId, session.user.id),
    orderBy: [desc(purchaseOrders.createdAt)],
  });

  if (!order) return null;

  if (order.status === "pending") {
    return syncPurchaseOrderWithMayar(order);
  }

  return {
    id: order.id,
    status: order.status,
    checkoutUrl: order.checkoutUrl,
    customerMobile: order.customerMobile ?? "",
  };
}

// ---------------------------------------------------------------------------
// Config helpers (used by checkout page & dev lab)
// ---------------------------------------------------------------------------

export async function ensureMayarConfigReady() {
  return {
    apiKey: getMayarApiKey(),
    webhookUrl: buildWebhookUrl(),
    redirectUrl: buildRedirectUrl(),
  };
}

export function getMayarPricing(locale: "id" | "en" = "id") {
  const amount = getMayarAmount();
  const currency = getMayarCurrency();
  const formattedAmount = new Intl.NumberFormat(locale === "id" ? "id-ID" : "en-US", {
    maximumFractionDigits: 0,
  }).format(Number(amount));

  return {
    amount,
    currency,
    formatted: `${currency} ${formattedAmount}`,
  };
}
