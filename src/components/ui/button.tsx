import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all outline-none disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-primary)] px-5 py-3 text-white shadow-[0_14px_40px_rgba(15,98,254,0.25)] hover:-translate-y-0.5 hover:bg-[var(--color-primary-strong)] focus-visible:ring-[var(--color-primary)]",
        secondary:
          "border border-[var(--color-border)] bg-white/80 px-5 py-3 text-[var(--color-foreground)] hover:bg-white focus-visible:ring-[var(--color-primary)]",
        ghost:
          "px-4 py-2 text-[var(--color-muted-foreground)] hover:bg-white/70 hover:text-[var(--color-foreground)] focus-visible:ring-[var(--color-primary)]",
      },
      size: {
        default: "h-11",
        sm: "h-9 px-4 text-sm",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
