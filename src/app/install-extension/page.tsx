import Link from "next/link";
import { Download, Layers3, ShieldCheck, ShoppingCart } from "lucide-react";
import { redirect } from "next/navigation";

import { ExtensionActivationCard } from "@/components/extension-activation-card";
import { ExtensionPopupPreview } from "@/components/extension-popup-preview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getServerSession } from "@/lib/auth-server";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { getLicenseSnapshot, getPreferences } from "@/lib/license";

export default async function InstallExtensionPage() {
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/sign-in");
  }

  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  const [snapshot, preferences] = await Promise.all([getLicenseSnapshot(), getPreferences()]);
  const isId = locale === "id";
  const availabilityCopy = {
    ready: isId
      ? "MVP extension sudah tersedia di repo ini dan bisa dipasang lewat mode Load unpacked di Chrome."
      : "The extension MVP is already available in this repo and can be installed through Chrome's Load unpacked mode.",
    pending: isId
      ? "Selesaikan checkout terlebih dulu, lalu gunakan folder extension MVP dari repo ini melalui mode Load unpacked di Chrome."
      : "Complete checkout first, then use the extension MVP folder from this repo through Chrome's Load unpacked mode.",
    button: isId ? "Gunakan folder extension/" : "Use extension/ folder",
  };

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-12 lg:px-10">
      <div className="max-w-3xl">
        <div className="text-sm uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">
          {dictionary.installGuidePage.eyebrow}
        </div>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-[var(--color-foreground)]">
          {dictionary.installGuidePage.title}
        </h1>
        <p className="mt-4 text-base leading-7 text-[var(--color-muted-foreground)]">
          {dictionary.installGuidePage.description}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <ExtensionActivationCard
          locale={locale}
          hasPurchased={snapshot.hasPurchased}
          licenseKey={snapshot.licenseKey}
        />

        <Card className="bg-white/88">
          <CardHeader className="gap-4">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
              <Download className="h-4 w-4" />
              {dictionary.installGuidePage.availabilityTitle}
            </div>
            <CardTitle>{dictionary.settingsPage.extensionSetup.title}</CardTitle>
            <CardDescription>
              {dictionary.installGuidePage.availabilityDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4 text-sm leading-7 text-[var(--color-muted-foreground)]">
              {snapshot.status === "active"
                ? availabilityCopy.ready
                : availabilityCopy.pending}
            </div>
            {snapshot.hasPurchased ? (
              <Button disabled className="w-full sm:w-auto">
                <Download className="h-4 w-4" />
                {availabilityCopy.button}
              </Button>
            ) : (
              <Button asChild className="w-full sm:w-auto">
                <Link href="/checkout">
                  <ShoppingCart className="h-4 w-4" />
                  {isId ? "Selesaikan checkout dulu" : "Complete checkout first"}
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/88">
        <CardHeader className="gap-4">
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
              className="rounded-2xl border border-[var(--color-border)] bg-white/70 px-4 py-4 text-sm leading-7 text-[var(--color-muted-foreground)]"
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

      <Card className="bg-white/88">
        <CardHeader className="gap-4">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
            <ShieldCheck className="h-4 w-4" />
            {dictionary.installGuidePage.syncEyebrow}
          </div>
          <CardTitle>{dictionary.installGuidePage.syncTitle}</CardTitle>
          <CardDescription>{dictionary.installGuidePage.syncDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <Badge className="mb-4">
            {dictionary.settingsPage.signedInAs} {session.user.email}
          </Badge>
          <Button asChild variant="secondary">
            <Link href="/settings">{dictionary.installGuidePage.backToSettings}</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
