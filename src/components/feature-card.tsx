import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type FeatureCardProps = {
  index: string;
  title: string;
  description: string;
};

export function FeatureCard({ index, title, description }: FeatureCardProps) {
  return (
    <Card className="h-full bg-[var(--color-card)]">
      <CardHeader>
        <div className="text-sm font-semibold tracking-[0.22em] text-[var(--color-primary)] uppercase">
          {index}
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
