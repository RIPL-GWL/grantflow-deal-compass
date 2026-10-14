import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/frontend/features/legal/legal-page";
import { COMPANY } from "@/frontend/content/company";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({ links: [{ rel: "canonical", href: "/disclaimer" }],
    meta: [
      { title: "Disclaimer — Rishishwar Industry Pvt. Ltd." },
      { name: "description", content: "Important notes on funding, valuation estimates, rent estimates and global market information on the RIPL website." },
      { property: "og:title", content: "Disclaimer — Rishishwar Industry" },
      { property: "og:description", content: "Important notes on funding, valuation estimates, rent estimates and global market information on the RIPL website." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <LegalPage title="Disclaimer">
      <h2>Funding</h2>
      <p>Business funding assistance is subject to eligibility, assessment and funding-partner approval. RIPL does not guarantee funding approval, amounts or terms.</p>
      <h2>Valuation and estimates</h2>
      <p>Valuation and rent figures shown by our calculators are indicative and based on the information you enter. Actual values depend on verification, location, inspection and final terms.</p>
      <h2>Global markets</h2>
      <p>Market pages describe opportunities and support RIPL can provide. They do not imply a registered office or operational presence in every market listed.</p>
      <h2>Third parties</h2>
      <p>Product names and brands belong to their respective owners. RIPL does not manufacture or own partner products unless explicitly stated.</p>
    </LegalPage>
  );
}
