import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight, BadgeCheck, Settings2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getServerSession } from "@/lib/auth-server";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

function getInitials(name: string, email: string) {
  const tokens = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (tokens.length > 0) {
    return tokens.map((token) => token[0]?.toUpperCase() ?? "").join("");
  }

  return email.slice(0, 2).toUpperCase();
}

export default async function ProfilePage() {
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/sign-in");
  }

  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  const initials = getInitials(session.user.name, session.user.email);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-6 py-12 lg:px-10">
      <div className="max-w-3xl">
        <div className="text-sm uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">
          {dictionary.auth.profilePage.eyebrow}
        </div>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-[var(--color-foreground)]">
          {dictionary.auth.profilePage.title}
        </h1>
        <p className="mt-4 text-base leading-7 text-[var(--color-muted-foreground)]">
          {dictionary.auth.profilePage.description}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="bg-[var(--color-card)]">
          <CardHeader>
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
              <BadgeCheck className="h-4 w-4" />
              {dictionary.auth.profilePage.accountCardTitle}
            </div>
            <CardTitle>{session.user.name}</CardTitle>
            <CardDescription>{dictionary.auth.profilePage.accountCardDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 rounded-[16px] border border-[var(--color-border)] bg-[linear-gradient(180deg,rgba(28,25,39,0.92),rgba(21,19,29,0.96))] p-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[14px] bg-[linear-gradient(180deg,rgba(28,25,39,0.92),rgba(21,19,29,0.96))] text-lg font-bold tracking-[0.14em] text-white shadow-[0_18px_38px_rgba(124,58,237,0.24)]">
                {initials}
              </div>
              <div className="min-w-0">
                <div className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted-foreground)]">
                  {dictionary.auth.profilePage.signedInWith}
                </div>
                <div className="mt-2 truncate text-lg font-semibold text-[var(--color-foreground)]">
                  {session.user.name}
                </div>
                <div className="truncate text-sm text-[var(--color-muted-foreground)]">
                  {session.user.email}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--color-card)]">
          <CardHeader>
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
              <Sparkles className="h-4 w-4" />
              {dictionary.auth.profilePage.quickLinksTitle}
            </div>
            <CardTitle>{dictionary.auth.profilePage.quickLinksTitle}</CardTitle>
            <CardDescription>{dictionary.auth.profilePage.quickLinksDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="secondary" className="w-full justify-between">
              <Link href="/settings">
                <span className="inline-flex items-center gap-2">
                  <Settings2 className="h-4 w-4" />
                  {dictionary.auth.profilePage.settingsLink}
                </span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
