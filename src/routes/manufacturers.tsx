import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/frontend/components/site-chrome";
import { HeroSection, ChannelsSection, HowItWorksSection, CtaSection } from "@/frontend/features/manufacturers/sections";
import { totalStoreFigure } from "@/frontend/data/retail-network";

export const Route = createFileRoute("/manufacturers")({
  head: () => ({ meta: [
    { title: "For Manufacturers — FMCG Market Access | Rishishwar Industry" },
    { name: "description", content: "Retail shelf space, distributor connections, new Indian cities and export routes for FMCG manufacturers — with Rishishwar Industry." },
    { property: "og:title", content: "For Manufacturers — Rishishwar Industry" },
    { property: "og:description", content: `Take your FMCG products from the production floor to ${totalStoreFigure} retail stores and 8 countries.` },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ManufacturersPage,
});

function ManufacturersPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <HeroSection />
        <ChannelsSection />
        <HowItWorksSection />
        <CtaSection />
      </main>
      <SiteFooter />
    </div>
  );
}

