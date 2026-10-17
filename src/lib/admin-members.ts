import { randomUUID } from "node:crypto";

import { desc, eq, ilike, inArray, or, sql } from "drizzle-orm";

import { getDb } from "@/db";
import {
  deviceInstallations,
  licenses,
  purchaseOrders,
  usageLogs,
  user,
  userSettings,
} from "@/db/schema";
import { issueLicenseForUser } from "@/lib/license";

/**
 * Lapisan data untuk menu admin "Member".
 *
 * Catatan skala: agregasi (device, aktivitas, pembelian) dihitung di memori setelah
 * satu kali query per tabel. Untuk produk tahap awal (puluhan–ratusan member) ini
 * paling sederhana dan aman. Kalau member sudah > 1000, ganti ke SQL agregat
 * (GROUP BY) supaya tidak memuat semua baris.
 */

export type MemberLicenseState = "none" | "available" | "activated" | "revoked";
export type MemberOrderState = "none" | "paid" | "pending" | "expired" | "failed";

export type MemberRow = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  licenseId: string | null;
  licenseMasked: string | null;
  licenseState: MemberLicenseState;
  licenseIssuedAt: Date | null;
  licenseActivatedAt: Date | null;
  licenseRevokedAt: Date | null;
  entitledAt: Date | null;
  lastActiveAt: Date | null;
  deviceCount: number;
  hasOpenAIKey: boolean;
  hasMaiaRouterKey: boolean;
  orderState: MemberOrderState;
  orderId: string | null;
  orderAmount: string | null;
  orderCurrency: string | null;
  orderCreatedAt: Date | null;
  orderPaidAt: Date | null;
  orderCustomerName: string | null;
  orderCustomerMobile: string | null;
  usageCount: number;
};

export type MemberDetail = {
  member: MemberRow;
  orders: {
    id: string;
    status: string;
    amount: string;
    currency: string;
    provider: string;
    customerName: string;
    customerEmail: string;
    customerMobile: string;
    mayarTransactionId: string | null;
    mayarPaymentRequestId: string | null;
    checkoutUrl: string | null;
    createdAt: Date;
    paidAt: Date | null;
  }[];
  devices: {
    id: string;
    sourceLanguage: string;
    targetLanguage: string;
    aiProvider: string;
    lastActiveAt: Date;
    createdAt: Date;
  }[];
  activity: {
    id: string;
    action: string;
    deviceId: string | null;
    metadata: Record<string, unknown>;
    createdAt: Date;
  }[];
};

export type MemberStats = {
  total: number;
  withLicense: number;
  active: number;
  revoked: number;
  paid: number;
};

const ORDER_PRIORITY: Record<MemberOrderState, number> = {
  paid: 5,
  pending: 4,
  expired: 3,
  failed: 2,
  none: 1,
};

function toOrderState(value: string | null | undefined): MemberOrderState {
  if (!value) return "none";
  if (value === "paid" || value === "pending" || value === "expired" || value === "failed") {
    return value;
  }
  return "pending";
}

