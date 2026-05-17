"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoaderCircle, LogIn, UserPlus } from "lucide-react";
import { useState, useTransition } from "react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthMode = "sign-in" | "sign-up";

type AuthFormProps = {
  mode: AuthMode;
  dictionary: {
    signInTitle: string;
    signInDescription: string;
    signUpTitle: string;
    signUpDescription: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    processing: string;
    createAccount: string;
    signIn: string;
    continueWithGoogle: string;
    orContinueWithEmail: string;
    accountCreated: string;
    signedIn: string;
    authFailed: string;
    alreadyHaveAccount: string;
    needAccount: string;
    switchToSignIn: string;
    switchToSignUp: string;
  };
};

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
      <path
        fill="#4285F4"
        d="M21.8 12.23c0-.76-.07-1.49-.19-2.2H12v4.17h5.5a4.7 4.7 0 0 1-2.04 3.09v2.56h3.3c1.93-1.78 3.04-4.41 3.04-7.62Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.75 0 5.06-.91 6.75-2.46l-3.3-2.56c-.91.61-2.08.98-3.45.98-2.65 0-4.9-1.79-5.7-4.2H2.9v2.64A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.3 13.76A5.97 5.97 0 0 1 6 12c0-.61.1-1.2.3-1.76V7.6H2.9A10 10 0 0 0 2 12c0 1.61.38 3.13.9 4.4l3.4-2.64Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.96c1.5 0 2.84.52 3.9 1.53l2.92-2.92C17.05 2.91 14.74 2 12 2A10 10 0 0 0 2.9 7.6l3.4 2.64c.8-2.41 3.05-4.28 5.7-4.28Z"
      />
    </svg>
  );
}

export function AuthForm({ mode, dictionary }: AuthFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isSignUp = mode === "sign-up";

  function resolveErrorMessage(candidate: unknown) {
    if (!candidate || typeof candidate !== "object") {
      return dictionary.authFailed;
    }

    if ("message" in candidate && typeof candidate.message === "string") {
      return candidate.message;
    }

    if ("error" in candidate && typeof candidate.error === "string") {
      return candidate.error;
    }

    return dictionary.authFailed;
  }

  async function handleGoogleSignIn() {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      try {
        const origin = window.location.origin;
        const callbackURL = `${origin}/settings`;
        const errorCallbackURL = `${origin}${mode === "sign-up" ? "/sign-up" : "/sign-in"}`;

        const result = await authClient.signIn.social({
          provider: "google",
          callbackURL,
          errorCallbackURL,
          disableRedirect: true,
        });

        if (result?.error) {
          setError(resolveErrorMessage(result.error));
          return;
        }

        const authorizeUrl =
          result && typeof result === "object" && "data" in result
            ? (result.data as { url?: string } | null)?.url
            : undefined;

        if (authorizeUrl) {
          window.location.href = authorizeUrl;
          return;
        }

        setError(dictionary.authFailed);
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : dictionary.authFailed);
      }
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      try {
        if (isSignUp) {
          const result = await authClient.signUp.email({
            email,
            password,
            name,
          });

          if (result.error) {
            setError(resolveErrorMessage(result.error));
            return;
          }

          setSuccess(dictionary.accountCreated);
        } else {
          const result = await authClient.signIn.email({
            email,
            password,
          });

          if (result.error) {
            setError(resolveErrorMessage(result.error));
            return;
          }

          setSuccess(dictionary.signedIn);
        }

        router.push("/settings");
        router.refresh();
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : dictionary.authFailed);
      }
    });
  }

  return (
    <Card className="w-full max-w-xl bg-white/88">
      <CardHeader>
        <CardTitle>{isSignUp ? dictionary.signUpTitle : dictionary.signInTitle}</CardTitle>
        <CardDescription>
          {isSignUp ? dictionary.signUpDescription : dictionary.signInDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-3">
          <Button
            className="w-full"
            type="button"
            variant="secondary"
            disabled={isPending}
            onClick={handleGoogleSignIn}
          >
            {isPending ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                {dictionary.processing}
              </>
            ) : (
              <>
                <GoogleIcon />
                {dictionary.continueWithGoogle}
              </>
            )}
          </Button>
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">
            <div className="h-px flex-1 bg-[color:var(--color-border)]" />
            <span>{dictionary.orContinueWithEmail}</span>
            <div className="h-px flex-1 bg-[color:var(--color-border)]" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp ? (
            <div className="space-y-2">
              <Label htmlFor="name">{dictionary.nameLabel}</Label>
              <Input
                id="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder={dictionary.namePlaceholder}
                required
              />
            </div>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="email">{dictionary.emailLabel}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={dictionary.emailPlaceholder}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{dictionary.passwordLabel}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={dictionary.passwordPlaceholder}
              required
            />
          </div>
          <Button className="w-full" type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                {dictionary.processing}
              </>
            ) : isSignUp ? (
              <>
                <UserPlus className="h-4 w-4" />
                {dictionary.createAccount}
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                {dictionary.signIn}
              </>
            )}
          </Button>
        </form>

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            {success}
          </div>
        ) : null}

        <div className="text-sm text-[var(--color-muted-foreground)]">
          {isSignUp ? dictionary.alreadyHaveAccount : dictionary.needAccount}{" "}
          <Link
            href={isSignUp ? "/sign-in" : "/sign-up"}
            className="font-semibold text-[var(--color-primary)]"
          >
            {isSignUp ? dictionary.switchToSignIn : dictionary.switchToSignUp}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
