"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, LoaderCircle, LogOut, Settings2, UserRound } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type AuthStatusProps = {
  user: {
    name: string;
    email: string;
  } | null;
  dictionary: {
    signIn: string;
    createAccount: string;
    signOut: string;
    signingOut: string;
    profile: string;
    settings: string;
  };
};

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

export function AuthStatus({ user, dictionary }: AuthStatusProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/sign-in">{dictionary.signIn}</Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/sign-up">{dictionary.createAccount}</Link>
        </Button>
      </div>
    );
  }

  async function handleSignOut() {
    startTransition(async () => {
      setIsOpen(false);
      await authClient.signOut();
      router.push("/");
      router.refresh();
    });
  }

  const initials = getInitials(user.name, user.email);
  const menuItems = [
    {
      href: "/dashboard/akun",
      label: dictionary.profile,
      icon: UserRound,
      isActive: pathname === "/dashboard/akun",
    },
    {
      href: "/dashboard/terjemahan",
      label: dictionary.settings,
      icon: Settings2,
      isActive: pathname === "/dashboard/terjemahan",
    },
  ];

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex items-center gap-3 rounded-[16px] border border-white/70 bg-[var(--color-card)] px-2.5 py-2 shadow-[0_20px_45px_rgba(16,32,59,0.08)] backdrop-blur-xl hover:-translate-y-0.5 hover:shadow-[0_24px_52px_rgba(16,32,59,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[1.25rem] bg-[linear-gradient(180deg,rgba(28,25,39,0.92),rgba(21,19,29,0.96))] text-sm font-bold tracking-[0.12em] text-white shadow-[0_16px_32px_rgba(124,58,237,0.28)]">
          {initials}
        </div>
        <div className="hidden min-w-0 text-left sm:block">
          <div className="truncate text-sm font-semibold text-[var(--color-foreground)]">
            {user.name}
          </div>
          <div className="truncate text-xs text-[var(--color-muted-foreground)]">
            {user.email}
          </div>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-[1rem] bg-[rgba(255,255,255,0.06)] text-[var(--color-muted-foreground)]">
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-[calc(100%+0.9rem)] z-50 w-[19rem] rounded-[1.7rem] border border-white/75 bg-[var(--color-card)] p-2.5 shadow-[0_28px_80px_rgba(15,23,42,0.18)] backdrop-blur-2xl">
          <div className="rounded-[1.35rem] bg-[linear-gradient(180deg,rgba(28,25,39,0.92),rgba(21,19,29,0.96))] px-4 py-3.5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[1rem] bg-[linear-gradient(180deg,rgba(28,25,39,0.92),rgba(21,19,29,0.96))] text-xs font-bold tracking-[0.12em] text-white">
                {initials}
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-[var(--color-foreground)]">
                  {user.name}
                </div>
                <div className="truncate text-xs text-[var(--color-muted-foreground)]">
                  {user.email}
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-2.5" />

          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  aria-current={item.isActive ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-[1rem] px-3.5 py-3 text-sm font-medium transition-colors",
                    item.isActive
                      ? "bg-[rgba(139,92,246,0.14)] text-[var(--color-primary)] shadow-[inset_0_0_0_1px_rgba(139,92,246,0.25)]"
                      : "text-[var(--color-foreground)] hover:bg-[rgba(255,255,255,0.06)]",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4",
                      item.isActive
                        ? "text-[var(--color-primary)]"
                        : "text-[var(--color-primary)]",
                    )}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <Separator className="my-2.5" />

          <button
            type="button"
            onClick={handleSignOut}
            disabled={isPending}
            className="flex w-full items-center gap-3 rounded-[1rem] px-3.5 py-3 text-left text-sm font-medium text-rose-400 hover:bg-rose-500/10 disabled:opacity-60"
          >
            {isPending ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                {dictionary.signingOut}
              </>
            ) : (
              <>
                <LogOut className="h-4 w-4" />
                {dictionary.signOut}
              </>
            )}
          </button>
        </div>
      ) : null}
    </div>
  );
}
