import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  CalendarClock,
  History,
  MonitorSmartphone,
  Receipt,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { MemberActions } from "@/components/dashboard/member-actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getMemberDetail } from "@/lib/admin-members";
import { getServerSession, isAdminEmail } from "@/lib/auth-server";
import { getLocale } from "@/lib/i18n-server";

function formatDate(value: Date | null, locale: string) {
  if (!value) return "—";
  return new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(value);
}

function formatAmount(amount: string | null, currency: string | null) {
  if (!amount) return "—";
  const numeric = Number(amount);
  if (Number.isNaN(numeric)) return `${amount} ${currency ?? ""}`.trim();
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: currency ?? "IDR",
    maximumFractionDigits: 0,
  }).format(numeric);
}

export default async function AdminMemberDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const session = await getServerSession();
  if (!session?.user) redirect("/sign-in?redirectTo=/dashboard/member");
  if (!isAdminEmail(session.user.email)) redirect("/dashboard");

  const { userId } = await params;
  const detail = await getMemberDetail(userId);
  if (!detail) notFound();

  const locale = await getLocale();
  const isId = locale === "id";
  const dateLocale = isId ? "id" : "en";
  const { member, orders, devices, activity } = detail;

  const licenseLabels: Record<typeof member.licenseState, string> = {
    none: isId ? "Belum ada lisensi" : "No license",
    available: isId ? "Terbit, belum aktivasi" : "Issued, not activated",
    activated: isId ? "Aktif" : "Active",
    revoked: isId ? "Dicabut" : "Revoked",
  };

  const rows = [
    { label: isId ? "Nama" : "Name", value: member.name || "—" },
    { label: isId ? "Email" : "Email", value: member.email },
    {
      label: isId ? "Email terverifikasi" : "Email verified",
      value: member.emailVerified ? (isId ? "Ya" : "Yes") : isId ? "Belum" : "No",
    },
    { label: isId ? "Tanggal daftar" : "Joined", value: formatDate(member.createdAt, dateLocale) },
    {
      label: isId ? "Hak akses dibuka" : "Entitled at",
      value: formatDate(member.entitledAt, dateLocale),
    },
    {
      label: isId ? "Terakhir aktif" : "Last active",
      value: formatDate(member.lastActiveAt, dateLocale),
    },
    {
      label: isId ? "API key tersimpan" : "Stored API keys",
      value: [
        member.hasOpenAIKey ? "OpenAI" : null,
        member.hasMaiaRouterKey ? "MAIA Router" : null,
      ]
        .filter(Boolean)
        .join(", ") || (isId ? "Belum ada" : "None"),
    },
    { label: isId ? "Total aktivitas" : "Activity count", value: String(member.usageCount) },
  ];

  return (
    <main className="flex flex-col gap-8">
      <div>
        <Link
          href="/dashboard/member"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
        >
          <ArrowLeft className="h-4 w-4" />
          {isId ? "Kembali ke daftar member" : "Back to member list"}
        </Link>
        <h1 className="mt-5 text-balance font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-foreground)] sm:text-4xl">
          {member.name || member.email}
        </h1>
        <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">{member.email}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div className="space-y-6">
          <Card className="bg-[var(--color-card)]">
            <CardHeader className="gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                <UserRound className="h-4 w-4" />
                {isId ? "Identitas" : "Identity"}
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {rows.map((row) => (
                <div key={row.label}>
                  <div className="text-xs uppercase tracking-[0.14em] text-[var(--color-muted-foreground)]">
                    {row.label}
                  </div>
                  <div className="mt-1 text-sm font-medium text-[var(--color-foreground)]">{row.value}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-[var(--color-card)]">
            <CardHeader className="gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                <ShieldCheck className="h-4 w-4" />
                {isId ? "Lisensi" : "License"}
              </div>
              <CardTitle className="text-xl">{licenseLabels[member.licenseState]}</CardTitle>
              <CardDescription className="font-mono text-xs tracking-[0.08em]">
                {member.licenseMasked ?? (isId ? "Belum ada kode" : "No code yet")}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <div>
                <div className="text-xs uppercase tracking-[0.14em] text-[var(--color-muted-foreground)]">
                  {isId ? "Diterbitkan" : "Issued"}
                </div>
                <div className="mt-1 text-sm text-[var(--color-foreground)]">
                  {formatDate(member.licenseIssuedAt, dateLocale)}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.14em] text-[var(--color-muted-foreground)]">
                  {isId ? "Diaktivasi" : "Activated"}
                </div>
                <div className="mt-1 text-sm text-[var(--color-foreground)]">
                  {formatDate(member.licenseActivatedAt, dateLocale)}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.14em] text-[var(--color-muted-foreground)]">
                  {isId ? "Dicabut" : "Revoked"}
                </div>
                <div className="mt-1 text-sm text-[var(--color-foreground)]">
                  {formatDate(member.licenseRevokedAt, dateLocale)}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[var(--color-card)]">
            <CardHeader className="gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                <Receipt className="h-4 w-4" />
                {isId ? "Riwayat pembelian" : "Purchase history"}
              </div>
              <CardDescription>
                {orders.length
                  ? isId
                    ? `${orders.length} order tercatat.`
                    : `${orders.length} order(s) recorded.`
                  : isId
                    ? "Member ini belum punya order. Kalau dia bayar di luar Mayar, terbitkan lisensi manual dari panel kontrol."
                    : "This member has no order yet. If they paid outside Mayar, issue a license manually from the controls panel."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold text-[var(--color-foreground)]">
                      {formatAmount(order.amount, order.currency)}
                    </span>
                    <span className="rounded-full border border-[var(--color-border)] px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-muted-foreground)]">
                      {order.status}
                    </span>
                  </div>
                  <div className="mt-2 grid gap-1 text-xs text-[var(--color-muted-foreground)]">
                    <span>
                      {isId ? "Dibuat" : "Created"}: {formatDate(order.createdAt, dateLocale)}
                      {order.paidAt ? ` · ${isId ? "Dibayar" : "Paid"}: ${formatDate(order.paidAt, dateLocale)}` : ""}
                    </span>
                    <span>
                      {isId ? "Provider" : "Provider"}: {order.provider}
                      {order.mayarTransactionId ? ` · Trx: ${order.mayarTransactionId}` : ""}
                    </span>
                    <span>
                      {order.customerName} · {order.customerEmail} · {order.customerMobile}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <MemberActions
            userId={member.id}
            licenseState={member.licenseState}
            hasLicense={member.licenseState !== "none"}
            deviceCount={member.deviceCount}
            isId={isId}
          />

          <Card className="bg-[var(--color-card)]">
            <CardHeader className="gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                <MonitorSmartphone className="h-4 w-4" />
                {isId ? "Perangkat terpasang" : "Installed devices"}
              </div>
              <CardDescription>
                {devices.length
                  ? isId
                    ? `${devices.length} perangkat terikat pada lisensi ini.`
                    : `${devices.length} device(s) bound to this license.`
                  : isId
                    ? "Belum ada perangkat yang mengaktivasi lisensi ini."
                    : "No device has activated this license yet."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {devices.map((device) => (
                <div
                  key={device.id}
                  className="rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-xs text-[var(--color-muted-foreground)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-[var(--color-foreground)]">
                      {device.id.slice(0, 12)}…
                    </span>
                    <span>
                      {device.sourceLanguage} → {device.targetLanguage} · {device.aiProvider}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <CalendarClock className="h-3.5 w-3.5" />
                    {formatDate(device.lastActiveAt, dateLocale)}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-[var(--color-card)]">
            <CardHeader className="gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                <History className="h-4 w-4" />
                {isId ? "Aktivitas terakhir" : "Recent activity"}
              </div>
              <CardDescription>
                {isId
                  ? "Termasuk aksi admin yang pernah dijalankan pada akun ini."
                  : "Includes admin actions previously run on this account."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {activity.length === 0 ? (
                <p className="text-sm text-[var(--color-muted-foreground)]">
                  {isId ? "Belum ada aktivitas tercatat." : "No activity recorded yet."}
                </p>
              ) : (
                activity.map((item) => (
                  <div key={item.id} className="flex items-start justify-between gap-3 text-xs">
                    <div className="min-w-0">
                      <div className="font-medium text-[var(--color-foreground)]">{item.action}</div>
                      <div className="truncate text-[var(--color-muted-foreground)]">
                        {Object.entries(item.metadata ?? {})
                          .map(([key, value]) => `${key}=${String(value)}`)
                          .join(" · ")}
                      </div>
                    </div>
                    <span className="shrink-0 text-[var(--color-muted-foreground)]">
                      {formatDate(item.createdAt, dateLocale)}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
