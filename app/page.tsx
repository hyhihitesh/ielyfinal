import { SideNav } from "@/components/landing/side-nav"

import { HeroSection } from "@/components/landing/hero-section"
import { ProblemSection } from "@/components/landing/problem-section"
import { SolutionSection } from "@/components/landing/solution-section"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { ComparisonSection } from "@/components/landing/comparison-section"
import { WhoItsForSection } from "@/components/landing/who-its-for-section"
import { PricingSection } from "@/components/landing/pricing-section"
import { FinalCtaSection } from "@/components/landing/final-cta-section"

export default function Page() {
  return (
    <>
      <SideNav />
      <main className="relative pt-0">
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <HowItWorksSection />
        <ComparisonSection />
        <WhoItsForSection />
        <PricingSection />
        <FinalCtaSection />
      </main>
    </>
  )
}
