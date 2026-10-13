import { createFileRoute } from "@tanstack/react-router";

import { FundingProgrammePage } from "@/frontend/features/funding-programme/page";

export const Route = createFileRoute("/funding-programme")({
  head: () => ({ meta: [
    { title: "RIPL Startup Funding Programme 2026 — Gwalior Summit" },
    { name: "description", content: "Pitch, connect, raise and grow at the RIPL Startup Funding Programme, 29–31 December 2026 in Gwalior. Explore mentorship, investor connections and funding opportunities up to ₹15 lakhs, subject to selection and terms." },
    { property: "og:title", content: "RIPL Startup Funding Programme 2026 — Gwalior Summit" },
    { property: "og:description", content: "A three-day startup summit in Gwalior with a five-stage founder journey, mentorship and investor pitches. 29–31 December 2026." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "/funding-programme" }] }),
  component: Page,
});
function Page() { return <div className="min-h-screen bg-background"><FundingProgrammePage /></div>; }