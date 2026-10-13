import { createFileRoute } from "@tanstack/react-router";
import { ValuationCalculator } from "@/frontend/features/valuation/valuation-calculator";
import { SiteFooter, SiteHeader } from "@/frontend/components/site-chrome";

export const Route = createFileRoute("/business-valuation-calculator")({
  head: () => ({
    links: [{ rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" }],
    meta: [
      { title: "Business Valuation Calculator — Value, Funding & Equity | Rishishwar Industry" },
      { name: "description", content: "Free business valuation calculator for Indian manufacturers and startups. Estimate valuation, funding readiness, funding range and equity dilution." },
      { property: "og:title", content: "Business Valuation Calculator | Rishishwar Industry" },
      { property: "og:description", content: "Know your business value, estimate funding and equity with revenue, EBITDA, DCF and asset-based methods." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ValuationPage,
});

function ValuationPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="valuation-page"><ValuationCalculator /></div>
      <SiteFooter />
    </div>
  );
}
