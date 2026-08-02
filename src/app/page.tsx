import { LandingHero } from "@/components/landing/hero";
import { LandingHowItWorks } from "@/components/landing/how-it-works";
import { LandingFeatures } from "@/components/landing/features";
import { LandingPricing } from "@/components/landing/pricing";
import { LandingFAQ } from "@/components/landing/faq";
import { LandingFooter } from "@/components/landing/footer";
import { LandingFloatingCTA } from "@/components/landing/floating-cta";
import { LandingNavbar } from "@/components/landing/navbar";
import { getMayarPricing } from "@/lib/mayar";

export default async function HomePage() {
  const pricing = getMayarPricing("id");

  return (
    <div className="min-h-screen bg-slate-950 text-gray-100">
      <LandingNavbar />
      <main>
        <LandingHero price={pricing.formatted} />
        <LandingHowItWorks />
        <LandingFeatures />
        <LandingPricing price={pricing.formatted} formatted={pricing.formatted} />
        <LandingFAQ />
      </main>
      <LandingFooter />
      <LandingFloatingCTA price={pricing.formatted} />
    </div>
  );
}
