import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/frontend/components/site-chrome";
import { HeroSection, ServicesDetailSection, HowWeWorkSection, WhoWeServeSection, ServiceCtasSection, CtaStripSection } from "@/frontend/features/our-services/sections";
import { totalStoreFigure } from "@/frontend/data/retail-network";

export const Route = createFileRoute("/our-services")({
  head: () => ({
    meta: [
      { title: "Our Services — Market Access, Distribution & Global Expansion | Rishishwar Industry" },
      { name: "description", content: `Explore Rishishwar Industry services: retail network access across ${totalStoreFigure} stores, distributor & dealer appointment, domestic market expansion, import & export support and business funding assistance for FMCG manufacturers.` },
      { property: "og:title", content: "Our Services — From Factory Gate To Global Shelf | Rishishwar Industry" },
      { property: "og:description", content: "Retail network access, distributor & dealer appointment, domestic expansion, import & export support and funding assistance — everything your brand needs to grow." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OurServicesPage,
});

function OurServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <HeroSection />
        <ServicesDetailSection />
        <HowWeWorkSection />
        <WhoWeServeSection />
        <ServiceCtasSection />
        <CtaStripSection />
      </main>
      <SiteFooter />
    </div>
  );
}

