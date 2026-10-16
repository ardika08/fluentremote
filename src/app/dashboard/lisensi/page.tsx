import Link from "next/link";
import { redirect } from "next/navigation";
import { KeyRound, MonitorSmartphone, ShieldCheck } from "lucide-react";

import { ActivationForm } from "@/components/activation-form";
import { LicenseStatusCard } from "@/components/license-status-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getServerSession } from "@/lib/auth-server";
import { getDashboardCopy } from "@/lib/dashboard-copy";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { getLicenseSnapshot } from "@/lib/license";

export default async function DashboardLicensePage() {
  const session = await getServerSession();
  if (!session?.user) redirect("/sign-in?redirectTo=/dashboard/lisensi");

  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  const { isId, licenseDictionary, activationDictionary } = getDashboardCopy(locale, dictionary);
  const snapshot = await getLicenseSnapshot();

  return (
    <main className="flex flex-col gap-8">
      <header className="max-w-3xl">
        <div className="text-sm uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">
          {isId ? "Lisensi & Aktivasi" : "License & Activation"}
        </div>
        <h1 className="mt-4 text-balance font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-foreground)] sm:text-4xl">
          {isId ? "Kelola kode lisensi akun Anda" : "Manage your account license code"}
        </h1>
        <p className="mt-3 text-base leading-7 text-[var(--color-muted-foreground)]">
          {isId
            ? "Salin kode lisensi untuk aktivasi ekstensi, atau tempelkan kode baru jika Anda memindahkan lisensi ke akun ini."
            : "Copy your license code for extension activation, or paste a new code if you are moving a license to this account."}
        </p>
      </header>

      {!snapshot.hasPurchased ? (
        <Card className="border-amber-500/30 bg-[linear-gradient(180deg,rgba(120,53,15,0.30),rgba(21,19,29,0.92))]">
          <CardHeader className="gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
              <KeyRound className="h-4 w-4" />
              {isId ? "Belum ada lisensi" : "No license yet"}
            </div>
            <CardTitle>{licenseDictionary.purchaseHint}</CardTitle>
            <CardDescription>
              {isId
                ? "Setelah pembayaran terkonfirmasi, kode lisensi terbit otomatis di halaman ini."
                : "Once payment is confirmed, your license code is issued automatically on this page."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/checkout">{isId ? "Buka pembelian" : "Open checkout"}</Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <LicenseStatusCard snapshot={snapshot} locale={locale} dictionary={licenseDictionary} />

        <div className="space-y-6">
          {snapshot.hasPurchased ? (
            <ActivationForm initialSnapshot={snapshot} dictionary={activationDictionary} />
          ) : null}

          <Card className="bg-[var(--color-card)]">
            <CardHeader className="gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                <MonitorSmartphone className="h-4 w-4" />
                {isId ? "Pengikatan perangkat" : "Device binding"}
              </div>
              <CardTitle>
                {isId ? "Satu kode lisensi untuk satu perangkat aktif" : "One license code per active device"}
              </CardTitle>
              <CardDescription>
                {isId
                  ? "Kode lisensi terikat pada perangkat saat aktivasi ekstensi. Jika Anda mengganti komputer atau profil browser, gunakan kode yang sama lalu hubungi kami bila perlu aktivasi ulang."
                  : "The license code is bound to a device during extension activation. If you change computers or browser profiles, reuse the same code and contact us if you need a re-activation."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="secondary">
                <Link href="/dashboard/ekstensi">
                  {isId ? "Buka panduan pemasangan ekstensi" : "Open the extension install guide"}
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[var(--color-card)]">
            <CardHeader className="gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                <ShieldCheck className="h-4 w-4" />
                {isId ? "Privasi teks percakapan" : "Conversation privacy"}
              </div>
              <CardDescription>
                {isId
                  ? "Teks yang Anda sorot dikirim langsung ke provider AI pilihan Anda dan tidak disimpan di server kami. Yang tersimpan hanya API key terenkripsi dan pengaturan bahasa."
                  : "Text you highlight goes straight to your chosen AI provider and is not stored on our servers. Only your encrypted API keys and language settings are saved."}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </main>
  );
}
