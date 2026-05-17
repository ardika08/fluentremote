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
    "border-amber-200 bg-amber-100/80 text-amber-900 shadow-[0_8px_30px_rgba(217,119,6,0.12)]",
  active:
    "border-emerald-200 bg-emerald-100/80 text-emerald-900 shadow-[0_8px_30px_rgba(5,150,105,0.12)]",
  revoked:
    "border-rose-200 bg-rose-100/80 text-rose-900 shadow-[0_8px_30px_rgba(225,29,72,0.12)]",
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
          ? "border-emerald-200/80 bg-[linear-gradient(180deg,_rgba(255,255,255,0.96)_0%,_rgba(241,253,248,0.94)_100%)] shadow-[0_24px_55px_rgba(5,150,105,0.12)]"
          : "bg-white/82"
      }
    >
      <CardHeader className="gap-4">
        {hasCopyableKey ? (
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-800 shadow-sm">
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
              ? "relative overflow-hidden rounded-[28px] border border-emerald-200 bg-[linear-gradient(135deg,_rgba(236,253,245,0.95)_0%,_rgba(239,246,255,0.92)_100%)] p-5 shadow-[0_18px_40px_rgba(5,150,105,0.10)]"
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
                <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700">
                  {locale === "id"
                    ? "Siap untuk aktivasi extension"
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
                  className="relative h-9 w-9 border border-emerald-200/80 bg-white/85 p-0 shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
                  aria-label={isVisible ? "Hide license key" : "Show license key"}
                  title={isVisible ? "Hide license key" : "Show license key"}
                >
                  {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              ) : null}
              {hasCopyableKey ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="relative border border-emerald-200/80 bg-white/85 shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
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
                ? "relative rounded-2xl border border-white/70 bg-white/90 px-4 py-4 font-mono text-lg font-semibold tracking-[0.18em] text-[var(--color-foreground)] shadow-sm"
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
                ? "Copy license key ini, lalu paste ke extension FluentRemote saat aktivasi pertama di browser Anda."
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
          className={`rounded-2xl border border-dashed border-[var(--color-border)] bg-white/60 p-4 ${
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
