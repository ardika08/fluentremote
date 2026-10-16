import Link from "next/link";
import { redirect } from "next/navigation";
import { Languages, LockKeyhole, ShoppingCart } from "lucide-react";

import { SettingsForm } from "@/components/settings-form";
import { TranslationPlaygroundCard } from "@/components/translation-playground-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getServerSession } from "@/lib/auth-server";
import { getDashboardCopy } from "@/lib/dashboard-copy";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { getLicenseSnapshot, getPreferences } from "@/lib/license";

export default async function DashboardTranslationPage() {
  const session = await getServerSession();
  if (!session?.user) redirect("/sign-in?redirectTo=/dashboard/terjemahan");

  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  const { isId, settingsCopy, settingsFormDictionary, playgroundDictionary } = getDashboardCopy(locale, dictionary);
  const [snapshot, preferences] = await Promise.all([getLicenseSnapshot(), getPreferences()]);

  const providerLabel =
    dictionary.providers.find((provider) => provider.value === preferences.aiProvider)?.label ??
    preferences.aiProvider;

  return (
    <main className="flex flex-col gap-8">
      <header className="max-w-3xl">
        <div className="text-sm uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">
          {isId ? "Terjemahan" : "Translation"}
        </div>
        <h1 className="mt-4 text-balance font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-foreground)] sm:text-4xl">
          {isId ? "Atur bahasa dan provider AI Anda" : "Set up your languages and AI provider"}
        </h1>
        <p className="mt-3 text-base leading-7 text-[var(--color-muted-foreground)]">
          {isId
            ? "Pengaturan di halaman ini otomatis dipakai oleh ekstensi FluentRemote setelah Anda masuk dengan akun yang sama."
            : "Settings on this page are picked up automatically by the FluentRemote extension once you sign in with the same account."}
        </p>
      </header>

      {snapshot.hasPurchased ? (
        <>
          <SettingsForm
            initialPreferences={preferences}
            snapshot={snapshot}
            dictionary={settingsFormDictionary}
            languageOptions={dictionary.languages}
            providerOptions={dictionary.providers}
          />
          <TranslationPlaygroundCard
            preferences={preferences}
            snapshot={snapshot}
            providerLabel={providerLabel}
            dictionary={playgroundDictionary}
            checkoutHref="/checkout"
          />
        </>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <Card className="bg-[var(--color-card)]">
            <CardHeader className="gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                <Languages className="h-4 w-4" />
                {isId ? "Pasangan bahasa" : "Language pair"}
              </div>
              <CardTitle>
                {isId ? "Pilih bahasa sumber dan bahasa target" : "Choose your source and target language"}
              </CardTitle>
              <CardDescription>
                {isId
                  ? "Halaman ini terbuka penuh setelah pembelian: pilih bahasa, pilih provider AI, lalu simpan API key Anda."
                  : "This page unlocks fully after purchase: pick your languages, choose an AI provider, then save your API key."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/checkout">
                  <ShoppingCart className="h-4 w-4" />
                  {settingsCopy.checkoutLabel}
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="overflow-hidden bg-[linear-gradient(180deg,rgba(30,20,54,0.98),rgba(21,19,29,0.96))]">
            <CardHeader className="gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
                <LockKeyhole className="h-4 w-4" />
                {settingsCopy.lockedWorkspaceEyebrow}
              </div>
              <CardTitle>{settingsCopy.lockedWorkspaceTitle}</CardTitle>
              <CardDescription className="text-slate-300">{settingsCopy.lockedWorkspaceSupport}</CardDescription>
            </CardHeader>
          </Card>
        </div>
      )}
    </main>
  );
}
