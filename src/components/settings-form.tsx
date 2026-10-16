"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Check, LoaderCircle, LockKeyhole, RotateCcw, WandSparkles } from "lucide-react";
import { useRouter } from "next/navigation";

import type { LicenseSnapshot, SettingsPreferences } from "@/types/domain";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

type SettingsFormProps = {
  initialPreferences: SettingsPreferences;
  snapshot: LicenseSnapshot;
  dictionary: {
    title: string;
    description: string;
    step: string;
    sourceLabel: string;
    sourcePlaceholder: string;
    targetLabel: string;
    targetPlaceholder: string;
    providerLabel: string;
    providerPlaceholder: string;
    openAiKeyLabel: string;
    openAiKeyPlaceholder: string;
    openAiKeyStored: string;
    maiaKeyLabel: string;
    maiaKeyPlaceholder: string;
    maiaKeyStored: string;
    resetLabel: string;
    resetSuccess: string;
    resetError: string;
    lockedKeysNotice: string;
    apiKeySectionTitle: string;
    apiKeySectionDescription: string;
    apiKeyPurchaseTitle: string;
    apiKeyPurchaseDescription: string;
    apiKeyOpenAIBuy: string;
    apiKeyMaiaBuy: string;
    saving: string;
    save: string;
    saveSuccess: string;
    saveError: string;
  };
  languageOptions: Array<{ value: string; label: string }>;
  providerOptions: Array<{
    value: "openai" | "maia_router";
    label: string;
    description: string;
  }>;
};

