import Link from "next/link";

type SiteFooterProps = {
  dictionary: {
    description: string;
    activate: string;
    settings: string;
  };
};

export function SiteFooter({ dictionary }: SiteFooterProps) {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-card)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-[var(--color-muted-foreground)] md:flex-row md:items-center md:justify-between lg:px-10">
        <div>{dictionary.description}</div>
        <div className="flex items-center gap-5">
          <Link href="/checkout" className="transition hover:text-[var(--color-foreground)]">
            {dictionary.activate}
          </Link>
          <Link href="/settings" className="transition hover:text-[var(--color-foreground)]">
            {dictionary.settings}
          </Link>
        </div>
      </div>
    </footer>
  );
}
