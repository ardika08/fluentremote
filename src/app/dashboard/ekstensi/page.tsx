import { redirect } from "next/navigation";
import { BadgeCheck, Layers3, Puzzle } from "lucide-react";

import { ExtensionActivationCard } from "@/components/extension-activation-card";
import { ExtensionPopupPreview } from "@/components/extension-popup-preview";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getServerSession } from "@/lib/auth-server";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { getLicenseSnapshot, getPreferences } from "@/lib/license";

export default async function DashboardExtensionPage() {
  const session = await getServerSession();
  if (!session?.user) redirect("/sign-in?redirectTo=/dashboard/ekstensi");

  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  const isId = locale === "id";
  const [snapshot, preferences] = await Promise.all([getLicenseSnapshot(), getPreferences()]);

  return (
    <main className="flex flex-col gap-8">
      <header className="max-w-3xl">
        <div className="text-sm uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">
          {isId ? "Ekstensi" : "Extension"}
        </div>
        <h1 className="mt-4 text-balance font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-foreground)] sm:text-4xl">
          {isId ? "Pasang ekstensi Chrome FluentRemote" : "Install the FluentRemote Chrome extension"}
        </h1>
        <p className="mt-3 text-base leading-7 text-[var(--color-muted-foreground)]">
          {isId
            ? "Kode lisensi di halaman ini dipakai saat aktivasi pertama. API key tetap tersimpan di web, tidak di ekstensi."
            : "The license code on this page is used during first activation. API keys stay in the web app, not in the extension."}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <ExtensionActivationCard
          locale={locale}
          hasPurchased={snapshot.hasPurchased}
          licenseKey={snapshot.licenseKey}
        />

        <Card className="bg-[var(--color-card)]">
          <CardHeader className="gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
              <Puzzle className="h-4 w-4" />
              {dictionary.installGuidePage.availabilityTitle}
            </div>
            <CardTitle>
              {isId ? "Status ketersediaan ekstensi" : "Extension availability"}
            </CardTitle>
            <CardDescription>
              {snapshot.status === "active"
                ? isId
                  ? "Ekstensi sudah siap dipasang. Ikuti langkah di bawah, lalu masukkan kode lisensi Anda saat aktivasi."
                  : "The extension is ready to install. Follow the steps below, then enter your license code during activation."
                : isId
                  ? "Selesaikan pembelian terlebih dahulu untuk membuka panduan instalasi lengkap."
                  : "Complete your purchase first to unlock the full installation guide."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-[var(--color-muted-foreground)]">
              <BadgeCheck className="h-4 w-4 text-[var(--color-primary)]" />
              {isId ? "Aktivasi memakai akun yang sama seperti di web ini." : "Activation uses the same account as this web app."}
            </div>
            <Badge>
              {dictionary.settingsPage.signedInAs} {session.user.email}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[var(--color-card)]">
        <CardHeader className="gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
            <Layers3 className="h-4 w-4" />
            {dictionary.installGuidePage.stepsTitle}
          </div>
          <CardTitle>{dictionary.settingsPage.howItWorks.title}</CardTitle>
          <CardDescription>{dictionary.settingsPage.howItWorks.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {dictionary.installGuidePage.steps.map((step) => (
            <div
              key={step}
              className="rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4 text-sm leading-7 text-[var(--color-muted-foreground)]"
            >
              {step}
            </div>
          ))}
        </CardContent>
      </Card>

      <ExtensionPopupPreview
        locale={locale}
        hasPurchased={snapshot.hasPurchased}
        licenseKey={snapshot.licenseKey}
        hasProviderKeys={preferences.hasOpenAIApiKey || preferences.hasMaiaRouterApiKey}
      />
    </main>
  );
}
