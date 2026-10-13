import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/frontend/components/site-chrome";
import { ValuationResults } from "@/frontend/features/valuation/valuation-results";

export const Route = createFileRoute("/business-valuation-report")({
  head: () => ({
    links: [{ rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" }],
    meta: [
      { title: "Your Business Valuation Report | Rishishwar Industry" },
      { name: "description", content: "Review your calculated business valuation range, financial analysis, funding readiness and personalised advice." },
      { property: "og:title", content: "Business Valuation Report | Rishishwar Industry" },
      { property: "og:description", content: "Indicative business valuation analysis based on your submitted business details and financial figures." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ReportPage,
});

function ReportPage() {
  return <div className="min-h-screen bg-background"><SiteHeader /><div className="valuation-page"><ValuationResults /></div><SiteFooter /></div>;
}