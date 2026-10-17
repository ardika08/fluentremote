"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Copy,
  KeyRound,
  LoaderCircle,
  MonitorSmartphone,
  RotateCcw,
  ShieldOff,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Action = "revoke" | "restore" | "issue" | "reissue" | "reset-device";

export function MemberActions({
  userId,
  licenseState,
  hasLicense,
  deviceCount,
  isId,
}: {
  userId: string;
  licenseState: "none" | "available" | "activated" | "revoked";
  hasLicense: boolean;
  deviceCount: number;
  isId: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [running, setRunning] = useState<Action | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [tone, setTone] = useState<"ok" | "error">("ok");
  const [issuedCode, setIssuedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const labels = {
    revoke: isId ? "Cabut lisensi" : "Revoke license",
    restore: isId ? "Pulihkan lisensi" : "Restore license",
    issue: isId ? "Terbitkan lisensi manual" : "Issue license manually",
    reissue: isId ? "Ganti kode lisensi" : "Replace license code",
    reset: isId ? "Reset perangkat" : "Reset device",
    title: isId ? "Kontrol admin" : "Admin controls",
    description: isId
      ? "Setiap aksi langsung tersimpan dan tercatat sebagai jejak aktivitas pada akun member ini."
      : "Every action is applied immediately and recorded as an activity entry on this member's account.",
    busy: isId ? "Memproses…" : "Working…",
    copy: isId ? "Salin kode" : "Copy code",
    copied: isId ? "Tersalin" : "Copied",
    newCode: isId ? "Kode lisensi baru (kirim ke member)" : "New license code (send to member)",
  };

  const confirmations: Record<Action, string> = {
    revoke: isId
      ? "Cabut lisensi member ini? Ekstensi mereka akan berhenti sinkron."
      : "Revoke this member's license? Their extension will stop syncing.",
    restore: isId ? "Pulihkan lisensi member ini?" : "Restore this member's license?",
    issue: isId
      ? "Terbitkan kode lisensi manual untuk member ini (untuk pembayaran di luar Mayar)?"
      : "Issue a manual license code for this member (for payments outside Mayar)?",
    reissue: isId
      ? "Terbitkan kode lisensi baru? Kode lama langsung tidak berlaku."
      : "Issue a new license code? The old code stops working immediately.",
    "reset-device": isId
      ? "Reset pengikatan perangkat? Member bisa aktivasi ulang di komputer baru."
      : "Reset device binding? The member can activate again on a new computer.",
  };

  function run(action: Action) {
    if (!window.confirm(confirmations[action])) return;

    startTransition(async () => {
      setRunning(action);
      setMessage(null);
      setTone("ok");
      try {
        const response = await fetch("/api/admin/members", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, action }),
        });
        const payload = (await response.json()) as {
          ok?: boolean;
          message?: string;
          activationCode?: string;
        };

        setTone(payload.ok === false || !response.ok ? "error" : "ok");
        setMessage(payload.message ?? (response.ok ? "Selesai." : "Gagal memproses aksi."));
        if (payload.activationCode) setIssuedCode(payload.activationCode);
        router.refresh();
      } catch (error) {
        setTone("error");
        setMessage(error instanceof Error ? error.message : "Gagal memproses aksi.");
      } finally {
        setRunning(null);
      }
    });
  }

  async function copyCode() {
    if (!issuedCode) return;
    try {
      await navigator.clipboard.writeText(issuedCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setTone("error");
      setMessage(isId ? "Gagal menyalin, salin manual." : "Copy failed, copy manually.");
    }
  }

  const disabled = isPending && running !== null;

  return (
    <Card className="bg-[var(--color-card)]">
      <CardHeader className="gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
          <KeyRound className="h-4 w-4" />
          {labels.title}
        </div>
        <CardTitle className="text-xl">{isId ? "Kelola akses member" : "Manage member access"}</CardTitle>
        <CardDescription>{labels.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => run("issue")}
            disabled={disabled || (hasLicense && licenseState !== "revoked")}
          >
            {running === "issue" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
            {running === "issue" ? labels.busy : labels.issue}
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={() => run("reissue")}
            disabled={disabled}
          >
            {running === "reissue" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
            {running === "reissue" ? labels.busy : labels.reissue}
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={() => run("revoke")}
            disabled={disabled || !hasLicense || licenseState === "revoked"}
            className="border-rose-500/30 text-rose-300 hover:bg-rose-500/10"
          >
            {running === "revoke" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ShieldOff className="h-4 w-4" />}
            {running === "revoke" ? labels.busy : labels.revoke}
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={() => run("restore")}
            disabled={disabled || licenseState !== "revoked"}
            className="border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10"
          >
            {running === "restore" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
            {running === "restore" ? labels.busy : labels.restore}
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={() => run("reset-device")}
            disabled={disabled || !hasLicense || deviceCount === 0}
            className="sm:col-span-2"
          >
            {running === "reset-device" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <MonitorSmartphone className="h-4 w-4" />}
            {running === "reset-device" ? labels.busy : `${labels.reset}${deviceCount ? ` (${deviceCount})` : ""}`}
          </Button>
        </div>

        {issuedCode ? (
          <div className="rounded-[14px] border border-[rgba(139,92,246,0.35)] bg-[rgba(139,92,246,0.10)] p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)]">
              {labels.newCode}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <code className="rounded-[10px] bg-[rgba(12,11,16,0.6)] px-3 py-2 font-mono text-sm tracking-[0.08em] text-[var(--color-foreground)]">
                {issuedCode}
              </code>
              <Button type="button" size="sm" variant="secondary" onClick={copyCode}>
                <Copy className="h-3.5 w-3.5" />
                {copied ? labels.copied : labels.copy}
              </Button>
            </div>
          </div>
        ) : null}

        {message ? (
          <p
            className={`rounded-[14px] border px-4 py-3 text-sm ${
              tone === "error"
                ? "border-rose-500/30 bg-rose-500/10 text-rose-200"
                : "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
            }`}
          >
            {message}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
