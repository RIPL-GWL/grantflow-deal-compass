import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/frontend/features/legal/legal-page";
import { COMPANY } from "@/frontend/content/company";

export const Route = createFileRoute("/terms")({
  head: () => ({ links: [{ rel: "canonical", href: "/terms" }],
    meta: [
      { title: "Terms & Conditions — Rishishwar Industry Pvt. Ltd." },
      { name: "description", content: "Terms that apply when you use the Rishishwar Industry website, calculators and enquiry forms." },
      { property: "og:title", content: "Terms & Conditions — Rishishwar Industry" },
      { property: "og:description", content: "Terms that apply when you use the Rishishwar Industry website, calculators and enquiry forms." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <LegalPage title="Terms & Conditions">
      <p>By using this website you agree to these terms.</p>
      <h2>Use of the website</h2>
      <p>Content is provided for general business information about RIPL’s market-access services. You agree not to misuse forms, submit false information or attempt to disrupt the website.</p>
      <h2>Calculators and estimates</h2>
      <p>The Business Valuation Calculator, rent estimates and similar tools give indicative results only. They are not offers, valuations or commitments.</p>
      <h2>Enquiries and partnerships</h2>
      <p>Submitting a form does not create a contract. Any partnership, appointment or service is subject to separate written agreement.</p>
      <h2>Contact</h2>
      <p>Questions about these terms: <a href={`mailto:${COMPANY.infoEmail}`}>{COMPANY.infoEmail}</a>.</p>
    </LegalPage>
  );
}
