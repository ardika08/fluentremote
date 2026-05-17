"use client";

import { useState, useTransition } from "react";
import { Languages, LoaderCircle, Sparkles } from "lucide-react";

import type {
  LanguagePreference,
  LicenseSnapshot,
  TranslationMode,
  TranslationResponse,
} from "@/types/domain";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type TranslationPlaygroundCardProps = {
  preferences: LanguagePreference;
  snapshot: LicenseSnapshot;
  providerLabel: string;
  dictionary: {
    eyebrow: string;
    title: string;
    description: string;
    sourceLabel: string;
    targetLabel: string;
    providerLabel: string;
    modeLabel: string;
    textLabel: string;
    textPlaceholder: string;
    readMode: string;
    writeMode: string;
    action: string;
    translating: string;
    resultLabel: string;
    resultEmpty: string;
    inactiveNotice: string;
    errorFallback: string;
    sampleText: string;
    checkoutCta: string;
  };
  checkoutHref: string;
};

type ApiError = {
  message?: string;
};

export function TranslationPlaygroundCard({
  preferences,
  snapshot,
  providerLabel,
  dictionary,
  checkoutHref,
}: TranslationPlaygroundCardProps) {
  const [mode, setMode] = useState<TranslationMode>("write");
  const [text, setText] = useState(dictionary.sampleText);
  const [result, setResult] = useState<TranslationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isActive = snapshot.hasPurchased && snapshot.status === "active";

  function handleTranslate() {
    if (!isActive) {
      setError(dictionary.inactiveNotice);
      setResult(null);
      return;
    }

    startTransition(async () => {
      setError(null);

      try {
        const response = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text,
            sourceLanguage: preferences.sourceLanguage,
            targetLanguage: preferences.targetLanguage,
            aiProvider: preferences.aiProvider,
            mode,
          }),
        });

        const payload = (await response.json()) as TranslationResponse & ApiError;

        if (!response.ok || !("translatedText" in payload)) {
          setResult(null);
          setError(payload.message ?? dictionary.errorFallback);
          return;
        }

        setResult(payload);
      } catch {
        setResult(null);
        setError(dictionary.errorFallback);
      }
    });
  }

  return (
    <Card className="bg-white/88">
      <CardHeader className="gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-sm uppercase tracking-[0.2em] text-[var(--color-primary)]">
              {dictionary.eyebrow}
            </div>
            <CardTitle className="mt-3">{dictionary.title}</CardTitle>
            <CardDescription className="mt-2">{dictionary.description}</CardDescription>
          </div>
          <Badge>{providerLabel}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-[var(--color-surface)] p-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted-foreground)]">
              {dictionary.sourceLabel}
            </div>
            <p className="mt-2 text-sm text-[var(--color-foreground)]">
              {preferences.sourceLanguage}
            </p>
          </div>
          <div className="rounded-2xl bg-[var(--color-surface)] p-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted-foreground)]">
              {dictionary.targetLabel}
            </div>
            <p className="mt-2 text-sm text-[var(--color-foreground)]">
              {preferences.targetLanguage}
            </p>
          </div>
          <div className="rounded-2xl bg-[var(--color-surface)] p-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted-foreground)]">
              {dictionary.providerLabel}
            </div>
            <p className="mt-2 text-sm text-[var(--color-foreground)]">{providerLabel}</p>
          </div>
        </div>

        <div className="grid gap-5">
          <div className="space-y-2">
            <Label htmlFor="translation-mode">{dictionary.modeLabel}</Label>
            <Select value={mode} onValueChange={(value) => setMode(value as TranslationMode)}>
              <SelectTrigger id="translation-mode" className="w-full sm:w-56">
                <SelectValue placeholder={dictionary.modeLabel} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="read">{dictionary.readMode}</SelectItem>
                <SelectItem value="write">{dictionary.writeMode}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="translation-text">{dictionary.textLabel}</Label>
            <Textarea
              id="translation-text"
              placeholder={dictionary.textPlaceholder}
              value={text}
              onChange={(event) => setText(event.target.value)}
            />
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
            {error}
          </div>
        ) : null}

        <Button onClick={handleTranslate} disabled={isPending || !text.trim() || !isActive}>
          {isPending ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              {dictionary.translating}
            </>
          ) : (
            <>
              <Languages className="h-4 w-4" />
              {dictionary.action}
            </>
          )}
        </Button>
        {!isActive ? (
          <a
            href={checkoutHref}
            className="inline-flex text-sm font-semibold text-[var(--color-primary)] hover:underline"
          >
            {dictionary.checkoutCta}
          </a>
        ) : null}

        <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)]/70 p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--color-foreground)]">
            <Sparkles className="h-4 w-4 text-[var(--color-primary)]" />
            {dictionary.resultLabel}
          </div>
          <div className="rounded-2xl bg-white/80 px-4 py-4 text-sm leading-7 text-[var(--color-foreground)] shadow-sm">
            {result?.translatedText ?? dictionary.resultEmpty}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
