import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/frontend/components/site-chrome";
import { HeroSection, FundingNeedsSection, WhoCanApplyFormSection, FundingProcessSection, AcrossIndiaSection, DisclaimerSection } from "@/frontend/features/fund-your-business/sections";

export const Route = createFileRoute("/fund-your-business")({
  head: () => ({
    meta: [
      { title: "Business Funding & Assistance — Manufacturers & Startups | Rishishwar Industry" },
      { name: "description", content: "Explore business funding assistance from ₹50,000 to ₹2 crore for manufacturers and startups. Get guidance for machinery, working capital and expansion." },
      { property: "og:title", content: "Business Funding & Assistance | Rishishwar Industry" },
      { property: "og:description", content: "Funding guidance for manufacturers and startups: seed, growth, expansion and strategic support. Subject to eligibility and partner approval." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FundYourBusinessPage,
});

function FundYourBusinessPage() {
  return (
    <div className="funding-page min-h-screen bg-background">
      <SiteHeader />
      <main>
        <HeroSection />
        <FundingNeedsSection />
        <WhoCanApplyFormSection />
        <FundingProcessSection />
        <AcrossIndiaSection />
        <DisclaimerSection />
      </main>
      <SiteFooter />
    </div>
  );
}

