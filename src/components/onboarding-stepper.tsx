import { cn } from "@/lib/utils";

type OnboardingStepperProps = {
  currentStep: 1 | 2 | 3;
  steps: Array<{ title: string; description: string }>;
};

export function OnboardingStepper({ currentStep, steps }: OnboardingStepperProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isComplete = stepNumber < currentStep;

        return (
          <div
            key={step.title}
            className={cn(
              "rounded-[24px] border px-5 py-4 transition",
              isActive && "border-[var(--color-primary)] bg-white shadow-lg",
              isComplete && "border-emerald-200 bg-emerald-50",
              !isActive && !isComplete && "border-[var(--color-border)] bg-white/70",
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold",
                  isActive && "bg-[var(--color-primary)] text-white",
                  isComplete && "bg-emerald-600 text-white",
                  !isActive && !isComplete &&
                    "bg-[var(--color-surface)] text-[var(--color-muted-foreground)]",
                )}
              >
                {stepNumber}
              </div>
              <div>
                <div className="font-semibold text-[var(--color-foreground)]">
                  {step.title}
                </div>
                <p className="text-sm text-[var(--color-muted-foreground)]">
                  {step.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
