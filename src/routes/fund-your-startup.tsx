import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/frontend/components/site-chrome";
import { StartupPageContent } from "@/frontend/features/fund-your-startup/page";
export const Route = createFileRoute("/fund-your-startup")({
  head: () => ({ meta: [{ title: "Fund Your Startup — Ideas to Impact | Rishishwar Industry" }, { name: "description", content: "Turn bold ideas into growing businesses with startup funding guidance, expert mentorship, strategic support and nationwide market connections." }, { property: "og:title", content: "Fund Your Startup — Rishishwar Industry" }, { property: "og:description", content: "Funding, mentorship and strategic support to help visionary founders move from idea to impact." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: FundingPage,
});
function FundingPage() { return <div className="min-h-screen bg-background"><SiteHeader /><StartupPageContent /><SiteFooter /></div>; }