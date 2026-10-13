import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/frontend/components/site-chrome";
import { CapabilitiesSection, ProcessSection, CtaSection } from "@/frontend/features/home/sections";
import { HomeNetwork } from "@/frontend/features/home/network";
import { ServiceGuide } from "@/frontend/features/home/service-guide";
import { districtFigure, totalStoreFigure } from "@/frontend/data/retail-network";
import { NavratriHome } from "@/frontend/features/home/navratri";
import { isNavratri, useSiteTheme } from "@/frontend/lib/site-theme";
import { getSiteShareImage } from "@/lib/site-appearance.functions";

export const Route = createFileRoute("/")({
  loader: () => getSiteShareImage(),
  head: ({loaderData}) => ({ meta: [
    { title: "Rishishwar Industry — FMCG Business Growth & Market Expansion" },
    { name: "description", content: "Grow your FMCG business with Rishishwar Industry: retail partnerships, startup support, funding assistance and market expansion across India and global markets." },
    { property: "og:title", content: "Rishishwar Industry — FMCG Business Growth & Market Expansion" },
    { property: "og:description", content: `FMCG market access, retail partnerships and business growth support across ${totalStoreFigure} stores, ${districtFigure} districts and 8 countries.` },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
    ...(loaderData?.image?.startsWith("https://") ? [{ property: "og:image", content: loaderData.image }, { name: "twitter:image", content: loaderData.image }] : []),
  ]}), component: HomePage,
});

function HomePage() {
  const theme = useSiteTheme();
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        {isNavratri(theme) ? <NavratriHome /> : <>
        <HomeNetwork />
        <CapabilitiesSection />
        <ServiceGuide />
        <ProcessSection />
        <CtaSection />
        </>}
      </main>
      <SiteFooter />
    </div>
  );
}
