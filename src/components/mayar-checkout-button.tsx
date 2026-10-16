"use client";

import { useState, useTransition } from "react";
import { CreditCard, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

type MayarCheckoutButtonProps = {
  title: string;
  description: string;
  actionLabel: string;
  processingLabel: string;
};

export function MayarCheckoutButton({
  title,
  description,
  actionLabel,
  processingLabel,
}: MayarCheckoutButtonProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleCheckout() {
    startTransition(async () => {
      setError(null);

      const response = await fetch("/api/payments/mayar/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const payload = (await response.json()) as {
        message?: string;
        checkoutUrl?: string | null;
      };

      if (!response.ok || !payload.checkoutUrl) {
        setError(payload.message ?? "Tidak bisa membuat checkout Mayar.");
        return;
      }

      window.location.href = payload.checkoutUrl;
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="text-lg font-semibold text-[var(--color-foreground)]">{title}</div>
        <p className="mt-2 text-sm leading-7 text-[var(--color-muted-foreground)]">
          {description}
        </p>
      </div>
      <Button
        type="button"
        onClick={handleCheckout}
        disabled={isPending}
        className="w-full sm:w-auto"
      >
        {isPending ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin" />
            {processingLabel}
          </>
        ) : (
          <>
            <CreditCard className="h-4 w-4" />
            {actionLabel}
          </>
        )}
      </Button>
      {error ? (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
          {error}
        </div>
      ) : null}
    </div>
  );
}
