import { createFileRoute } from "@tanstack/react-router";
import { InvestorNetwork } from "@/frontend/features/investors/network";
import { getInvestors } from "@/lib/directory.functions";
const description = "Connect with Rishishwar Industry for investment and strategic partnerships supporting FMCG business growth.";
export const Route = createFileRoute("/_authenticated/our-investors/")({
  head: () => ({ meta: [{ title: "Investor Network — Rishishwar Industry" }, { name: "description", content: description }, { property: "og:title", content: "Investor Network — Rishishwar Industry" }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  loader: () => getInvestors(),
  component: () => <InvestorNetwork investors={Route.useLoaderData()} />,
});