export async function listMembers(input: {
  search?: string;
  status?: string;
  page?: number;
  perPage?: number;
}): Promise<{ rows: MemberRow[]; total: number; stats: MemberStats; page: number; perPage: number }> {
  const db = getDb();
  const perPage = Math.min(Math.max(input.perPage ?? 25, 5), 100);
  const page = Math.max(input.page ?? 1, 1);
  const search = (input.search ?? "").trim();
  const statusFilter = (input.status ?? "all").trim();

  const where = search
    ? or(ilike(user.email, `%${search}%`), ilike(user.name, `%${search}%`))
    : undefined;

  const users = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    })
    .from(user)
    .where(where)
    .orderBy(desc(user.createdAt))
    .limit(1000);

  if (users.length === 0) {
    return {
      rows: [],
      total: 0,
      stats: { total: 0, withLicense: 0, active: 0, revoked: 0, paid: 0 },
      page,
      perPage,
    };
  }

  const userIds = users.map((row) => row.id);

  const settingsRows = await db
    .select({
      userId: userSettings.userId,
      licenseId: userSettings.licenseId,
      entitledAt: userSettings.entitledAt,
      lastActiveAt: userSettings.lastActiveAt,
      openaiApiKeyMasked: userSettings.openaiApiKeyMasked,
      maiaRouterApiKeyMasked: userSettings.maiaRouterApiKeyMasked,
    })
    .from(userSettings)
    .where(inArray(userSettings.userId, userIds));

  const licenseIds = settingsRows
    .map((row) => row.licenseId)
    .filter((value): value is string => Boolean(value));

  const licenseRows = licenseIds.length
    ? await db
        .select({
          id: licenses.id,
          status: licenses.status,
          masked: licenses.activationCodeMasked,
          issuedToUserId: licenses.issuedToUserId,
          issuedAt: licenses.issuedAt,
          activatedAt: licenses.activatedAt,
          revokedAt: licenses.revokedAt,
        })
        .from(licenses)
        .where(inArray(licenses.id, licenseIds))
    : [];

  const orderRows = await db
    .select({
      id: purchaseOrders.id,
      userId: purchaseOrders.userId,
      status: purchaseOrders.status,
      amount: purchaseOrders.amount,
      currency: purchaseOrders.currency,
      createdAt: purchaseOrders.createdAt,
      paidAt: purchaseOrders.paidAt,
      customerName: purchaseOrders.customerName,
      customerMobile: purchaseOrders.customerMobile,
    })
    .from(purchaseOrders)
    .where(inArray(purchaseOrders.userId, userIds))
    .orderBy(desc(purchaseOrders.createdAt));

  const deviceRows = licenseIds.length
    ? await db
        .select({
          licenseId: deviceInstallations.licenseId,
          total: sql<number>`count(*)::int`,
        })
        .from(deviceInstallations)
        .where(inArray(deviceInstallations.licenseId, licenseIds))
        .groupBy(deviceInstallations.licenseId)
    : [];

  const usageRows = await db
    .select({
      userId: usageLogs.userId,
      total: sql<number>`count(*)::int`,
    })
    .from(usageLogs)
    .where(inArray(usageLogs.userId, userIds))
    .groupBy(usageLogs.userId);

  const settingsByUser = new Map(settingsRows.map((row) => [row.userId, row]));
  const licenseById = new Map(licenseRows.map((row) => [row.id, row]));
  const devicesByLicense = new Map(deviceRows.map((row) => [row.licenseId ?? "", row.total]));
  const usageByUser = new Map(usageRows.map((row) => [row.userId ?? "", row.total]));

  const ordersByUser = new Map<string, typeof orderRows>();
  for (const order of orderRows) {
    const list = ordersByUser.get(order.userId) ?? [];
    list.push(order);
    ordersByUser.set(order.userId, list);
  }

  const rows: MemberRow[] = users.map((row) => {
    const settings = settingsByUser.get(row.id);
    const license = settings?.licenseId ? licenseById.get(settings.licenseId) : undefined;
    const orders = ordersByUser.get(row.id) ?? [];

    const strongest = orders.reduce<(typeof orders)[number] | null>((best, current) => {
      if (!best) return current;
      const bestState = toOrderState(best.status);
      const currentState = toOrderState(current.status);
      if (ORDER_PRIORITY[currentState] > ORDER_PRIORITY[bestState]) return current;
      if (ORDER_PRIORITY[currentState] === ORDER_PRIORITY[bestState]) {
        return (current.createdAt?.getTime() ?? 0) > (best.createdAt?.getTime() ?? 0)
          ? current
          : best;
      }
      return best;
    }, null);

    return {
      id: row.id,
      name: row.name,
      email: row.email,
      emailVerified: row.emailVerified,
      createdAt: row.createdAt,
      licenseId: license?.id ?? null,
      licenseMasked: license?.masked ?? null,
      licenseState: (license?.status ?? "none") as MemberLicenseState,
      licenseIssuedAt: license?.issuedAt ?? null,
      licenseActivatedAt: license?.activatedAt ?? null,
      licenseRevokedAt: license?.revokedAt ?? null,
      entitledAt: settings?.entitledAt ?? null,
      lastActiveAt: settings?.lastActiveAt ?? null,
      deviceCount: license?.id ? devicesByLicense.get(license.id) ?? 0 : 0,
      hasOpenAIKey: Boolean(settings?.openaiApiKeyMasked),
      hasMaiaRouterKey: Boolean(settings?.maiaRouterApiKeyMasked),
      orderState: toOrderState(strongest?.status ?? null),
      orderId: strongest?.id ?? null,
      orderAmount: strongest?.amount ?? null,
      orderCurrency: strongest?.currency ?? null,
      orderCreatedAt: strongest?.createdAt ?? null,
      orderPaidAt: strongest?.paidAt ?? null,
      orderCustomerName: strongest?.customerName ?? null,
      orderCustomerMobile: strongest?.customerMobile ?? null,
      usageCount: usageByUser.get(row.id) ?? 0,
    };
  });

  const stats: MemberStats = {
    total: rows.length,
    withLicense: rows.filter((row) => row.licenseState !== "none").length,
    active: rows.filter((row) => row.licenseState === "activated").length,
    revoked: rows.filter((row) => row.licenseState === "revoked").length,
    paid: rows.filter((row) => row.orderState === "paid").length,
  };

  const filtered = rows.filter((row) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "paid") return row.orderState === "paid";
    if (statusFilter === "unpaid") return row.orderState !== "paid";
    return row.licenseState === statusFilter;
  });

  const start = (page - 1) * perPage;

  return {
    rows: filtered.slice(start, start + perPage),
    total: filtered.length,
    stats,
    page,
    perPage,
  };
}

