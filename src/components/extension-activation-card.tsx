"use client";

import { useState } from "react";
import { Check, Copy, KeyRound, LockKeyhole } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ExtensionActivationCardProps = {
  locale: "id" | "en";
  hasPurchased: boolean;
  licenseKey: string | null;
};

export function ExtensionActivationCard({
  locale,
  hasPurchased,
  licenseKey,
}: ExtensionActivationCardProps) {
  const [copied, setCopied] = useState(false);
  const isId = locale === "id";

  async function handleCopy() {
    if (!licenseKey) return;
    await navigator.clipboard.writeText(licenseKey);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <Card
      className={
        hasPurchased
          ? "border-emerald-200/80 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98)_0%,_rgba(241,253,248,0.94)_100%)] shadow-[0_24px_55px_rgba(5,150,105,0.12)]"
          : "border-amber-200 bg-[linear-gradient(180deg,_rgba(255,251,235,0.96)_0%,_rgba(255,255,255,0.92)_100%)]"
      }
    >
      <CardHeader className="gap-4">
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
          {hasPurchased ? (
            <KeyRound className="h-4 w-4" />
          ) : (
            <LockKeyhole className="h-4 w-4 text-amber-700" />
          )}
          {isId ? "Aktivasi extension" : "Extension activation"}
        </div>
        <CardTitle>
          {hasPurchased
            ? isId
              ? "Copy license key ini untuk aktivasi pertama di extension."
              : "Copy this license key for the first activation inside the extension."
            : isId
              ? "License key akan muncul di sini setelah pembayaran sukses."
              : "Your license key will appear here after a successful payment."}
        </CardTitle>
        <CardDescription>
          {hasPurchased
            ? isId
              ? "Setelah extension dipasang, paste key ini saat prompt aktivasi pertama muncul di browser."
              : "Once the extension is installed, paste this key when the first activation prompt appears in your browser."
            : isId
              ? "Selesaikan checkout dulu agar FluentRemote dapat menerbitkan license key unik ke akun Anda."
              : "Complete checkout first so FluentRemote can issue a unique license key to your account."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={`rounded-[28px] border px-5 py-5 ${
            hasPurchased
              ? "border-emerald-200 bg-white/92 shadow-sm"
              : "border-amber-200 bg-white/70"
          }`}
        >
          <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-muted-foreground)]">
            {isId ? "License key" : "License key"}
          </div>
          <div
            className={`break-all font-mono ${
              hasPurchased
                ? "text-lg font-semibold tracking-[0.18em] text-[var(--color-foreground)]"
                : "text-sm text-[var(--color-muted-foreground)]"
            }`}
          >
            {licenseKey ??
              (isId ? "Akan diterbitkan otomatis setelah pembayaran." : "Issued automatically after payment.")}
          </div>
        </div>

        <Button
          type="button"
          onClick={handleCopy}
          disabled={!hasPurchased || !licenseKey}
          className="w-full sm:w-auto"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied
            ? isId
              ? "Tersalin"
              : "Copied"
            : isId
              ? "Copy license key"
              : "Copy license key"}
        </Button>

        <div className="grid gap-3">
          {(isId
            ? [
                "1. Install extension FluentRemote di Chrome begitu paketnya tersedia.",
                "2. Saat layar aktivasi pertama muncul, paste license key dari dashboard ini.",
                "3. Login dengan akun yang sama agar provider key dan preferensi bahasa tersinkron.",
              ]
            : [
                "1. Install the FluentRemote extension in Chrome once the package is available.",
                "2. When the first activation screen appears, paste the license key from this dashboard.",
                "3. Sign in with the same account so provider keys and language preferences sync automatically.",
              ]
          ).map((step) => (
            <div
              key={step}
              className="rounded-2xl border border-[var(--color-border)] bg-white/70 px-4 py-4 text-sm leading-7 text-[var(--color-muted-foreground)]"
            >
              {step}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
