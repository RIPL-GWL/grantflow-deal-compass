import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/frontend/components/site-chrome";
import { HeroSection, HighlightsSection, CalculatorSection, CtaSection } from "@/frontend/features/retailer-partner/sections";

export const Route = createFileRoute("/retailer-partner")({
  head: () => ({
    meta: [
      { title: "Retailer Partner & Approx. Rent Calculator — Rishishwar Industry" },
      { name: "description", content: "Explore the Rishishwar Industry retailer partnership and calculate an indicative monthly store rent from your location and shop area. Estimates are subject to inspection and approval." },
      { property: "og:title", content: "Retailer Partner — Rishishwar Industry" },
      { property: "og:description", content: "Calculate an approximate, non-guaranteed monthly store rent with Rishishwar Industry." },

      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RetailerPartnerPage,
});

function RetailerPartnerPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <HeroSection />
        <HighlightsSection />
        <CalculatorSection />
        <CtaSection />
      </main>
      <SiteFooter />
    </div>
  );
}
