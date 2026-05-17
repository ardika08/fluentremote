import Link from "next/link";
import {
  ArrowRight,
  Languages,
  MessageSquareQuote,
  Repeat2,
  Shield,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FeatureCard } from "@/components/feature-card";
import { SectionHeading } from "@/components/section-heading";
import { SecurityCard } from "@/components/security-card";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { getMayarPricing } from "@/lib/mayar";

export default async function HomePage() {
  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  const pricing = getMayarPricing(locale);

  return (
    <main className="flex-1">
      <section className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 -z-10 h-[40rem] bg-[radial-gradient(circle_at_top_left,_rgba(15,98,254,0.18),_transparent_40%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.16),_transparent_35%),linear-gradient(180deg,_rgba(252,252,249,0.95)_0%,_rgba(244,247,252,0.78)_100%)]" />
        <div className="mx-auto grid w-full max-w-7xl gap-14 px-6 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:px-10 lg:py-24">
          <div className="max-w-3xl">
            <Badge variant="primary">{dictionary.home.heroBadge}</Badge>
            <h1 className="mt-7 font-[family-name:var(--font-display)] text-5xl font-semibold leading-tight tracking-tight text-[var(--color-foreground)] sm:text-6xl">
              {dictionary.home.heroTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--color-muted-foreground)]">
              {dictionary.home.heroDescription}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/checkout">
                  {dictionary.home.primaryCta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/settings">{dictionary.home.secondaryCta}</Link>
              </Button>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {dictionary.home.stats.map((stat) => (
                <div
                  key={stat.title}
                  className="rounded-[24px] border border-white/60 bg-white/72 p-4 backdrop-blur-sm"
                >
                  <div className="text-3xl font-semibold text-[var(--color-foreground)]">
                    {stat.title}
                  </div>
                  <div className="mt-2 text-sm text-[var(--color-muted-foreground)]">
                    {stat.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Card className="overflow-hidden border-white/60 bg-[linear-gradient(180deg,_rgba(255,255,255,0.96)_0%,_rgba(244,247,252,0.92)_100%)]">
            <CardContent className="space-y-6 p-6">
              <div className="space-y-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <div className="text-sm tracking-[0.2em] text-[var(--color-muted-foreground)] uppercase">
                      {dictionary.home.preview.eyebrow}
                    </div>
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold tracking-[0.18em] text-emerald-800 uppercase">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {dictionary.home.preview.live}
                    </div>
                  </div>
                  <div className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold">
                    {dictionary.home.preview.title}
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-primary)]/12 text-[var(--color-primary)]">
                    <Languages className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[var(--color-foreground)]">
                      {dictionary.home.preview.pairTitle}
                    </div>
                    <div className="text-sm text-[var(--color-muted-foreground)]">
                      {dictionary.home.preview.pairValue}
                    </div>
                  </div>
                </div>
                <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-foreground)]">
                    <MessageSquareQuote className="h-4 w-4 text-[var(--color-primary)]" />
                    {dictionary.home.preview.readTitle}
                  </div>
                  <div className="demo-stage relative mt-3 min-h-[28rem] overflow-hidden rounded-[20px] border border-slate-100 bg-[linear-gradient(180deg,_#ffffff_0%,_#f8fbff_100%)] p-4 sm:min-h-[24rem] lg:min-h-[22rem]">
                    <div className="space-y-3">
                      <div className="max-w-[88%] rounded-[22px] rounded-bl-md border border-slate-100 bg-white px-4 py-3 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
                        <div className="mb-1 text-[11px] font-semibold tracking-[0.16em] text-[var(--color-primary)] uppercase">
                          {dictionary.home.preview.clientLabel}
                        </div>
                        <p className="text-sm leading-7 text-[var(--color-foreground)]">
                          &quot;
                          <span className="demo-highlight demo-highlight-read relative z-10 rounded-md px-1.5 py-0.5">
                            {dictionary.home.preview.clientMessage}
                          </span>
                          &quot;
                        </p>
                      </div>

                      <div className="demo-message-write mt-16 ml-auto max-w-[86%] rounded-[22px] rounded-br-md bg-[var(--color-primary)]/10 px-4 py-3 shadow-[0_12px_30px_rgba(15,98,254,0.08)] sm:mt-14 sm:max-w-[82%]">
                        <div className="mb-1 text-[11px] font-semibold tracking-[0.16em] text-[var(--color-primary)] uppercase">
                          {dictionary.home.preview.meLabel}
                        </div>
                        <p className="text-sm leading-7 text-[var(--color-foreground)]">
                          &quot;
                          <span className="demo-highlight demo-highlight-write relative z-10 inline-flex items-center rounded-md px-1.5 py-0.5">
                            <span className="demo-typed-text">
                              {dictionary.home.preview.meDraft}
                            </span>
                            <span className="demo-typed-caret" aria-hidden="true">
                              |
                            </span>
                          </span>
                          &quot;
                        </p>
                      </div>
                    </div>

                    <div className="demo-tooltip demo-tooltip-read absolute left-4 right-4 top-[6.75rem] rounded-2xl border border-sky-100 bg-white/95 p-4 text-sm leading-7 text-[var(--color-foreground)] shadow-[0_18px_60px_rgba(15,98,254,0.16)] backdrop-blur-sm sm:right-10 sm:top-[5.9rem]">
                      <div className="mb-1 text-[11px] font-semibold tracking-[0.18em] text-[var(--color-primary)] uppercase">
                        FluentRemote
                      </div>
                      <div className="text-[11px] font-semibold tracking-[0.16em] text-[var(--color-muted-foreground)] uppercase">
                        {dictionary.home.preview.readTooltipLabel}
                      </div>
                      <div className="mt-2 rounded-xl bg-sky-50 px-3 py-2.5 text-[15px] leading-7 text-slate-900">
                        {dictionary.home.preview.readTooltipText}
                      </div>
                    </div>

                    <div className="demo-tooltip demo-tooltip-write absolute bottom-4 left-4 right-4 w-auto rounded-2xl border border-emerald-100 bg-white/95 p-4 text-sm leading-6 text-[var(--color-foreground)] shadow-[0_18px_60px_rgba(16,185,129,0.16)] backdrop-blur-sm sm:left-auto sm:right-4 sm:w-[18rem]">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-[11px] font-semibold tracking-[0.18em] text-emerald-700 uppercase">
                            FluentRemote
                          </div>
                          <div className="mt-1 text-[11px] font-semibold tracking-[0.16em] text-[var(--color-muted-foreground)] uppercase">
                            {dictionary.home.preview.writeTooltipLabel}
                          </div>
                        </div>
                        <div
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-emerald-200 bg-white text-emerald-700 shadow-[0_8px_24px_rgba(16,185,129,0.10)] transition duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800 hover:shadow-[0_12px_28px_rgba(16,185,129,0.18)] active:translate-y-0 active:scale-95 active:bg-emerald-100"
                          aria-label={dictionary.home.preview.writeTooltipAction}
                          title={dictionary.home.preview.writeTooltipAction}
                        >
                          <Repeat2 className="h-3.5 w-3.5" />
                        </div>
                      </div>
                      <div className="mt-3 rounded-2xl bg-emerald-50 px-3 py-3">
                        <div className="text-[11px] font-semibold tracking-[0.16em] text-emerald-800 uppercase">
                          {dictionary.home.preview.writeTooltipLabel}
                        </div>
                        <div className="mt-1 text-[15px] leading-7 text-emerald-950">
                          {dictionary.home.preview.writeTooltipText}
                        </div>
                      </div>
                    </div>

                    <div className="demo-cursor pointer-events-none absolute left-6 top-10 z-20 sm:left-8">
                      <div className="relative h-5 w-5 rotate-[8deg]">
                        <div className="absolute left-0 top-0 h-0 w-0 border-b-[18px] border-l-[11px] border-r-[11px] border-b-[var(--color-foreground)] border-l-transparent border-r-transparent drop-shadow-[0_10px_18px_rgba(15,23,42,0.25)]" />
                        <div className="absolute left-[7px] top-[10px] h-4 w-1 rounded-full bg-white/90" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-foreground)]">
                    <Zap className="h-4 w-4 text-[var(--color-primary)]" />
                    {dictionary.home.preview.rewriteTitle}
                  </div>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-muted-foreground)]">
                    {dictionary.home.preview.rewriteDescription}
                  </p>
                </div>
                <div className="rounded-[24px] bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-foreground)]">
                    <Shield className="h-4 w-4 text-[var(--color-primary)]" />
                    {dictionary.home.preview.secureTitle}
                  </div>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-muted-foreground)]">
                    {dictionary.home.preview.secureDescription}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="features" className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-10">
        <SectionHeading
          eyebrow={dictionary.home.features.eyebrow}
          title={dictionary.home.features.title}
          description={dictionary.home.features.description}
          centered
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {dictionary.home.features.cards.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              index={`0${index + 1}`}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-10">
        <Card className="border-white/60 bg-[linear-gradient(180deg,_rgba(14,25,46,0.98)_0%,_rgba(18,33,59,0.96)_100%)] text-white">
          <CardContent className="p-8">
            <Badge variant="primary">{dictionary.home.pricingPanel.badge}</Badge>
            <h2 className="mt-6 font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight">
              {dictionary.home.pricingPanel.title}
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-300">
              {dictionary.home.pricingPanel.description}
            </p>
            <div className="mt-8 flex items-end gap-3">
              <div className="text-4xl font-semibold sm:text-5xl">{pricing.formatted}</div>
              <div className="pb-1 text-sm uppercase tracking-[0.2em] text-slate-400">
                {dictionary.home.pricingPanel.priceSuffix}
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="grid gap-5 md:grid-cols-2">
          {dictionary.home.pricingPanel.cards.map((card) => (
            <FeatureCard
              key={card.index}
              index={card.index}
              title={card.title}
              description={card.description}
            />
          ))}
        </div>
      </section>

      <section id="security" className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-10">
        <SectionHeading
          eyebrow={dictionary.home.security.eyebrow}
          title={dictionary.home.security.title}
          description={dictionary.home.security.description}
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {dictionary.home.security.cards.map((card) => (
            <SecurityCard
              key={card.title}
              title={card.title}
              description={card.description}
            />
          ))}
        </div>
      </section>

      <section id="pricing" className="mx-auto w-full max-w-7xl px-6 pb-24 lg:px-10">
        <Card className="overflow-hidden border-white/60 bg-[linear-gradient(135deg,_rgba(15,98,254,0.95)_0%,_rgba(14,165,233,0.92)_100%)] text-white">
          <CardContent className="flex flex-col gap-8 p-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <Badge variant="primary">{dictionary.home.finalCta.badge}</Badge>
              <h2 className="mt-5 font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight">
                {dictionary.home.finalCta.title}
              </h2>
              <p className="mt-4 text-base leading-7 text-sky-50/90">
                {dictionary.home.finalCta.description}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="secondary" size="lg">
                <Link href="/checkout">{dictionary.home.finalCta.activate}</Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-slate-950 shadow-[0_18px_50px_rgba(2,6,23,0.28)] hover:bg-slate-900"
              >
                <Link href="/settings">{dictionary.home.finalCta.settings}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
