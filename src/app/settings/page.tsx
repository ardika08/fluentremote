import { redirect } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Download,
  LockKeyhole,
  ShoppingCart,
  CircleDashed,
} from "lucide-react";

import { LicenseStatusCard } from "@/components/license-status-card";
import { OnboardingStepper } from "@/components/onboarding-stepper";
import { SettingsForm } from "@/components/settings-form";
import { TranslationPlaygroundCard } from "@/components/translation-playground-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getServerSession } from "@/lib/auth-server";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { getLicenseSnapshot, getPreferences } from "@/lib/license";

export default async function SettingsPage() {
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/sign-in");
  }

  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  const [snapshot, preferences] = await Promise.all([
    getLicenseSnapshot(),
    getPreferences(),
  ]);
  const isId = locale === "id";

  const settingsCopy = {
    purchaseBannerTitle: isId
      ? "Anda belum membeli FluentRemote."
      : "You have not purchased FluentRemote yet.",
    purchaseBannerDescription: isId
      ? "Selesaikan pembayaran untuk membuka kode lisensi unik, menyimpan API key provider, dan mengaktifkan ekstensi."
      : "Complete your purchase to unlock your unique license key, provider API key setup, extension activation, and live translation.",
    checkoutLabel: isId ? "Lanjut ke pembelian" : "Continue to checkout",
    lockedWorkspaceEyebrow: isId ? "Pratinjau ruang kerja" : "Workspace preview",
    lockedWorkspaceTitle: isId
      ? "Ruang kerja ini akan terbuka penuh segera setelah pembayaran terkonfirmasi."
      : "This workspace unlocks fully as soon as your payment is confirmed.",
    lockedWorkspaceDescription: isId
      ? "Sebelum membeli, kami sengaja tidak menampilkan form aktif agar area ini tetap terasa premium dan fokus pada langkah berikutnya."
      : "Before purchase, the active form stays hidden so this area feels premium and keeps the next step focused.",
    lockedWorkspaceSupport: isId
      ? "Setelah pembayaran sukses, area ini langsung berubah menjadi panel aktif untuk kode lisensi, API key provider, dan sinkronisasi ekstensi."
      : "After a successful payment, this area turns directly into the active panel for your license key, provider API keys, and extension sync.",
    lockedWorkspaceHint: isId
      ? "Checkout sekali untuk membuka seluruh workflow."
      : "Complete one checkout to unlock the full workflow.",
    lockedWorkspaceNote: isId
      ? "Begitu Mayar mengonfirmasi pembayaran, halaman ini langsung berubah menjadi ruang kerja aktif tanpa langkah manual tambahan."
      : "As soon as Mayar confirms the payment, this page turns into the active workspace without extra manual steps.",
    extensionTitle: isId
      ? "Pasang alat browser agar FluentRemote bisa dipakai langsung di chat Anda."
      : "Install the browser tool so FluentRemote can work directly inside your chats.",
    extensionDescription: isId
      ? "Setelah akun Anda memiliki lisensi dan API key provider tersimpan di Pengaturan, ekstensi dapat diaktifkan dengan menempelkan kode lisensi saat pertama dipasang."
      : "Once your account has a license and provider API keys saved in Settings, the extension can be activated by pasting the license key during first install.",
    extensionReady: isId
      ? "Akses sudah aktif. Buka panduan instalasi, lalu gunakan kode lisensi Anda saat aktivasi ekstensi."
      : "Access is active. Open the installation guide, then use your license key during extension activation.",
    extensionLocked: isId
      ? "Area ini tetap terlihat sebagai preview, tetapi baru aktif penuh setelah pembayaran sukses."
      : "This area stays visible as a preview, but it only becomes fully active after a successful purchase.",
    extensionGuide: isId ? "Buka panduan instalasi" : "Open installation guide",
    extensionLockedBadge: isId ? "Terkunci" : "Locked",
    extensionReadyBadge: isId ? "Siap" : "Ready",
    checklistEyebrow: isId ? "Checklist kesiapan" : "Readiness checklist",
    checklistTitle: isId
      ? "Pastikan tiga hal ini siap sebelum ekstensi dipakai."
      : "Make sure these three things are ready before using the extension.",
    checklistDescription: isId
      ? "Checklist ini membantu user melihat langkah mana yang sudah selesai dan mana yang masih perlu dibereskan."
      : "This checklist helps the user see which steps are complete and which still need attention.",
    checklistItems: {
      license: isId
        ? "License aktif dan sudah muncul di akun."
        : "The license is active and already attached to the account.",
      providerKeys: isId
        ? "Minimal satu API key provider sudah tersimpan di Pengaturan."
        : "At least one provider API key is already saved in Settings.",
      extension: isId
        ? "Ekstensi siap dipasang dan diaktivasi dengan kode lisensi yang sama."
        : "The extension is ready to be installed and activated with the same license key.",
    },
    checklistPending: isId ? "Masih menunggu" : "Pending",
    checklistDone: isId ? "Siap" : "Ready",
  };

  const settingsFormDictionary = {
    ...dictionary.settingsForm,
    openAiKeyLabel: isId ? "OpenAI API Key" : "OpenAI API Key",
    openAiKeyPlaceholder: isId
      ? "Masukkan API key OpenAI Anda"
      : "Enter your OpenAI API key",
    openAiKeyStored: isId ? "Key tersimpan" : "Stored key",
    maiaKeyLabel: isId ? "MAIA Router API Key" : "MAIA Router API Key",
    maiaKeyPlaceholder: isId
      ? "Masukkan API key MAIA Router Anda"
      : "Enter your MAIA Router API key",
    maiaKeyStored: isId ? "Key tersimpan" : "Stored key",
    resetLabel: isId ? "Reset" : "Reset",
    resetSuccess: isId
      ? "API key berhasil dihapus dari akun Anda."
      : "The API key was removed from your account.",
    resetError: isId
      ? "API key belum bisa dihapus saat ini."
      : "The API key could not be removed right now.",
    apiKeySectionTitle: isId
      ? "API key provider disimpan di Pengaturan"
      : "Provider API keys are stored in Settings",
    apiKeySectionDescription: isId
      ? "Ekstensi tidak meminta API key saat aktivasi awal. Isi OpenAI API Key dan/atau MAIA Router API Key di sini; ekstensi akan menyinkronkannya otomatis setelah Anda masuk dengan akun yang sama."
      : "The extension does not ask for API keys during first activation. Fill in your OpenAI API Key and/or MAIA Router API Key here, then the extension will sync them automatically after you sign in with the same account.",
    apiKeyPurchaseTitle: isId
      ? "Tools ini tidak termasuk API key"
      : "This tool does not include API keys",
    apiKeyPurchaseDescription: isId
      ? "FluentRemote memakai API key milik Anda sendiri. Jika belum memilikinya, beli API key provider terlebih dahulu lalu simpan di Pengaturan."
      : "FluentRemote uses user-owned API keys. If you do not have one yet, purchase a provider API key first and then save it in Settings.",
    apiKeyOpenAIBuy: isId
      ? "Beli API key OpenAI mulai $5"
      : "Buy OpenAI API key from $5",
    apiKeyMaiaBuy: isId
      ? "Beli API key MAIA Router mulai $1"
      : "Buy MAIA Router API key from $1",
    lockedKeysNotice: isId
      ? "Kolom ini aktif setelah pembelian berhasil."
      : "This field unlocks after a successful purchase.",
  };

  const licenseDictionary = {
    ...dictionary.licenseStatus,
    copyLabel: isId ? "Salin" : "Copy",
    copiedLabel: isId ? "Tersalin" : "Copied",
    keyEmpty: isId ? "Belum diterbitkan" : "Not issued yet",
    checkedEmpty: isId ? "Belum ada pembelian aktif" : "No active purchase yet",
    purchaseHint: isId
      ? "Selesaikan pembayaran untuk mendapatkan kode lisensi unik milik akun Anda."
      : "Complete your purchase to receive the unique license key tied to your account.",
  };

  const playgroundDictionary = {
    ...dictionary.settingsPage.playground,
    inactiveNotice: isId
      ? "Selesaikan pembelian dan simpan API key provider Anda terlebih dulu."
      : "Complete your purchase and save your provider API keys first.",
    checkoutCta: isId ? "Buka pembelian" : "Open checkout",
  };

  const hasProviderKeys =
    preferences.hasOpenAIApiKey || preferences.hasMaiaRouterApiKey;

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-6 py-12 lg:px-10">
      <div className="max-w-3xl">
        <div className="text-sm uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">
          {dictionary.settingsPage.eyebrow}
        </div>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-[var(--color-foreground)]">
          {dictionary.settingsPage.title}
        </h1>
        <p className="mt-4 text-base leading-7 text-[var(--color-muted-foreground)]">
          {dictionary.settingsPage.description}
        </p>
        <p className="mt-3 text-sm text-[var(--color-muted-foreground)]">
          {dictionary.settingsPage.signedInAs}{" "}
          <span className="font-semibold">{session.user.email}</span>
        </p>
      </div>

      {!snapshot.hasPurchased ? (
        <Card className="border-amber-500/30 bg-[linear-gradient(180deg,rgba(120,53,15,0.30),rgba(21,19,29,0.92))]">
          <CardHeader className="gap-4">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
              <ShoppingCart className="h-4 w-4" />
              Menunggu pembayaran
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

      <OnboardingStepper
        currentStep={snapshot.hasPurchased ? 2 : 1}
        steps={dictionary.onboarding}
      />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        {snapshot.hasPurchased ? (
          <SettingsForm
            initialPreferences={preferences}
            snapshot={snapshot}
            dictionary={settingsFormDictionary}
            languageOptions={dictionary.languages}
            providerOptions={dictionary.providers}
          />
        ) : (
          <Card className="overflow-hidden border-[var(--color-border)] bg-[linear-gradient(180deg,rgba(30,20,54,0.98),rgba(21,19,29,0.96))] text-white lg:self-start">
            <CardHeader className="gap-4">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-violet-200">
                <LockKeyhole className="h-4 w-4" />
                {settingsCopy.lockedWorkspaceEyebrow}
              </div>
              <CardTitle className="text-white">{settingsCopy.lockedWorkspaceTitle}</CardTitle>
              <CardDescription className="text-slate-300">
                {settingsCopy.lockedWorkspaceDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="relative overflow-hidden rounded-[18px] border border-white/10 bg-white/6 p-6 shadow-[0_24px_50px_rgba(15,23,42,0.22)]">
                <div className="space-y-5 opacity-55 blur-[2px]">
                  <div className="space-y-2">
                    <div className="h-3 w-28 rounded-full bg-white/20" />
                    <div className="h-14 rounded-2xl border border-white/10 bg-white/8" />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="h-3 w-24 rounded-full bg-white/20" />
                      <div className="h-14 rounded-2xl border border-white/10 bg-white/8" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-24 rounded-full bg-white/20" />
                      <div className="h-14 rounded-2xl border border-white/10 bg-white/8" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-32 rounded-full bg-white/20" />
                    <div className="h-14 rounded-2xl border border-white/10 bg-white/8" />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="h-14 rounded-2xl border border-white/10 bg-white/8" />
                    <div className="h-14 rounded-2xl border border-white/10 bg-white/8" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.1),_transparent_55%)]" />
                <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
                  <div className="max-w-md space-y-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-violet-200/20 bg-white/10 backdrop-blur-md">
                      <LockKeyhole className="h-7 w-7 text-violet-100" />
                    </div>
                    <div className="text-xl font-semibold text-white">
                      {settingsCopy.lockedWorkspaceHint}
                    </div>
                    <p className="text-sm leading-7 text-slate-200">
                      {settingsCopy.lockedWorkspaceSupport}
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-[16px] border border-violet-300/20 bg-violet-300/10 px-5 py-5 text-sm leading-7 text-violet-100">
                {settingsCopy.lockedWorkspaceNote}
              </div>
            </CardContent>
          </Card>
        )}
        <div className="space-y-6">
          <LicenseStatusCard
            snapshot={snapshot}
            locale={locale}
            dictionary={licenseDictionary}
          />
          <Card className="bg-[var(--color-card)]">
            <CardHeader className="gap-4">
              <div className="text-sm uppercase tracking-[0.2em] text-[var(--color-primary)]">
                {settingsCopy.checklistEyebrow}
              </div>
              <CardTitle>{settingsCopy.checklistTitle}</CardTitle>
              <CardDescription>{settingsCopy.checklistDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                {
                  done: snapshot.hasPurchased && snapshot.status === "active",
                  label: settingsCopy.checklistItems.license,
                },
                {
                  done: snapshot.hasPurchased && hasProviderKeys,
                  label: settingsCopy.checklistItems.providerKeys,
                },
                {
                  done:
                    snapshot.hasPurchased &&
                    snapshot.status === "active" &&
                    hasProviderKeys,
                  label: settingsCopy.checklistItems.extension,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`flex items-start justify-between gap-3 rounded-2xl border px-4 py-4 ${
                    item.done
                      ? "border-emerald-500/30 bg-emerald-500/10"
                      : "border-[var(--color-border)] bg-[var(--color-surface)]"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {item.done ? (
                      <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-400" />
                    ) : (
                      <CircleDashed className="mt-0.5 h-5 w-5 text-[var(--color-muted-foreground)]" />
                    )}
                    <div className="text-sm leading-6 text-[var(--color-foreground)]">
                      {item.label}
                    </div>
                  </div>
                  <Badge>
                    {item.done ? settingsCopy.checklistDone : settingsCopy.checklistPending}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="bg-[var(--color-card)]">
            <CardHeader className="gap-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm uppercase tracking-[0.2em] text-[var(--color-primary)]">
                    {dictionary.settingsPage.extensionSetup.eyebrow}
                  </div>
                  <CardTitle className="mt-3">{settingsCopy.extensionTitle}</CardTitle>
                  <CardDescription className="mt-2">
                    {settingsCopy.extensionDescription}
                  </CardDescription>
                </div>
                <Badge>
                  {snapshot.hasPurchased
                    ? settingsCopy.extensionReadyBadge
                    : settingsCopy.extensionLockedBadge}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4 text-sm leading-7 text-[var(--color-muted-foreground)]">
                {snapshot.hasPurchased
                  ? settingsCopy.extensionReady
                  : settingsCopy.extensionLocked}
              </div>
              <div className="flex flex-wrap gap-3">
                {snapshot.hasPurchased ? (
                  <Button asChild>
                    <Link href="/install-extension">
                      <Download className="h-4 w-4" />
                      {settingsCopy.extensionGuide}
                    </Link>
                  </Button>
                ) : (
                  <Button disabled>
                    <LockKeyhole className="h-4 w-4" />
                    {settingsCopy.extensionGuide}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {snapshot.hasPurchased ? (
        <TranslationPlaygroundCard
          preferences={preferences}
          snapshot={snapshot}
          providerLabel={
            dictionary.providers.find((provider) => provider.value === preferences.aiProvider)
              ?.label ?? preferences.aiProvider
          }
          dictionary={playgroundDictionary}
          checkoutHref="/checkout"
        />
      ) : null}
    </main>
  );
}
