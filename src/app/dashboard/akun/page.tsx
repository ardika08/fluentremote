import { redirect } from "next/navigation";
import { BadgeCheck, CalendarDays, Mail, UserRound } from "lucide-react";

import { SignOutButton } from "@/components/dashboard/sign-out-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getServerSession } from "@/lib/auth-server";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

function initials(name: string, email: string) {
  const tokens = name.trim().split(/\s+/).filter(Boolean).slice(0, 2);
  if (tokens.length) return tokens.map((t) => t[0]?.toUpperCase() ?? "").join("");
  return email.slice(0, 2).toUpperCase();
}

export default async function DashboardAccountPage() {
  const session = await getServerSession();
  if (!session?.user) redirect("/sign-in?redirectTo=/dashboard/akun");

  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  const isId = locale === "id";
  const name = session.user.name ?? "";
  const email = session.user.email ?? "";

  return (
    <main className="flex flex-col gap-8">
      <header className="max-w-3xl">
        <div className="text-sm uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">
          {isId ? "Akun" : "Account"}
        </div>
        <h1 className="mt-4 text-balance font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-foreground)] sm:text-4xl">
          {isId ? "Akun dan sesi Anda" : "Your account and session"}
        </h1>
        <p className="mt-3 text-base leading-7 text-[var(--color-muted-foreground)]">
          {isId
            ? "Akun yang sama dipakai untuk web app dan ekstensi, sehingga lisensi dan pengaturan tersinkron otomatis."
            : "The same account is used for the web app and the extension, so your license and settings stay in sync."}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <Card className="bg-[var(--color-card)]">
          <CardHeader className="gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
              <BadgeCheck className="h-4 w-4" />
              {isId ? "Profil" : "Profile"}
            </div>
            <CardTitle>{name || email}</CardTitle>
            <CardDescription>
              {isId
                ? "Nama dan email ini dipakai pada invoice pembayaran dan aktivasi ekstensi."
                : "This name and email are used on your payment invoice and extension activation."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[14px] bg-[linear-gradient(135deg,rgba(124,58,237,0.95),rgba(217,70,239,0.9))] text-base font-bold tracking-[0.14em] text-white">
                {initials(name, email)}
              </div>
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-foreground)]">
                  <UserRound className="h-4 w-4 text-[var(--color-primary)]" />
                  <span className="truncate">{name || "-"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[var(--color-muted-foreground)]">
                  <Mail className="h-4 w-4 text-[var(--color-primary)]" />
                  <span className="truncate">{email}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-[var(--color-card)]">
            <CardHeader className="gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                <CalendarDays className="h-4 w-4" />
                {isId ? "Sesi aktif" : "Active session"}
              </div>
              <CardDescription>
                {isId
                  ? "Anda sedang masuk di perangkat ini. Keluar akan mengakhiri sesi di browser ini saja."
                  : "You are signed in on this device. Signing out ends the session in this browser only."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SignOutButton
                label={isId ? "Keluar dari akun" : "Sign out"}
                pendingLabel={isId ? "Keluar..." : "Signing out..."}
              />
            </CardContent>
          </Card>

          <Card className="bg-[var(--color-card)]">
            <CardHeader className="gap-3">
              <CardTitle>{isId ? "Butuh bantuan?" : "Need help?"}</CardTitle>
              <CardDescription>
                {isId
                  ? "Untuk perubahan email, penggantian perangkat, atau kendala pembayaran, hubungi kami melalui email dan sertakan kode lisensi Anda."
                  : "For email changes, device replacement, or payment issues, email us and include your license code."}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </main>
  );
}
