import Link from "next/link";

import { AuthStatus } from "@/components/auth-status";
import { LocaleToggle } from "@/components/locale-toggle";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/types/domain";

type SiteHeaderProps = {
  locale: Locale;
  dictionary: {
    productTag: string;
    nav: { features: string; security: string; pricing: string };
    settings: string;
    activate: string;
  };
  switcher: {
    label: string;
    id: string;
    en: string;
  };
  auth: {
    signIn: string;
    createAccount: string;
    signOut: string;
    signingOut: string;
    profile: string;
    settings: string;
  };
  user: {
    name: string;
    email: string;
  } | null;
};

export function SiteHeader({
  locale,
  dictionary,
  switcher,
  auth,
  user,
}: SiteHeaderProps) {
  const navLinks = [
    { href: "#features", label: dictionary.nav.features },
    { href: "#security", label: dictionary.nav.security },
    { href: "#pricing", label: dictionary.nav.pricing },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-[color:var(--color-surface)]/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-base font-bold text-white shadow-[0_18px_40px_rgba(15,98,254,0.25)]">
            FR
          </div>
          <div>
            <div className="font-[family-name:var(--font-display)] text-lg font-semibold">
              FluentRemote
            </div>
            <div className="text-xs tracking-[0.16em] text-[var(--color-muted-foreground)] uppercase">
              {dictionary.productTag}
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[var(--color-muted-foreground)] transition hover:text-[var(--color-foreground)]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LocaleToggle
            key={locale}
            locale={locale}
            label={switcher.label}
            idLabel={switcher.id}
            enLabel={switcher.en}
          />
          {!user ? (
            <Button asChild size="sm">
              <Link href="/checkout">{dictionary.activate}</Link>
            </Button>
          ) : null}
          <AuthStatus user={user} dictionary={auth} />
        </div>
      </div>
    </header>
  );
}
