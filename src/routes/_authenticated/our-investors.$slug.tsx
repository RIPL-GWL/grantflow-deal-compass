import { createFileRoute, notFound } from '@tanstack/react-router';
import { getInvestors } from '@/lib/directory.functions';
import { InvestorProfile } from '@/frontend/features/investors/profile';
export const Route=createFileRoute('/_authenticated/our-investors/$slug')({
 loader:async({params})=>{const investor=(await getInvestors()).find(i=>i.slug===params.slug);if(!investor)throw notFound();return investor;},
 head:({loaderData})=>{const title=loaderData?`${loaderData.name} — Investor Profile | Rishishwar Industry`:'Investor Not Found — Rishishwar Industry';const description=loaderData?`Explore ${loaderData.name}'s sample ${loaderData.type.toLowerCase()} profile, focus sectors, investment thesis and partnership opportunities.`:'This investor profile is unavailable.';return {meta:[{title},{name:'description',content:description},{property:'og:title',content:title},{property:'og:description',content:description},{property:'og:type',content:'profile'},{name:'twitter:card',content:'summary_large_image'}]};},
 component:()=> <InvestorProfile investor={Route.useLoaderData()}/>,
});