export async function getMemberDetail(userId: string): Promise<MemberDetail | null> {
  const db = getDb();

  const [row] = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);

  if (!row) return null;

  const { rows } = await listMembers({ perPage: 1000 });
  const member = rows.find((item) => item.id === userId);

  const [settings] = await db
    .select({ licenseId: userSettings.licenseId })
    .from(userSettings)
    .where(eq(userSettings.userId, userId))
    .limit(1);

  const orders = await db
    .select({
      id: purchaseOrders.id,
      status: purchaseOrders.status,
      amount: purchaseOrders.amount,
      currency: purchaseOrders.currency,
      provider: purchaseOrders.provider,
      customerName: purchaseOrders.customerName,
      customerEmail: purchaseOrders.customerEmail,
      customerMobile: purchaseOrders.customerMobile,
      mayarTransactionId: purchaseOrders.mayarTransactionId,
      mayarPaymentRequestId: purchaseOrders.mayarPaymentRequestId,
      checkoutUrl: purchaseOrders.checkoutUrl,
      createdAt: purchaseOrders.createdAt,
      paidAt: purchaseOrders.paidAt,
    })
    .from(purchaseOrders)
    .where(eq(purchaseOrders.userId, userId))
    .orderBy(desc(purchaseOrders.createdAt));

  const devices = settings?.licenseId
    ? await db
        .select({
          id: deviceInstallations.id,
          sourceLanguage: deviceInstallations.sourceLanguage,
          targetLanguage: deviceInstallations.targetLanguage,
          aiProvider: deviceInstallations.aiProvider,
          lastActiveAt: deviceInstallations.lastActiveAt,
          createdAt: deviceInstallations.createdAt,
        })
        .from(deviceInstallations)
        .where(eq(deviceInstallations.licenseId, settings.licenseId))
        .orderBy(desc(deviceInstallations.lastActiveAt))
    : [];

  const activity = await db
    .select({
      id: usageLogs.id,
      action: usageLogs.action,
      deviceId: usageLogs.deviceId,
      metadata: usageLogs.metadata,
      createdAt: usageLogs.createdAt,
    })
    .from(usageLogs)
    .where(eq(usageLogs.userId, userId))
    .orderBy(desc(usageLogs.createdAt))
    .limit(25);

  return {
    member:
      member ??
      ({
        id: row.id,
        name: row.name,
        email: row.email,
        emailVerified: row.emailVerified,
        createdAt: row.createdAt,
        licenseId: null,
        licenseMasked: null,
        licenseState: "none",
        licenseIssuedAt: null,
        licenseActivatedAt: null,
        licenseRevokedAt: null,
        entitledAt: null,
        lastActiveAt: null,
        deviceCount: 0,
        hasOpenAIKey: false,
        hasMaiaRouterKey: false,
        orderState: "none",
        orderId: null,
        orderAmount: null,
        orderCurrency: null,
        orderCreatedAt: null,
        orderPaidAt: null,
        orderCustomerName: null,
        orderCustomerMobile: null,
        usageCount: 0,
      } satisfies MemberRow),
    orders,
    devices,
    activity,
  };
}

async function logAdminAction(input: {
  memberUserId: string;
  adminEmail: string;
  action: string;
  metadata?: Record<string, unknown>;
}) {
  const db = getDb();
  await db.insert(usageLogs).values({
    id: randomUUID(),
    userId: input.memberUserId,
    deviceId: null,
    action: input.action,
    metadata: { by: input.adminEmail, ...(input.metadata ?? {}) },
    createdAt: new Date(),
  });
}

