import { AlertCircle, CheckCircle2, KeyRound, LockKeyhole, Sparkles } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ExtensionPopupPreviewProps = {
  locale: "id" | "en";
  hasPurchased: boolean;
  licenseKey: string | null;
  hasProviderKeys: boolean;
};

export function ExtensionPopupPreview({
  locale,
  hasPurchased,
  licenseKey,
  hasProviderKeys,
}: ExtensionPopupPreviewProps) {
  const isId = locale === "id";
  const canActivate = hasPurchased && Boolean(licenseKey);

  return (
    <Card className="bg-[var(--color-card)]">
      <CardHeader className="gap-4">
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
          <Sparkles className="h-4 w-4" />
          {isId ? "Preview popup extension" : "Extension popup preview"}
        </div>
        <CardTitle>
          {isId
            ? "Beginilah tampilan aktivasi pertama saat extension dibuka."
            : "This is how the first activation looks when the extension opens."}
        </CardTitle>
        <CardDescription>
          {isId
            ? "User cukup paste license key dari dashboard, lalu login dengan akun yang sama agar sinkronisasi preference dan provider key berjalan otomatis."
            : "The user only needs to paste the license key from the dashboard, then sign in with the same account so preferences and provider keys sync automatically."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mx-auto max-w-sm rounded-[18px] border border-[var(--color-border)] bg-[linear-gradient(180deg,rgba(28,25,39,0.92),rgba(21,19,29,0.96))] p-4 shadow-[0_26px_65px_rgba(15,23,42,0.12)]">
          <div className="flex items-center justify-between gap-3 rounded-[22px] bg-[var(--color-background)] px-4 py-3 text-white">
            <div>
              <div className="text-sm font-semibold">FluentRemote</div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-300">
                {isId ? "Aktivasi awal" : "First activation"}
              </div>
            </div>
            <div
              className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${
                hasPurchased
                  ? "bg-emerald-400/15 text-emerald-200"
                  : "bg-amber-400/15 text-amber-200"
              }`}
            >
              {hasPurchased
                ? isId
                  ? "Siap"
                  : "Ready"
                : isId
                  ? "Terkunci"
                  : "Locked"}
            </div>
          </div>

          <div className="mt-4 space-y-4 rounded-[16px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-foreground)]">
              {hasPurchased ? (
                <KeyRound className="h-4 w-4 text-[var(--color-primary)]" />
              ) : (
                <LockKeyhole className="h-4 w-4 text-amber-300" />
              )}
              {isId ? "Masukkan license key" : "Enter license key"}
            </div>

            <div
              className={`rounded-2xl border px-4 py-4 font-mono text-sm ${
                hasPurchased
                  ? "border-emerald-500/30 bg-emerald-500/1070 text-[var(--color-foreground)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] text-slate-400"
              }`}
            >
              {hasPurchased && licenseKey
                ? licenseKey
                : isId
                  ? "Paste license key dari dashboard"
                  : "Paste the license key from your dashboard"}
            </div>

            <div className="grid gap-3">
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-slate-400">
                {isId
                  ? "Langkah berikutnya: login dengan akun yang sama untuk sync provider key dan preferensi."
                  : "Next step: sign in with the same account to sync provider keys and preferences."}
              </div>
              {canActivate && !hasProviderKeys ? (
                <div className="rounded-2xl border border-amber-500/30 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-300">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      {isId
                        ? "API key provider belum tersedia di akun ini. Buka Settings dan isi OpenAI API Key atau MAIA Router API Key terlebih dulu."
                        : "Provider API keys are not available on this account yet. Open Settings and fill in your OpenAI API Key or MAIA Router API Key first."}
                    </span>
                  </div>
                </div>
              ) : null}
              <div
                className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold ${
                  canActivate && hasProviderKeys
                    ? "bg-[var(--color-primary)] text-white shadow-[0_18px_40px_rgba(124,58,237,0.22)]"
                    : "bg-white/15 text-slate-400"
                }`}
              >
                {canActivate && hasProviderKeys ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <LockKeyhole className="h-4 w-4" />
                )}
                {canActivate
                  ? hasProviderKeys
                    ? isId
                      ? "Aktifkan extension"
                      : "Activate extension"
                    : isId
                      ? "Lengkapi API key di Settings"
                      : "Complete API keys in Settings"
                  : isId
                    ? "Menunggu pembayaran"
                    : "Waiting for payment"}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
