import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/frontend/components/site-chrome";
import { StoreList } from "@/frontend/features/store-list/sections";

export const Route = createFileRoute("/store-list")({
  validateSearch: (search: Record<string, unknown>) => ({ state: typeof search['state'] === "string" ? search['state'] : "", area: typeof search['area'] === "string" ? search['area'] : "", district: typeof search['district'] === "string" ? search['district'] : "" }),
  head: () => ({ meta: [
    { title: "Retail Store Network List — Rishishwar Industry" },
    { name: "description", content: "Browse Rishishwar Industry retail network totals by state, area and district." },
    { property: "og:title", content: "Retail Store Network List — Rishishwar Industry" },
    { property: "og:description", content: "Explore verified district-level retail network coverage across India." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: StoreListPage,
});
function StoreListPage(){ const search=Route.useSearch(); return <div className="min-h-screen bg-background"><SiteHeader/><main><StoreList initial={search}/></main><SiteFooter/></div>; }
