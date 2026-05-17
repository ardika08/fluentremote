import { randomUUID } from "node:crypto";

import { and, desc, eq } from "drizzle-orm";

import { getDb, isDatabaseConfigured } from "@/db";
import { purchaseOrders } from "@/db/schema";
import { getServerSession } from "@/lib/auth-server";
import { issueLicenseForUser } from "@/lib/license";

type MayarCreateResponse = {
  statusCode: number;
  messages: string;
  data?: {
    id?: string;
    transactionId?: string;
    transaction_id?: string;
    link?: string;
  };
};

type CreateMayarCheckoutParams = {
  mobile: string;
};

type PurchaseOrderSummary = {
  id: string;
  status: "pending" | "paid" | "expired" | "failed";
  checkoutUrl: string | null;
  customerMobile: string;
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

function getMayarWebhookToken() {
  const token = process.env.MAYAR_WEBHOOK_TOKEN;
  if (!token) throw new Error("MAYAR_WEBHOOK_TOKEN_MISSING");
  return token;
}

function getMayarAmount() {
  return Number(process.env.MAYAR_PRICE_AMOUNT ?? "99000");
}

function getMayarDescription() {
  return process.env.MAYAR_PRODUCT_DESCRIPTION ?? "FluentRemote lifetime access";
}

function getMayarCurrency() {
  return process.env.MAYAR_CURRENCY ?? "IDR";
}

function mapMayarPaymentStatus(status: string | null | undefined) {
  const normalized = status?.toLowerCase().trim();

  if (normalized === "paid") return "paid" as const;
  if (normalized === "expired" || normalized === "closed") return "expired" as const;
  if (normalized === "failed" || normalized === "cancelled") return "failed" as const;
  return "pending" as const;
}

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

async function fetchMayarPaymentDetail(paymentRequestId: string) {
  const response = await fetch(`${getMayarBaseUrl()}/payment/${paymentRequestId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getMayarApiKey()}`,
    },
    cache: "no-store",
  });

  const payload = (await response.json()) as MayarPaymentDetailResponse;

  if (!response.ok || !payload.data?.id) {
    throw new Error(payload.messages || "MAYAR_STATUS_FAILED");
  }

  return payload.data;
}

async function syncPurchaseOrderWithMayar(order: typeof purchaseOrders.$inferSelect) {
  if (order.status !== "pending" || !order.mayarPaymentRequestId) {
    return order;
  }

  const payment = await fetchMayarPaymentDetail(order.mayarPaymentRequestId);
  const nextStatus = mapMayarPaymentStatus(payment.status);

  if (
    nextStatus === order.status &&
    (payment.transactionId ?? payment.transaction_id ?? null) === order.mayarTransactionId &&
    payment.link === order.checkoutUrl
  ) {
    return order;
  }

  const db = getDb();

  await db
    .update(purchaseOrders)
    .set({
      status: nextStatus,
      mayarTransactionId:
        payment.transactionId ?? payment.transaction_id ?? order.mayarTransactionId,
      checkoutUrl: payment.link ?? order.checkoutUrl,
      paidAt: nextStatus === "paid" ? order.paidAt ?? new Date() : order.paidAt,
      updatedAt: new Date(),
    })
    .where(eq(purchaseOrders.id, order.id));

  if (nextStatus === "paid") {
    await issueLicenseForUser(order.userId);
  }

  return {
    ...order,
    status: nextStatus,
    mayarTransactionId:
      payment.transactionId ?? payment.transaction_id ?? order.mayarTransactionId,
    checkoutUrl: payment.link ?? order.checkoutUrl,
    paidAt: nextStatus === "paid" ? order.paidAt ?? new Date() : order.paidAt,
    updatedAt: new Date(),
  };
}

function buildWebhookUrl() {
  const token = getMayarWebhookToken();
  return `${getBaseUrl()}/api/payments/mayar/webhook?token=${encodeURIComponent(token)}`;
}

function buildRedirectUrl() {
  return `${getBaseUrl()}/checkout/success`;
}

function normalizeMobile(mobile: string) {
  return mobile.replace(/[^\d+]/g, "").trim();
}