async function getMemberLicense(userId: string) {
  const db = getDb();
  const [settings] = await db
    .select({ licenseId: userSettings.licenseId })
    .from(userSettings)
    .where(eq(userSettings.userId, userId))
    .limit(1);

  if (!settings?.licenseId) return null;

  const [license] = await db
    .select()
    .from(licenses)
    .where(eq(licenses.id, settings.licenseId))
    .limit(1);

  return license ?? null;
}

export type AdminActionResult = { ok: boolean; message: string; activationCode?: string };

export async function revokeMemberLicense(
  userId: string,
  adminEmail: string,
): Promise<AdminActionResult> {
  const license = await getMemberLicense(userId);
  if (!license) return { ok: false, message: "Member ini belum punya lisensi." };
  if (license.status === "revoked") return { ok: false, message: "Lisensi sudah dicabut." };

  const db = getDb();
  await db
    .update(licenses)
    .set({ status: "revoked", revokedAt: new Date() })
    .where(eq(licenses.id, license.id));

  await logAdminAction({
    memberUserId: userId,
    adminEmail,
    action: "admin.license.revoked",
    metadata: { licenseMasked: license.activationCodeMasked, previousStatus: license.status },
  });

  return {
    ok: true,
    message: `Lisensi ${license.activationCodeMasked} dicabut. Ekstensi member langsung berhenti saat sync.`,
  };
}

export async function restoreMemberLicense(
  userId: string,
  adminEmail: string,
): Promise<AdminActionResult> {
  const license = await getMemberLicense(userId);
  if (!license) return { ok: false, message: "Member ini belum punya lisensi." };
  if (license.status !== "revoked") return { ok: false, message: "Lisensi tidak dalam keadaan dicabut." };

  const nextStatus = license.activatedAt ? "activated" : "available";
  const db = getDb();
  await db
    .update(licenses)
    .set({ status: nextStatus, revokedAt: null })
    .where(eq(licenses.id, license.id));

  await logAdminAction({
    memberUserId: userId,
    adminEmail,
    action: "admin.license.restored",
    metadata: { licenseMasked: license.activationCodeMasked, status: nextStatus },
  });

  return {
    ok: true,
    message: `Lisensi ${license.activationCodeMasked} dipulihkan (status: ${nextStatus}).`,
  };
}

export async function issueMemberLicense(
  userId: string,
  adminEmail: string,
): Promise<AdminActionResult> {
  const existing = await getMemberLicense(userId);
  if (existing && existing.status !== "revoked") {
    return {
      ok: false,
      message: `Member sudah punya lisensi aktif (${existing.activationCodeMasked}). Pakai "Ganti kode lisensi" kalau mau kode baru.`,
    };
  }

  const created = await issueLicenseForUser(userId);

  await logAdminAction({
    memberUserId: userId,
    adminEmail,
    action: "admin.license.issued",
    metadata: { licenseMasked: created.activationCodeMasked },
  });

  return {
    ok: true,
    message: "Lisensi manual diterbitkan. Kirim kode di bawah ke member.",
    activationCode: created.activationCode,
  };
}

export async function reissueMemberLicense(
  userId: string,
  adminEmail: string,
): Promise<AdminActionResult> {
  const created = await issueLicenseForUser(userId);

  await logAdminAction({
    memberUserId: userId,
    adminEmail,
    action: "admin.license.reissued",
    metadata: { licenseMasked: created.activationCodeMasked },
  });

  return {
    ok: true,
    message: "Kode lisensi baru diterbitkan. Kode lama tidak berlaku lagi.",
    activationCode: created.activationCode,
  };
}

export async function resetMemberDevice(
  userId: string,
  adminEmail: string,
): Promise<AdminActionResult> {
  const license = await getMemberLicense(userId);
  if (!license) return { ok: false, message: "Member ini belum punya lisensi." };

  const db = getDb();
  const removed = await db
    .delete(deviceInstallations)
    .where(eq(deviceInstallations.licenseId, license.id))
    .returning({ id: deviceInstallations.id });

  await db
    .update(licenses)
    .set({ activatedByDeviceId: null })
    .where(eq(licenses.id, license.id));

  await logAdminAction({
    memberUserId: userId,
    adminEmail,
    action: "admin.device.reset",
    metadata: { licenseMasked: license.activationCodeMasked, removedDevices: removed.length },
  });

  return {
    ok: true,
    message: `Pengikatan perangkat direset (${removed.length} perangkat dilepas). Member bisa aktivasi ulang di komputer baru.`,
  };
}
