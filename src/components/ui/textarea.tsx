import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-28 w-full rounded-2xl border border-[var(--color-border)] bg-white/80 px-4 py-3 text-sm text-[var(--color-foreground)] shadow-sm outline-none transition placeholder:text-[var(--color-muted-foreground)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
