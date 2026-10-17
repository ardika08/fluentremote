"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowUpRight,
  KeyRound,
  Languages,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  Menu,
  Puzzle,
  UserRound,
  Users,
  X,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export type DashboardLabels = {
  brand: string;
  overview: string;
  license: string;
  translation: string;
  extension: string;
  account: string;
  members: string;
  backToSite: string;
  signOut: string;
  signingOut: string;
  menu: string;
};

const NAV = [
  { href: "/dashboard", labelKey: "overview", icon: LayoutDashboard },
  { href: "/dashboard/lisensi", labelKey: "license", icon: KeyRound },
  { href: "/dashboard/terjemahan", labelKey: "translation", icon: Languages },
  { href: "/dashboard/ekstensi", labelKey: "extension", icon: Puzzle },
  { href: "/dashboard/akun", labelKey: "account", icon: UserRound },
] as const;

/** Menu admin — hanya dirender kalau email ada di ADMIN_EMAILS. */
const ADMIN_NAV = { href: "/dashboard/member", labelKey: "members", icon: Users } as const;

function initials(name: string, email: string) {
  const tokens = name.trim().split(/\s+/).filter(Boolean).slice(0, 2);
  if (tokens.length) return tokens.map((t) => t[0]?.toUpperCase() ?? "").join("");
  return email.slice(0, 2).toUpperCase();
}

export function DashboardShell({
  user,
  labels,
  showAdmin = false,
  children,
}: {
  user: { name: string; email: string };
  labels: DashboardLabels;
  showAdmin?: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  async function handleSignOut() {
    startTransition(async () => {
      setOpen(false);
      await authClient.signOut();
      router.push("/");
      router.refresh();
    });
  }

  const navItems = showAdmin ? [...NAV, ADMIN_NAV] : NAV;

  const navList = (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-[14px] px-3.5 py-3 text-sm font-medium transition-colors",
              active
                ? "bg-[rgba(139,92,246,0.14)] text-[var(--color-primary)] shadow-[inset_0_0_0_1px_rgba(139,92,246,0.28)]"
                : "text-[var(--color-foreground)] hover:bg-[rgba(255,255,255,0.06)]",
            )}
          >
            <Icon className="h-4 w-4 text-[var(--color-primary)]" />
            <span>{labels[item.labelKey]}</span>
          </Link>
        );
      })}
    </nav>
  );

  const accountBlock = (
    <div className="space-y-3">
      <div className="flex items-center gap-3 rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[linear-gradient(135deg,rgba(124,58,237,0.95),rgba(217,70,239,0.9))] text-xs font-bold tracking-[0.12em] text-white">
          {initials(user.name, user.email)}
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-[var(--color-foreground)]">{user.name}</div>
          <div className="truncate text-xs text-[var(--color-muted-foreground)]">{user.email}</div>
        </div>
      </div>

      <Link
        href="/"
        className="flex items-center justify-between rounded-[14px] px-3.5 py-3 text-sm font-medium text-[var(--color-muted-foreground)] hover:bg-[rgba(255,255,255,0.06)] hover:text-[var(--color-foreground)]"
      >
        <span>{labels.backToSite}</span>
        <ArrowUpRight className="h-4 w-4" />
      </Link>

      <button
        type="button"
        onClick={handleSignOut}
        disabled={isPending}
        className="flex w-full items-center gap-3 rounded-[14px] px-3.5 py-3 text-left text-sm font-medium text-rose-400 hover:bg-rose-500/10 disabled:opacity-60"
      >
        {isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
        {isPending ? labels.signingOut : labels.signOut}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Bar mobile */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-[var(--color-border)] bg-[rgba(12,11,16,0.92)] px-4 py-3 backdrop-blur-xl lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[linear-gradient(135deg,#7c3aed,#d946ef)] text-[11px] font-bold text-white">
            FR
          </div>
          <span className="text-sm font-semibold text-[var(--color-foreground)]">{labels.brand}</span>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={labels.menu}
          className="rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface)] p-2 text-[var(--color-foreground)]"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {open ? (
        <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4 lg:hidden">
          {navList}
          <div className="mt-4">{accountBlock}</div>
        </div>
      ) : null}

      <div className="mx-auto flex w-full max-w-7xl gap-8 px-6 py-10 lg:px-10">
        {/* Sidebar desktop */}
        <aside className="hidden w-[260px] shrink-0 lg:block">
          <div className="sticky top-8 space-y-5">
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[linear-gradient(135deg,#7c3aed,#d946ef)] text-xs font-bold text-white">
                FR
              </div>
              <span className="text-base font-semibold text-[var(--color-foreground)]">{labels.brand}</span>
            </Link>
            <div className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-card)] p-3">
              {navList}
              <div className="mt-4 border-t border-[var(--color-border)] pt-4">{accountBlock}</div>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
