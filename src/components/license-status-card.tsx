"use client";

import { useState } from "react";
import { Check, Clock3, Copy, Eye, EyeOff, KeyRound, ShieldAlert } from "lucide-react";

import type { LicenseSnapshot } from "@/types/domain";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type LicenseStatusCardProps = {
  snapshot: LicenseSnapshot;
  locale: "id" | "en";
  dictionary: {
    title: string;
    keyLabel: string;
    keyEmpty: string;
    checkedLabel: string;
    checkedEmpty: string;
    updateLabel: string;
    updateDescription: string;
    tones: {
      inactive: { label: string; helper: string };
      active: { label: string; helper: string };
      revoked: { label: string; helper: string };
    };
    copyLabel: string;
    copiedLabel: string;
    purchaseHint: string;
  };
};

const toneClasses = {
  inactive:
    "border-amber-500/30 bg-amber-500/10 text-amber-300 shadow-[0_8px_30px_rgba(217,119,6,0.12)]",
  active:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-[0_8px_30px_rgba(5,150,105,0.12)]",
  revoked:
    "border-rose-500/30 bg-rose-500/10 text-rose-400 shadow-[0_8px_30px_rgba(225,29,72,0.12)]",
} as const;

function maskVisibleLicenseKey(value: string | null | undefined) {
  if (!value) return value ?? "";

  const parts = value.split("-");
  if (parts.length >= 3) {
    return `${parts[0]}-${parts[1]}••••-${parts[parts.length - 1]}`;
  }

  if (value.length <= 8) {
    return "••••••••";
  }

  return `${value.slice(0, 4)}••••${value.slice(-4)}`;
}

export function LicenseStatusCard({
  snapshot,
  locale,
  dictionary,
}: LicenseStatusCardProps) {
  const tone = dictionary.tones[snapshot.status];
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const hasCopyableKey = Boolean(snapshot.hasPurchased && snapshot.licenseKey);

  async function handleCopy() {
    if (!snapshot.licenseKey) return;
    await navigator.clipboard.writeText(snapshot.licenseKey);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <Card
      className={
        hasCopyableKey
          ? "border-emerald-500/30 bg-[linear-gradient(180deg,rgba(28,25,39,0.92),rgba(21,19,29,0.96))] shadow-[0_24px_55px_rgba(5,150,105,0.12)]"
          : "bg-[var(--color-card)]"
      }
    >
      <CardHeader className="gap-4">
        {hasCopyableKey ? (
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400 shadow-sm">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.14)]" />
            {locale === "id" ? "Pembayaran terkonfirmasi" : "Payment confirmed"}
          </div>
        ) : null}
        <div className="flex items-center justify-between gap-3">
          <CardTitle>{dictionary.title}</CardTitle>
          <Badge className={toneClasses[snapshot.status]}>{tone.label}</Badge>
        </div>
        <p className="text-sm leading-6 text-[var(--color-muted-foreground)]">
          {snapshot.hasPurchased ? tone.helper : dictionary.purchaseHint}
        </p>
      </CardHeader>
      <CardContent className={hasCopyableKey ? "space-y-4" : "grid gap-4 sm:grid-cols-2"}>
        <div
          className={
            hasCopyableKey
              ? "relative overflow-hidden rounded-[18px] border border-emerald-500/30 bg-[linear-gradient(135deg,rgba(6,78,59,0.40),rgba(21,19,29,0.92))] p-5 shadow-[0_18px_40px_rgba(5,150,105,0.10)]"
              : "rounded-2xl bg-[var(--color-surface)] p-4"
          }
        >
          {hasCopyableKey ? (
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.14),_transparent_32%),linear-gradient(135deg,_rgba(255,255,255,0.24),_transparent_55%)]" />
          ) : null}
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-foreground)]">
                <KeyRound className="h-4 w-4 text-[var(--color-primary)]" />
                {dictionary.keyLabel}
              </div>
              {hasCopyableKey ? (
                <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-400">
                  {locale === "id"
                    ? "Siap untuk aktivasi ekstensi"
                    : "Ready for extension activation"}
                </div>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              {hasCopyableKey ? (
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() => setIsVisible((current) => !current)}
                  className="relative h-9 w-9 border border-emerald-500/30 bg-[var(--color-card)] p-0 shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--color-surface-strong)]"
                  aria-label={isVisible ? "Sembunyikan kode lisensi" : "Tampilkan kode lisensi"}
                  title={isVisible ? "Sembunyikan kode lisensi" : "Tampilkan kode lisensi"}
                >
                  {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              ) : null}
              {hasCopyableKey ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="relative border border-emerald-500/30 bg-[var(--color-card)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--color-surface-strong)]"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? dictionary.copiedLabel : dictionary.copyLabel}
                </Button>
              ) : null}
            </div>
          </div>
          <div
            className={`break-all ${
              hasCopyableKey
                ? "relative rounded-2xl border border-white/70 bg-[var(--color-card)] px-4 py-4 font-mono text-lg font-semibold tracking-[0.18em] text-[var(--color-foreground)] shadow-sm"
                : "text-sm text-[var(--color-muted-foreground)]"
            }`}
          >
            {hasCopyableKey
              ? isVisible
                ? snapshot.licenseKey
                : maskVisibleLicenseKey(snapshot.licenseKey) ?? dictionary.keyEmpty
              : snapshot.licenseKeyMasked ?? dictionary.keyEmpty}
          </div>
          {hasCopyableKey ? (
            <p className="mt-3 text-sm leading-6 text-[var(--color-muted-foreground)]">
              {locale === "id"
                ? "Salin kode lisensi ini, lalu tempelkan ke ekstensi FluentRemote saat aktivasi pertama di browser Anda."
                : "Copy this license key, then paste it into the FluentRemote extension during the first activation in your browser."}
            </p>
          ) : null}
        </div>
        <div className="rounded-2xl bg-[var(--color-surface)] p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--color-foreground)]">
            <Clock3 className="h-4 w-4 text-[var(--color-primary)]" />
            {dictionary.checkedLabel}
          </div>
          <div className="text-sm text-[var(--color-muted-foreground)]">
            {snapshot.lastCheckedAt
              ? new Date(snapshot.lastCheckedAt).toLocaleString(
                  locale === "id" ? "id-ID" : "en-US",
                  {
                    dateStyle: "medium",
                    timeStyle: "short",
                  },
                )
              : dictionary.checkedEmpty}
          </div>
        </div>
        <div
          className={`rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-card)] p-4 ${
            hasCopyableKey ? "" : "sm:col-span-2"
          }`}
        >
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--color-foreground)]">
            <ShieldAlert className="h-4 w-4 text-[var(--color-primary)]" />
            {dictionary.updateLabel}
          </div>
          <div className="text-sm leading-6 text-[var(--color-muted-foreground)]">
            {dictionary.updateDescription}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
