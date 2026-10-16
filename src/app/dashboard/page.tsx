import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  CircleDashed,
  KeyRound,
  Languages,
  Puzzle,
  ShoppingCart,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getServerSession } from "@/lib/auth-server";
import { getDashboardCopy } from "@/lib/dashboard-copy";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { getLicenseSnapshot, getPreferences } from "@/lib/license";

export default async function DashboardOverviewPage() {
  const session = await getServerSession();
  if (!session?.user) redirect("/sign-in?redirectTo=/dashboard");

  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  const { isId, settingsCopy } = getDashboardCopy(locale, dictionary);
  const [snapshot, preferences] = await Promise.all([getLicenseSnapshot(), getPreferences()]);
  const hasProviderKeys = preferences.hasOpenAIApiKey || preferences.hasMaiaRouterApiKey;

  const checklist = [
    { done: snapshot.hasPurchased && snapshot.status === "active", label: settingsCopy.checklistItems.license, href: "/dashboard/lisensi" },
    { done: snapshot.hasPurchased && hasProviderKeys, label: settingsCopy.checklistItems.providerKeys, href: "/dashboard/terjemahan" },
    {
      done: snapshot.hasPurchased && snapshot.status === "active" && hasProviderKeys,
      label: settingsCopy.checklistItems.extension,
      href: "/dashboard/ekstensi",
    },
  ];

  const nextStep = !snapshot.hasPurchased
    ? {
        label: isId ? "Selesaikan pembelian" : "Complete your purchase",
        description: isId
          ? "Lisensi, API key, dan ekstensi terbuka setelah pembayaran terkonfirmasi."
          : "License, API keys, and the extension unlock once payment is confirmed.",
        href: "/checkout",
        cta: settingsCopy.checkoutLabel,
      }
    : !hasProviderKeys
      ? {
          label: isId ? "Simpan API key provider" : "Save a provider API key",
          description: isId
            ? "Terjemahan baru bisa berjalan setelah minimal satu API key provider tersimpan."
            : "Translation runs once at least one provider API key is saved.",
          href: "/dashboard/terjemahan",
          cta: isId ? "Buka halaman Terjemahan" : "Open the Translation page",
        }
      : {
          label: isId ? "Pasang ekstensi di Chrome" : "Install the extension in Chrome",
          description: isId
            ? "Tempelkan kode lisensi Anda saat aktivasi pertama di browser."
            : "Paste your license code during the first activation in the browser.",
          href: "/dashboard/ekstensi",
          cta: isId ? "Buka panduan instalasi" : "Open the installation guide",
        };

  const statusCards = [
    {
      icon: KeyRound,
      label: isId ? "Status lisensi" : "License status",
      value: snapshot.hasPurchased ? (isId ? "Aktif" : "Active") : isId ? "Belum aktif" : "Inactive",
      hint: snapshot.licenseKeyMasked ?? (isId ? "Belum diterbitkan" : "Not issued yet"),
    },
    {
      icon: Languages,
      label: isId ? "Pasangan bahasa" : "Language pair",
      value: `${preferences.sourceLanguage} → ${preferences.targetLanguage}`,
      hint: isId ? "Ubah kapan saja di halaman Terjemahan" : "Change anytime on the Translation page",
    },
    {
      icon: Puzzle,
      label: isId ? "Provider AI" : "AI provider",
      value: preferences.aiProvider === "maia_router" ? "MAIA Router" : "OpenAI GPT-4o mini",
      hint: hasProviderKeys ? (isId ? "API key tersimpan" : "API key saved") : isId ? "API key belum diisi" : "API key not set",
    },
  ];

  return (
    <main className="flex flex-col gap-8">
      <header className="max-w-3xl">
        <div className="text-sm uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">
          {isId ? "Dashboard" : "Dashboard"}
        </div>
        <h1 className="mt-4 text-balance font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-foreground)] sm:text-4xl">
          {isId ? "Ringkasan akun FluentRemote Anda" : "Your FluentRemote account overview"}
        </h1>
        <p className="mt-3 text-sm text-[var(--color-muted-foreground)]">
          {dictionary.settingsPage.signedInAs} <span className="font-semibold">{session.user.email}</span>
        </p>
      </header>

      {!snapshot.hasPurchased ? (
        <Card className="border-amber-500/30 bg-[linear-gradient(180deg,rgba(120,53,15,0.30),rgba(21,19,29,0.92))]">
          <CardHeader className="gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
              <ShoppingCart className="h-4 w-4" />
              {isId ? "Menunggu pembayaran" : "Awaiting payment"}
            </div>
            <CardTitle>{settingsCopy.purchaseBannerTitle}</CardTitle>
            <CardDescription>{settingsCopy.purchaseBannerDescription}</CardDescription>
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
      ) : null}

      <div className="grid gap-5 sm:grid-cols-3">
        {statusCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label} className="bg-[var(--color-card)]">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                  <Icon className="h-4 w-4" />
                  {card.label}
                </div>
                <div className="mt-3 text-lg font-semibold text-[var(--color-foreground)]">{card.value}</div>
                <div className="mt-1 text-xs text-[var(--color-muted-foreground)]">{card.hint}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <Card className="bg-[var(--color-card)]">
          <CardHeader className="gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
              <CheckCircle2 className="h-4 w-4" />
              {settingsCopy.checklistEyebrow}
            </div>
            <CardTitle>{settingsCopy.checklistTitle}</CardTitle>
            <CardDescription>{settingsCopy.checklistDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {checklist.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-start justify-between gap-3 rounded-[14px] border px-4 py-4 transition-colors ${
                  item.done
                    ? "border-emerald-500/30 bg-emerald-500/10"
                    : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[rgba(139,92,246,0.35)]"
                }`}
              >
                <div className="flex items-start gap-3">
                  {item.done ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-400" />
                  ) : (
                    <CircleDashed className="mt-0.5 h-5 w-5 text-[var(--color-muted-foreground)]" />
                  )}
                  <div className="text-sm leading-6 text-[var(--color-foreground)]">{item.label}</div>
                </div>
                <Badge>{item.done ? settingsCopy.checklistDone : settingsCopy.checklistPending}</Badge>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-[linear-gradient(180deg,rgba(30,20,54,0.98),rgba(21,19,29,0.96))]">
          <CardHeader className="gap-3">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
              {isId ? "Langkah berikutnya" : "Next step"}
            </div>
            <CardTitle>{nextStep.label}</CardTitle>
            <CardDescription className="text-slate-300">{nextStep.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href={nextStep.href}>
                {nextStep.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
