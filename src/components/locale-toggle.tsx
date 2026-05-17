"use client";

import { Languages } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";
import type { Locale } from "@/types/domain";

type LocaleToggleProps = {
  locale: Locale;
  label: string;
  idLabel: string;
  enLabel: string;
};

export function LocaleToggle({
  locale,
  label,
  idLabel,
  enLabel,
}: LocaleToggleProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function getLocaleHref(nextLocale: Locale) {
    const query = searchParams.toString();
    const redirect = `${pathname}${query ? `?${query}` : ""}`;
    return `/api/locale?locale=${nextLocale}&redirect=${encodeURIComponent(redirect)}`;
  }

  return (
    <div className="flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white/80 p-1 shadow-sm">
      <div className="hidden items-center gap-2 pl-2 text-xs font-semibold tracking-[0.16em] text-[var(--color-muted-foreground)] uppercase sm:flex">
        <Languages className="h-3.5 w-3.5" />
        {label}
      </div>
      <a
        href={getLocaleHref("id")}
        className={cn(
          "rounded-full px-3 py-2 text-xs font-semibold tracking-[0.16em] uppercase",
          locale === "id"
            ? "bg-[var(--color-primary)] text-white"
            : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-surface)]",
        )}
      >
        {idLabel}
      </a>
      <a
        href={getLocaleHref("en")}
        className={cn(
          "rounded-full px-3 py-2 text-xs font-semibold tracking-[0.16em] uppercase",
          locale === "en"
            ? "bg-[var(--color-primary)] text-white"
            : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-surface)]",
        )}
      >
        {enLabel}
      </a>
    </div>
  );
}