export function SettingsForm({
  initialPreferences,
  snapshot,
  dictionary,
  languageOptions,
  providerOptions,
}: SettingsFormProps) {
  const router = useRouter();
  const [preferences, setPreferences] = useState(initialPreferences);
  const [openAIApiKey, setOpenAIApiKey] = useState("");
  const [maiaRouterApiKey, setMaiaRouterApiKey] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isPurchased = snapshot.hasPurchased;

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      const response = await fetch("/api/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...preferences,
          openAIApiKey,
          maiaRouterApiKey,
          clearOpenAIApiKey: false,
          clearMaiaRouterApiKey: false,
        }),
      });

      const payload = (await response.json()) as {
        message?: string;
      } & SettingsPreferences;

      if (!response.ok) {
        setIsError(true);
        setNotice(payload.message ?? dictionary.saveError);
        return;
      }

      setPreferences(payload);
      setOpenAIApiKey("");
      setMaiaRouterApiKey("");
      setIsError(false);
      setNotice(dictionary.saveSuccess);
      router.refresh();
    });
  }

  function handleReset(kind: "openai" | "maia") {
    startTransition(async () => {
      const response = await fetch("/api/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...preferences,
          clearOpenAIApiKey: kind === "openai",
          clearMaiaRouterApiKey: kind === "maia",
        }),
      });

      const payload = (await response.json()) as {
        message?: string;
      } & SettingsPreferences;

      if (!response.ok) {
        setIsError(true);
        setNotice(payload.message ?? dictionary.resetError);
        return;
      }

      setPreferences(payload);
      if (kind === "openai") {
        setOpenAIApiKey("");
      } else {
        setMaiaRouterApiKey("");
      }
      setIsError(false);
      setNotice(dictionary.resetSuccess);
      router.refresh();
    });
  }

  return (
    <Card className="bg-[var(--color-card)]">
      <CardHeader className="gap-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>{dictionary.title}</CardTitle>
            <CardDescription>{dictionary.description}</CardDescription>
          </div>
          <div className="rounded-full bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-muted-foreground)]">
            {dictionary.step}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sourceLanguage">{dictionary.sourceLabel}</Label>
              <Select
                value={preferences.sourceLanguage}
                onValueChange={(value) =>
                  setPreferences((current) => ({ ...current, sourceLanguage: value }))
                }
              >
                <SelectTrigger id="sourceLanguage">
                  <SelectValue placeholder={dictionary.sourcePlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map((language) => (
                    <SelectItem key={language.value} value={language.value}>
                      {language.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetLanguage">{dictionary.targetLabel}</Label>
              <Select
                value={preferences.targetLanguage}
                onValueChange={(value) =>
                  setPreferences((current) => ({ ...current, targetLanguage: value }))
                }
              >
                <SelectTrigger id="targetLanguage">
                  <SelectValue placeholder={dictionary.targetPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map((language) => (
                    <SelectItem key={language.value} value={language.value}>
                      {language.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="aiProvider">{dictionary.providerLabel}</Label>
            <Select
              value={preferences.aiProvider}
              onValueChange={(value) =>
                setPreferences((current) => ({
                  ...current,
                  aiProvider: value as SettingsPreferences["aiProvider"],
                }))
              }
            >
              <SelectTrigger id="aiProvider">
                <SelectValue placeholder={dictionary.providerPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {providerOptions.map((provider) => (
                  <SelectItem key={provider.value} value={provider.value}>
                    {provider.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm leading-6 text-[var(--color-muted-foreground)]">
              {
                providerOptions.find(
                  (provider) => provider.value === preferences.aiProvider,
                )?.description
              }
            </p>
          </div>

          <div className="grid gap-5">
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4">
              <div className="text-sm font-medium text-[var(--color-foreground)]">
                {dictionary.apiKeySectionTitle}
              </div>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted-foreground)]">
                {dictionary.apiKeySectionDescription}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="openaiApiKey">{dictionary.openAiKeyLabel}</Label>
                {isPurchased && preferences.hasOpenAIApiKey ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={isPending}
                    onClick={() => handleReset("openai")}
                  >
                    <RotateCcw className="h-4 w-4" />
                    {dictionary.resetLabel}
                  </Button>
                ) : null}
              </div>
              <Input
                id="openaiApiKey"
                type="password"
                value={openAIApiKey}
                onChange={(event) => setOpenAIApiKey(event.target.value)}
                placeholder={
                  preferences.openAIApiKeyMasked ?? dictionary.openAiKeyPlaceholder
                }
                disabled={!isPurchased}
              />
              <p className="text-sm text-[var(--color-muted-foreground)]">
                {preferences.hasOpenAIApiKey
                  ? `${dictionary.openAiKeyStored}: ${preferences.openAIApiKeyMasked}`
                  : dictionary.lockedKeysNotice}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="maiaRouterApiKey">{dictionary.maiaKeyLabel}</Label>
                {isPurchased && preferences.hasMaiaRouterApiKey ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={isPending}
                    onClick={() => handleReset("maia")}
                  >
                    <RotateCcw className="h-4 w-4" />
                    {dictionary.resetLabel}
                  </Button>
                ) : null}
              </div>
              <Input
                id="maiaRouterApiKey"
                type="password"
                value={maiaRouterApiKey}
                onChange={(event) => setMaiaRouterApiKey(event.target.value)}
                placeholder={
                  preferences.maiaRouterApiKeyMasked ?? dictionary.maiaKeyPlaceholder
                }
                disabled={!isPurchased}
              />
              <p className="text-sm text-[var(--color-muted-foreground)]">
                {preferences.hasMaiaRouterApiKey
                  ? `${dictionary.maiaKeyStored}: ${preferences.maiaRouterApiKeyMasked}`
                  : dictionary.lockedKeysNotice}
              </p>
            </div>
          </div>

          <Button className="w-full sm:w-auto" type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                {dictionary.saving}
              </>
            ) : (
              <>
                {isPurchased ? (
                  <WandSparkles className="h-4 w-4" />
                ) : (
                  <LockKeyhole className="h-4 w-4" />
                )}
                {dictionary.save}
              </>
            )}
          </Button>
        </form>

        <Separator />

        <div className="rounded-[18px] border border-[var(--color-border)] bg-[linear-gradient(180deg,rgba(28,25,39,0.92),rgba(21,19,29,0.96))] p-5">
          <div className="text-sm font-medium text-[var(--color-foreground)]">
            {dictionary.apiKeyPurchaseTitle}
          </div>
          <p className="mt-2 text-sm leading-6 text-[var(--color-muted-foreground)]">
            {dictionary.apiKeyPurchaseDescription}
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="secondary" className="sm:flex-1">
              <Link
                href="https://platform.openai.com/settings/organization/billing/overview"
                target="_blank"
                rel="noreferrer"
              >
                {dictionary.apiKeyOpenAIBuy}
              </Link>
            </Button>
            <Button asChild variant="secondary" className="sm:flex-1">
              <Link
                href="https://dash.maiarouter.ai/dashboard/api-keys"
                target="_blank"
                rel="noreferrer"
              >
                {dictionary.apiKeyMaiaBuy}
              </Link>
            </Button>
          </div>
        </div>

        {notice ? (
          <div
            className={`flex items-center gap-2 rounded-2xl px-4 py-3 text-sm ${
              isError
                ? "border border-rose-500/30 bg-rose-500/10 text-rose-400"
                : "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
            }`}
          >
            <Check className="h-4 w-4" />
            {notice}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
