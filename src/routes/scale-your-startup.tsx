import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/frontend/components/site-chrome";
import { ScaleStartupPageContent } from "@/frontend/features/scale-your-startup/page";
const description = "Scale faster, build smarter and grow stronger with RIPL: startup growth strategy, funding pathways, sales support, technology, mentorship and market access across India and 8 countries.";
export const Route = createFileRoute("/scale-your-startup")({
  head: () => ({ meta: [{ title: "Scale Your Startup — Rishishwar Industry" }, { name: "description", content: description }, { property: "og:title", content: "Scale Your Startup — Rishishwar Industry" }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: () => <div className="min-h-screen bg-background"><SiteHeader /><ScaleStartupPageContent /><SiteFooter /></div>,
});