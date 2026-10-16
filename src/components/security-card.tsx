import { ShieldCheck } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SecurityCardProps = {
  title: string;
  description: string;
};

export function SecurityCard({ title, description }: SecurityCardProps) {
  return (
    <Card className="h-full bg-[var(--color-card)]">
      <CardHeader className="gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-7 text-[var(--color-muted-foreground)]">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
