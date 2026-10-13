import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/frontend/components/site-chrome";
import { AboutHero, MissionVision, Story, StatsBar, WhatWeDo, WhyUs, GlobalMindset, GrowCta, MarketChallenges, WhatWeDoAndSolve } from "@/frontend/features/about/sections";
import { districtFigure, totalStoreFigure } from "@/frontend/data/retail-network";
import { SeasonalPageBanner } from "@/frontend/components/seasonal-page-banner";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      {
        title:
          "About Us — Rishishwar Industry Pvt. Ltd. | Driven by Markets. Built for Manufacturers.",
      },
      {
        name: "description",
        content:
          `Rishishwar Industry helps FMCG manufacturers grow beyond factory walls — ${totalStoreFigure} retail stores, ${districtFigure} districts in India and 8 countries of market access.`,
      },
      {
        property: "og:title",
        content: "About Rishishwar Industry — Driven by Markets. Built for Manufacturers.",
      },
      {
        property: "og:description",
        content:
          "From local markets to global opportunities: our story, mission and the market access we create for FMCG manufacturers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <SeasonalPageBanner title="Stronger Partnerships. New Beginnings." />
        <AboutHero />
        <MissionVision />
        <Story />
        <StatsBar />
        <WhatWeDoAndSolve />
        <MarketChallenges />
        <WhatWeDo />
        <WhyUs />
        <GlobalMindset />
        <GrowCta />
      </main>
      <SiteFooter />
    </div>
  );
}

