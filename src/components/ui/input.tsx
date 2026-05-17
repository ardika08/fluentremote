import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-2xl border border-[var(--color-border)] bg-white/80 px-4 py-3 text-sm text-[var(--color-foreground)] shadow-sm outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
