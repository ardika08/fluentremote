import { Badge } from "@/components/ui/badge";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  centered?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
}: SectionHeadingProps) {
  return (
    <div className={centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <Badge>{eyebrow}</Badge>
      <h2 className="mt-5 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-foreground)] sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-[var(--color-muted-foreground)]">
        {description}
      </p>
    </div>
  );
}