export async function createMayarCheckout(
  params: CreateMayarCheckoutParams,
): Promise<PurchaseOrderSummary> {
  if (!isDatabaseConfigured()) {
    throw new Error("DATABASE_REQUIRED");
  }

  const session = await getServerSession();
  if (!session?.user) {
    throw new Error("AUTH_REQUIRED");
  }

  const mobile = normalizeMobile(params.mobile);
  if (!mobile) {
    throw new Error("MOBILE_REQUIRED");
  }

  const amount = getMayarAmount();
  const redirectUrl = buildRedirectUrl();
  const description = getMayarDescription();
  const db = getDb();

  const response = await fetch(`${getMayarBaseUrl()}/payment/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getMayarApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: session.user.name,
      email: session.user.email,
      amount,
      mobile,
      redirectUrl,
      description,
      expiredAt: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
    }),
  });

  const payload = (await response.json()) as MayarCreateResponse;

  if (!response.ok || !payload.data?.id || !payload.data?.link) {
    throw new Error(payload.messages || "MAYAR_CREATE_FAILED");
  }

  const orderId = randomUUID();
  const transactionId = payload.data.transactionId ?? payload.data.transaction_id ?? null;

  await db.insert(purchaseOrders).values({
    id: orderId,
    userId: session.user.id,
    provider: "mayar",
    status: "pending",
    amount: String(amount),
    currency: getMayarCurrency(),
    customerName: session.user.name,
    customerEmail: session.user.email,
    customerMobile: mobile,
    mayarPaymentRequestId: payload.data.id,
    mayarTransactionId: transactionId,
    checkoutUrl: payload.data.link,
    redirectUrl,
    description,
    rawCreateResponse: payload as unknown as Record<string, unknown>,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return {
    id: orderId,
    status: "pending",
    checkoutUrl: payload.data.link,
    customerMobile: mobile,
  };
}

export async function completePurchaseFromMayarWebhook(payload: MayarWebhookPayload) {
  if (!isDatabaseConfigured()) {
    throw new Error("DATABASE_REQUIRED");
  }

  const transactionId = payload.data?.transactionId ?? payload.data?.id;
  const paymentRequestId = payload.data?.productId;
  const transactionStatus = payload.data?.transactionStatus;
  const eventName = payload.event;

  if (!transactionId && !paymentRequestId) {
    throw new Error("WEBHOOK_IDENTIFIERS_MISSING");
  }

  const db = getDb();

  let order =
    transactionId
      ? await db.query.purchaseOrders.findFirst({
          where: eq(purchaseOrders.mayarTransactionId, transactionId),
        })
      : null;

  if (!order && paymentRequestId) {
    order = await db.query.purchaseOrders.findFirst({
      where: eq(purchaseOrders.mayarPaymentRequestId, paymentRequestId),
    });
  }

  if (!order) {
    throw new Error("ORDER_NOT_FOUND");
  }

  let nextStatus: "pending" | "paid" | "expired" | "failed" = order.status;
  if (eventName === "payment.received" && transactionStatus === "paid") {
    nextStatus = "paid";
  } else if (eventName === "payment.reminder" && transactionStatus === "created") {
    nextStatus = "pending";
  }

  await db
    .update(purchaseOrders)
    .set({
      status: nextStatus,
      mayarTransactionId: transactionId ?? order.mayarTransactionId,
      rawWebhookPayload: payload as unknown as Record<string, unknown>,
      paidAt: nextStatus === "paid" ? new Date() : order.paidAt,
      updatedAt: new Date(),
    })
    .where(eq(purchaseOrders.id, order.id));

  if (nextStatus === "paid") {
    await issueLicenseForUser(order.userId);
  }

  return nextStatus;
}

export async function getCurrentUserLatestPurchase() {
  if (!isDatabaseConfigured()) {
    return null;
  }

  const session = await getServerSession();
  if (!session?.user) {
    return null;
  }

  const db = getDb();

  const order = await db.query.purchaseOrders.findFirst({
    where: eq(purchaseOrders.userId, session.user.id),
    orderBy: [desc(purchaseOrders.createdAt)],
  });

  if (!order || !process.env.MAYAR_API_KEY) {
    return order;
  }

  try {
    return await syncPurchaseOrderWithMayar(order);
  } catch {
    return order;
  }
}

export async function getCurrentUserPendingPurchase() {
  if (!isDatabaseConfigured()) {
    return null;
  }

  const session = await getServerSession();
  if (!session?.user) {
    return null;
  }

  const db = getDb();

  const order = await db.query.purchaseOrders.findFirst({
    where: and(
      eq(purchaseOrders.userId, session.user.id),
      eq(purchaseOrders.status, "pending"),
    ),
    orderBy: [desc(purchaseOrders.createdAt)],
  });

  if (!order || !process.env.MAYAR_API_KEY) {
    return order;
  }

  try {
    return await syncPurchaseOrderWithMayar(order);
  } catch {
    return order;
  }
}

export async function verifyMayarWebhookRequest(request: Request) {
  const url = new URL(request.url);
  const queryToken = url.searchParams.get("token");
  const headerToken =
    request.headers.get("x-mayar-webhook-token") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const expectedToken = getMayarWebhookToken();

  return queryToken === expectedToken || headerToken === expectedToken;
}

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
  }).format(amount);

  return {
    amount,
    currency,
    formatted: `${currency} ${formattedAmount}`,
  };
}
