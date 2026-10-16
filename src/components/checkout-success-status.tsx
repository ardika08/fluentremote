"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Clock3, LoaderCircle, RotateCw } from "lucide-react";
import { useRouter } from "next/navigation";

import type { PurchaseOrderSummary } from "@/types/domain";
import { Button } from "@/components/ui/button";

type CheckoutSuccessStatusProps = {
  initialHasPurchased: boolean;
  initialPurchase: PurchaseOrderSummary | null;
  dictionary: {
    paid: string;
    pending: string;
    expired: string;
    failed: string;
    polling: string;
    refresh: string;
    continuePayment: string;
    redirecting: string;
    orderLabel: string;
    mobileLabel: string;
    steps: {
      checkout: string;
      payment: string;
      license: string;
      settings: string;
    };
  };
};

type StatusPayload = {
  hasPurchased: boolean;
  licenseStatus: string;
  latestPurchase: PurchaseOrderSummary | null;
};

export function CheckoutSuccessStatus({
  initialHasPurchased,
  initialPurchase,
  dictionary,
}: CheckoutSuccessStatusProps) {
  const router = useRouter();
  const [state, setState] = useState<StatusPayload>({
    hasPurchased: initialHasPurchased,
    licenseStatus: initialHasPurchased ? "active" : "inactive",
    latestPurchase: initialPurchase,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (state.hasPurchased) {
      const timeout = window.setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1400);

      return () => window.clearTimeout(timeout);
    }

    const interval = window.setInterval(async () => {
      try {
        const response = await fetch("/api/payments/mayar/status", {
          cache: "no-store",
        });

        if (!response.ok) return;

        const payload = (await response.json()) as StatusPayload;
        setState(payload);

        if (payload.hasPurchased) {
          window.clearInterval(interval);
          router.push("/dashboard");
          router.refresh();
        }
      } catch {
        // Keep polling on the next cycle.
      }
    }, 3500);

    return () => window.clearInterval(interval);
  }, [router, state.hasPurchased]);

  const status = state.latestPurchase?.status ?? "pending";
  const statusMessage =
    status === "paid"
      ? dictionary.paid
      : status === "expired"
        ? dictionary.expired
        : status === "failed"
          ? dictionary.failed
          : dictionary.pending;

  async function handleRefresh() {
    setIsRefreshing(true);
    try {
      const response = await fetch("/api/payments/mayar/status", {
        cache: "no-store",
      });

      if (response.ok) {
        const payload = (await response.json()) as StatusPayload;
        setState(payload);

        if (payload.hasPurchased) {
          router.push("/dashboard");
          router.refresh();
        }
      }
    } finally {
      setIsRefreshing(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4 text-sm leading-7 text-[var(--color-muted-foreground)]">
        <div className="flex items-center gap-2 font-semibold text-[var(--color-foreground)]">
          {state.hasPurchased || status === "paid" ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          ) : (
            <Clock3 className="h-4 w-4 text-[var(--color-primary)]" />
          )}
          {statusMessage}
        </div>
        {!state.hasPurchased ? (
          <div className="mt-2 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--color-muted-foreground)]">
            <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
            {dictionary.polling}
          </div>
        ) : (
          <div className="mt-2 text-xs uppercase tracking-[0.18em] text-emerald-400">
            {dictionary.redirecting}
          </div>
        )}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-4 text-sm text-[var(--color-muted-foreground)]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted-foreground)]">
            {dictionary.orderLabel}
          </div>
          <div className="mt-2 font-medium text-[var(--color-foreground)]">
            {state.latestPurchase?.id ?? "-"}
          </div>
        </div>
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-4 text-sm text-[var(--color-muted-foreground)]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted-foreground)]">
            {dictionary.mobileLabel}
          </div>
          <div className="mt-2 font-medium text-[var(--color-foreground)]">
            {state.latestPurchase?.customerMobile ?? "-"}
          </div>
        </div>
      </div>

      <div className="rounded-[16px] border border-[var(--color-border)] bg-[var(--color-card)] p-4">
        <div className="grid gap-3 md:grid-cols-4">
          {[
            { done: true, label: dictionary.steps.checkout },
            { done: status === "paid" || state.hasPurchased, label: dictionary.steps.payment },
            { done: state.hasPurchased, label: dictionary.steps.license },
            { done: state.hasPurchased, label: dictionary.steps.settings },
          ].map((step, index) => (
            <div
              key={step.label}
              className={`rounded-2xl border px-4 py-4 text-sm ${
                step.done
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted-foreground)]"
              }`}
            >
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                {index + 1}
              </div>
              <div className="mt-2 leading-6">{step.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RotateCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          {dictionary.refresh}
        </Button>
        {!state.hasPurchased && state.latestPurchase?.checkoutUrl ? (
          <Button asChild>
            <a href={state.latestPurchase.checkoutUrl}>{dictionary.continuePayment}</a>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
