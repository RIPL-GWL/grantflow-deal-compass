import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/frontend/components/site-chrome";
import { HeroSection, CountriesSection, EndToEndSupportSection, BiggerMarketsSection, CtaSection } from "@/frontend/features/global-presence/sections";

export const Route = createFileRoute("/global-presence")({
  head: () => ({
    meta: [
      {
        title:
          "Global Presence — Rishishwar Industry Pvt. Ltd. | Indian Brands. Global Markets.",
      },
      {
        name: "description",
        content:
          "Rishishwar Industry serves FMCG manufacturers across 8 countries — India, USA, Canada, UK, Australia, UAE, Singapore and Europe.",
      },
      {
        property: "og:title",
        content: "Global Presence — Rishishwar Industry Pvt. Ltd.",
      },
      {
        property: "og:description",
        content:
          "Reliable FMCG market access and partnerships across 8 countries, from India to the world.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GlobalPresencePage,
});

function GlobalPresencePage() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  if (pathname.startsWith("/global-presence/")) return <Outlet />;
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <HeroSection />
        <CountriesSection />
        <EndToEndSupportSection />
        <BiggerMarketsSection />
        <CtaSection />
      </main>
      <SiteFooter />
    </div>
  );
}

