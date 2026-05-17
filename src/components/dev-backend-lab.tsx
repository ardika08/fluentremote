"use client";

import { useState, useTransition } from "react";
import { KeyRound, Languages, LoaderCircle, Save, WandSparkles } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import type { AIProvider, TranslationMode } from "@/types/domain";

const languages = [
  "Indonesian",
  "English",
  "Spanish",
  "French",
  "German",
  "Portuguese",
  "Arabic",
  "Japanese",
  "Korean",
  "Mandarin Chinese",
];

const providers: Array<{ value: AIProvider; label: string }> = [
  { value: "openai", label: "OpenAI" },
  { value: "maia_router", label: "MAIA Router" },
];

function ResultBox({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="mb-2 text-[11px] font-semibold tracking-[0.16em] text-[var(--color-muted-foreground)] uppercase">
        {label}
      </div>
      <pre className="overflow-x-auto whitespace-pre-wrap break-words text-sm leading-6 text-[var(--color-foreground)]">
        {value ?? "-"}
      </pre>
    </div>
  );
}

export function DevBackendLab() {
  const [licenseCode, setLicenseCode] = useState("FLUENT-2026-ACCESS");
  const [licenseResult, setLicenseResult] = useState<string | null>(null);
  const [licensePending, startLicenseTransition] = useTransition();

  const [sourceLanguage, setSourceLanguage] = useState("Indonesian");
  const [targetLanguage, setTargetLanguage] = useState("English");
  const [provider, setProvider] = useState<AIProvider>("openai");
  const [preferencesResult, setPreferencesResult] = useState<string | null>(null);
  const [preferencesPending, startPreferencesTransition] = useTransition();

  const [mode, setMode] = useState<TranslationMode>("write");
  const [text, setText] = useState("Ya, tentu saja bisa.");
  const [translationResult, setTranslationResult] = useState<string | null>(null);
  const [translationPending, startTranslationTransition] = useTransition();

  function pretty(data: unknown) {
    return JSON.stringify(data, null, 2);
  }

  async function activateLicense() {
    startLicenseTransition(async () => {
      const response = await fetch("/api/license/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activationCode: licenseCode }),
      });

      const payload = await response.json();
      setLicenseResult(pretty(payload));
    });
  }

  async function savePreferences() {
    startPreferencesTransition(async () => {
      const response = await fetch("/api/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceLanguage,
          targetLanguage,
          aiProvider: provider,
        }),
      });

      const payload = await response.json();
      setPreferencesResult(pretty(payload));
    });
  }

  async function translate() {
    startTranslationTransition(async () => {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          sourceLanguage,
          targetLanguage,
          aiProvider: provider,
          mode,
        }),
      });

      const payload = await response.json();
      setTranslationResult(pretty(payload));
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <Card className="bg-white/84">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-[var(--color-primary)]" />
            License activation
          </CardTitle>
          <CardDescription>
            Test the real activation handler against the current backend setup.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="license-code">Activation code</Label>
            <Input
              id="license-code"
              value={licenseCode}
              onChange={(event) => setLicenseCode(event.target.value)}
            />
          </div>
          <Button className="w-full" onClick={activateLicense} disabled={licensePending}>
            {licensePending ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Activating
              </>
            ) : (
              <>
                <KeyRound className="h-4 w-4" />
                Activate license
              </>
            )}
          </Button>
          <ResultBox label="Response" value={licenseResult} />
        </CardContent>
      </Card>

      <Card className="bg-white/84">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Save className="h-5 w-5 text-[var(--color-primary)]" />
            Preferences
          </CardTitle>
          <CardDescription>
            Save source language, target language, and provider through the API.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="source-language">Source language</Label>
              <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                <SelectTrigger id="source-language">
                  <SelectValue placeholder="Select source language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((language) => (
                    <SelectItem key={language} value={language}>
                      {language}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="target-language">Target language</Label>
              <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                <SelectTrigger id="target-language">
                  <SelectValue placeholder="Select target language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((language) => (
                    <SelectItem key={language} value={language}>
                      {language}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="provider">Provider</Label>
              <Select value={provider} onValueChange={(value) => setProvider(value as AIProvider)}>
                <SelectTrigger id="provider">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="w-full" onClick={savePreferences} disabled={preferencesPending}>
            {preferencesPending ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Saving
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save preferences
              </>
            )}
          </Button>
          <ResultBox label="Response" value={preferencesResult} />
        </CardContent>
      </Card>

      <Card className="bg-white/84">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <WandSparkles className="h-5 w-5 text-[var(--color-primary)]" />
            Translation
          </CardTitle>
          <CardDescription>
            Call the live translate route with the currently selected provider and mode.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="translate-mode">Mode</Label>
              <Select value={mode} onValueChange={(value) => setMode(value as TranslationMode)}>
                <SelectTrigger id="translate-mode">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="write">Write</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="translate-text">Text</Label>
              <Textarea
                id="translate-text"
                value={text}
                onChange={(event) => setText(event.target.value)}
              />
            </div>
          </div>
          <Button className="w-full" onClick={translate} disabled={translationPending}>
            {translationPending ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Translating
              </>
            ) : (
              <>
                <Languages className="h-4 w-4" />
                Translate now
              </>
            )}
          </Button>
          <ResultBox label="Response" value={translationResult} />
        </CardContent>
      </Card>
    </div>
  );
}
