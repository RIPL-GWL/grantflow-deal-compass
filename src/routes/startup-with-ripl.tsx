import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/frontend/components/site-chrome";
import { RiplStartupPageContent } from "@/frontend/features/startup-with-ripl/page";
const description = "Build with RIPL. Grow with purpose. Explore startup funding pathways, mentorship, growth strategy and nationwide market access with Rishishwar Industry.";
export const Route = createFileRoute("/startup-with-ripl")({
  head: () => ({ meta: [{ title: "Startup with RIPL — Rishishwar Industry" }, { name: "description", content: description }, { property: "og:title", content: "Startup with RIPL — Rishishwar Industry" }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: () => <div className="min-h-screen bg-background"><SiteHeader /><RiplStartupPageContent /><SiteFooter /></div>,
});