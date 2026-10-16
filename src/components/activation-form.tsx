"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, LoaderCircle, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

import type { ActivationResponse, LicenseSnapshot } from "@/types/domain";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

type ActivationFormProps = {
  initialSnapshot: LicenseSnapshot;
  dictionary: {
    step: string;
    title: string;
    description: string;
    label: string;
    placeholder: string;
    verifying: string;
    button: string;
    stateTitle: string;
    initialState: string;
    mockTitle: string;
    mockItems: string[];
  };
};

export function ActivationForm({ initialSnapshot, dictionary }: ActivationFormProps) {
  const router = useRouter();
  const [activationCode, setActivationCode] = useState("");
  const [response, setResponse] = useState<ActivationResponse | null>(null);
  const [isPending, startTransition] = useTransition();

  const currentStatus = response?.status ?? initialSnapshot.status;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      const result = await fetch("/api/license/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activationCode }),
      });

      const payload = (await result.json()) as ActivationResponse;
      setResponse(payload);
      router.refresh();
    });
  }

  return (
    <Card className="overflow-hidden bg-[var(--color-card)]">
      <CardHeader className="gap-4">
        <Badge className="w-fit">{dictionary.step}</Badge>
        <CardTitle>{dictionary.title}</CardTitle>
        <CardDescription>
          {dictionary.description}{" "}
          <span className="font-semibold">FLUENT-2026-ACCESS</span>.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="activationCode">{dictionary.label}</Label>
            <Input
              id="activationCode"
              name="activationCode"
              placeholder={dictionary.placeholder}
              value={activationCode}
              onChange={(event) => setActivationCode(event.target.value)}
            />
          </div>
          <Button className="w-full" type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                {dictionary.verifying}
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                {dictionary.button}
              </>
            )}
          </Button>
        </form>

        <div
          className={`rounded-2xl border p-4 text-sm ${
            currentStatus === "active"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              : currentStatus === "revoked"
                ? "border-rose-500/30 bg-rose-500/10 text-rose-400"
                : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted-foreground)]"
          }`}
        >
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="h-4 w-4" />
            {dictionary.stateTitle}
          </div>
          <p className="mt-2 leading-6">
            {response?.message ?? dictionary.initialState}
          </p>
        </div>

        {dictionary.mockItems.length > 0 ? (
        <div className="rounded-[16px] bg-[var(--color-surface)] p-5">
          <div className="text-sm font-semibold text-[var(--color-foreground)]">
            {dictionary.mockTitle}
          </div>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--color-muted-foreground)]">
            {dictionary.mockItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
