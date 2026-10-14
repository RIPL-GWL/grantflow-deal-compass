import { createFileRoute, notFound } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/frontend/components/site-chrome";
import { marketProfiles } from "@/frontend/features/market/content";
import { MarketPageContent } from "@/frontend/features/market/sections";
import { CanadaMarketPage } from "@/frontend/features/market/canada-sections";
import { AustraliaMarketPage } from "@/frontend/features/market/australia-sections";
import { UsaMarketPage } from "@/frontend/features/market/usa-sections";
import { SingaporeMarketPage } from "@/frontend/features/market/singapore-sections";
import { UaeMarketPage } from "@/frontend/features/market/uae-sections";
import { UkMarketPage } from "@/frontend/features/market/uk-sections";
import { EuropeMarketPage } from "@/frontend/features/market/europe-sections";
export const Route=createFileRoute("/global-presence/$market")({
 loader:({params})=>{const profile=marketProfiles[params.market];if(!profile) throw notFound();return profile;},
 head:({loaderData,params})=>{const name=loaderData?.name??"Market";const marketName=name==="India"?"India":`India–${name}`;return {links:[{rel:"canonical",href:`/global-presence/${params.market}`}],meta:[{title:`${marketName} FMCG Trade Support — Rishishwar Industry`},{name:"description",content:`Explore ${marketName} FMCG trade opportunities, market requirements and Rishishwar Industry support.`},{property:"og:title",content:`${marketName} Market Opportunities`},{property:"og:description",content:name==="India"?"FMCG retail access and market-entry support across India.":`FMCG trade opportunities and practical market-entry support between India and ${name}.`},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]};},
 component:Page,
});
function Page(){const profile=Route.useLoaderData();return <div className="min-h-screen bg-background"><SiteHeader/><main>{profile.name === "Europe (European Union)" ? <EuropeMarketPage /> : profile.name === "United Kingdom" ? <UkMarketPage /> : profile.name === "United Arab Emirates" ? <UaeMarketPage /> : profile.name === "Singapore" ? <SingaporeMarketPage /> : profile.name === "United States" ? <UsaMarketPage /> : profile.name === "Australia" ? <AustraliaMarketPage /> : profile.name === "Canada" ? <CanadaMarketPage /> : <MarketPageContent profile={profile}/>}</main><SiteFooter/></div>}
