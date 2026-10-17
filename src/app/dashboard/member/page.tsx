import Link from "next/link";
import { redirect } from "next/navigation";
import {
  BadgeCheck,
  Ban,
  Crown,
  Search,
  ShieldAlert,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listMembers, type MemberRow } from "@/lib/admin-members";
import { getServerSession, isAdminEmail } from "@/lib/auth-server";
import { getLocale } from "@/lib/i18n-server";

function formatDate(value: Date | string | null, locale: string) {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(date);
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

function licenseBadge(row: MemberRow, isId: boolean) {
  if (row.licenseState === "none") {
    return {
      label: isId ? "Belum ada" : "None",
      className: "border-white/10 bg-white/5 text-[var(--color-muted-foreground)]",
    };
  }
  if (row.licenseState === "revoked") {
    return {
      label: isId ? "Dicabut" : "Revoked",
      className: "border-rose-500/35 bg-rose-500/12 text-rose-300",
    };
  }
  if (row.licenseState === "activated") {
    return {
      label: isId ? "Aktif" : "Active",
      className: "border-emerald-500/35 bg-emerald-500/12 text-emerald-300",
    };
  }
  return {
    label: isId ? "Terbit, belum aktivasi" : "Issued",
    className: "border-amber-500/35 bg-amber-500/12 text-amber-300",
  };
}

function orderBadge(row: MemberRow, isId: boolean) {
  if (row.orderState === "paid") {
    return { label: isId ? "Lunas" : "Paid", className: "border-emerald-500/35 bg-emerald-500/12 text-emerald-300" };
  }
  if (row.orderState === "pending") {
    return { label: isId ? "Menunggu bayar" : "Pending", className: "border-amber-500/35 bg-amber-500/12 text-amber-300" };
  }
  if (row.orderState === "expired") {
    return { label: isId ? "Kedaluwarsa" : "Expired", className: "border-white/10 bg-white/5 text-[var(--color-muted-foreground)]" };
  }
  if (row.orderState === "failed") {
    return { label: isId ? "Gagal" : "Failed", className: "border-rose-500/35 bg-rose-500/12 text-rose-300" };
  }
  return { label: isId ? "Belum beli" : "No order", className: "border-white/10 bg-white/5 text-[var(--color-muted-foreground)]" };
}

export default async function AdminMembersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const session = await getServerSession();
  if (!session?.user) redirect("/sign-in?redirectTo=/dashboard/member");
  if (!isAdminEmail(session.user.email)) redirect("/dashboard");

  const params = await searchParams;
  const locale = await getLocale();
  const isId = locale === "id";

  const search = params.q ?? "";
  const status = params.status ?? "all";
  const page = Number.parseInt(params.page ?? "1", 10) || 1;

  const { rows, total, stats, perPage } = await listMembers({ search, status, page });
  const totalPages = Math.max(Math.ceil(total / perPage), 1);
  const dateLocale = isId ? "id" : "en";

  const statusOptions = [
    { value: "all", label: isId ? "Semua status" : "All statuses" },
    { value: "activated", label: isId ? "Lisensi aktif" : "License active" },
    { value: "available", label: isId ? "Terbit, belum aktivasi" : "Issued, not activated" },
    { value: "revoked", label: isId ? "Lisensi dicabut" : "License revoked" },
    { value: "none", label: isId ? "Belum punya lisensi" : "No license" },
    { value: "paid", label: isId ? "Sudah bayar" : "Paid" },
    { value: "unpaid", label: isId ? "Belum bayar" : "Unpaid" },
  ];

  const statCards = [
    {
      label: isId ? "Total member" : "Total members",
      value: stats.total,
      icon: Users,
      tone: "text-[var(--color-primary)]",
    },
    {
      label: isId ? "Lisensi aktif" : "Active licenses",
      value: stats.active,
      icon: BadgeCheck,
      tone: "text-emerald-300",
    },
    {
      label: isId ? "Sudah bayar" : "Paid members",
      value: stats.paid,
      icon: Crown,
      tone: "text-amber-300",
    },
    {
      label: isId ? "Lisensi dicabut" : "Revoked licenses",
      value: stats.revoked,
      icon: ShieldAlert,
      tone: "text-rose-300",
    },
  ];

  const buildHref = (next: { q?: string; status?: string; page?: number }) => {
    const query = new URLSearchParams();
    const nextQ = next.q ?? search;
    const nextStatus = next.status ?? status;
    const nextPage = next.page ?? page;
    if (nextQ) query.set("q", nextQ);
    if (nextStatus && nextStatus !== "all") query.set("status", nextStatus);
    if (nextPage > 1) query.set("page", String(nextPage));
    const suffix = query.toString();
    return suffix ? `/dashboard/member?${suffix}` : "/dashboard/member";
  };

  return (
    <main className="flex flex-col gap-8">
      <header className="max-w-3xl">
        <div className="flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-[var(--color-primary)]">
          <Users className="h-4 w-4" />
          {isId ? "Admin" : "Admin"}
        </div>
        <h1 className="mt-4 text-balance font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-foreground)] sm:text-4xl">
          {isId ? "Member dan pembeli FluentRemote" : "FluentRemote members and buyers"}
        </h1>
        <p className="mt-3 text-base leading-7 text-[var(--color-muted-foreground)]">
          {isId
            ? "Pantau siapa yang mendaftar, siapa yang sudah membayar, dan kontrol lisensi maupun perangkat mereka dari satu halaman."
            : "Track who registered, who paid, and control their licenses and devices from one page."}
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label} className="bg-[var(--color-card)]">
              <CardHeader className="gap-2 pb-2">
                <div className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] ${card.tone}`}>
                  <Icon className="h-4 w-4" />
                  {card.label}
                </div>
                <CardTitle className="text-3xl tabular-nums">{card.value}</CardTitle>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      <Card className="bg-[var(--color-card)]">
        <CardHeader className="gap-4">
          <form className="flex flex-col gap-3 sm:flex-row sm:items-center" action="/dashboard/member">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted-foreground)]" />
              <input
                type="search"
                name="q"
                defaultValue={search}
                placeholder={isId ? "Cari email atau nama member…" : "Search member email or name…"}
                className="w-full rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)] py-3 pl-10 pr-3 text-sm text-[var(--color-foreground)] outline-none placeholder:text-[var(--color-muted-foreground)] focus:border-[rgba(139,92,246,0.55)]"
              />
            </div>
            <select
              name="status"
              defaultValue={status}
              className="rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-3 text-sm text-[var(--color-foreground)] outline-none focus:border-[rgba(139,92,246,0.55)]"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Button type="submit">{isId ? "Terapkan" : "Apply"}</Button>
          </form>
        </CardHeader>

        <CardContent className="px-0">
          {rows.length === 0 ? (
            <div className="px-6 pb-6 text-sm text-[var(--color-muted-foreground)]">
              {isId
                ? "Tidak ada member yang cocok. Kalau daftarnya kosong, berarti belum ada yang mendaftar atau membeli."
                : "No members match. An empty list simply means nobody has registered or purchased yet."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[880px] border-collapse text-sm">
                <thead>
                  <tr className="border-y border-[var(--color-border)] text-left text-xs uppercase tracking-[0.14em] text-[var(--color-muted-foreground)]">
                    <th className="px-6 py-3 font-semibold">{isId ? "Member" : "Member"}</th>
                    <th className="px-4 py-3 font-semibold">{isId ? "Daftar" : "Joined"}</th>
                    <th className="px-4 py-3 font-semibold">{isId ? "Lisensi" : "License"}</th>
                    <th className="px-4 py-3 font-semibold">{isId ? "Pembelian" : "Purchase"}</th>
                    <th className="px-4 py-3 font-semibold">{isId ? "Perangkat" : "Devices"}</th>
                    <th className="px-4 py-3 font-semibold">{isId ? "Terakhir aktif" : "Last active"}</th>
                    <th className="px-6 py-3 text-right font-semibold">{isId ? "Aksi" : "Action"}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => {
                    const license = licenseBadge(row, isId);
                    const order = orderBadge(row, isId);
                    return (
                      <tr key={row.id} className="border-b border-[var(--color-border)] last:border-0">
                        <td className="px-6 py-4">
                          <div className="font-medium text-[var(--color-foreground)]">{row.name || "—"}</div>
                          <div className="text-xs text-[var(--color-muted-foreground)]">{row.email}</div>
                        </td>
                        <td className="px-4 py-4 text-[var(--color-muted-foreground)]">
                          {formatDate(row.createdAt, dateLocale)}
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${license.className}`}>
                            {license.label}
                          </span>
                          <div className="mt-1 font-mono text-xs text-[var(--color-muted-foreground)]">
                            {row.licenseMasked ?? "—"}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${order.className}`}>
                            {order.label}
                          </span>
                          <div className="mt-1 text-xs text-[var(--color-muted-foreground)]">
                            {formatAmount(row.orderAmount, row.orderCurrency)}
                          </div>
                        </td>
                        <td className="px-4 py-4 tabular-nums text-[var(--color-foreground)]">{row.deviceCount}</td>
                        <td className="px-4 py-4 text-[var(--color-muted-foreground)]">
                          {formatDate(row.lastActiveAt, dateLocale)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button asChild variant="secondary" size="sm">
                            <Link href={`/dashboard/member/${row.id}`}>
                              {isId ? "Kelola" : "Manage"}
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 ? (
            <div className="flex items-center justify-between gap-4 px-6 pt-5 text-sm text-[var(--color-muted-foreground)]">
              <span>
                {isId
                  ? `Halaman ${page} dari ${totalPages} · ${total} member`
                  : `Page ${page} of ${totalPages} · ${total} members`}
              </span>
              <div className="flex gap-2">
                {page > 1 ? (
                  <Button asChild variant="secondary" size="sm">
                    <Link href={buildHref({ page: page - 1 })}>{isId ? "Sebelumnya" : "Previous"}</Link>
                  </Button>
                ) : null}
                {page < totalPages ? (
                  <Button asChild variant="secondary" size="sm">
                    <Link href={buildHref({ page: page + 1 })}>{isId ? "Berikutnya" : "Next"}</Link>
                  </Button>
                ) : null}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card className="border-[var(--color-border)] bg-[var(--color-card)]">
        <CardContent className="flex items-start gap-3 py-5 text-sm text-[var(--color-muted-foreground)]">
          <Ban className="mt-0.5 h-4 w-4 shrink-0 text-rose-300" />
          <p>
            {isId
              ? "Mencabut lisensi langsung menghentikan sinkronisasi ekstensi member pada percobaan berikutnya. Semua aksi admin tercatat sebagai jejak aktivitas di akun member tersebut."
              : "Revoking a license stops the member extension sync on its next attempt. Every admin action is recorded as an activity trail on that member's account."}
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
