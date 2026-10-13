import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/frontend/features/legal/legal-page";
import { COMPANY } from "@/frontend/content/company";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Rishishwar Industry Pvt. Ltd." },
      { name: "description", content: "How Rishishwar Industry collects, uses and protects the details you share through our website forms." },
      { property: "og:title", content: "Privacy Policy — Rishishwar Industry" },
      { property: "og:description", content: "How Rishishwar Industry collects, uses and protects the details you share through our website forms." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <LegalPage title="Privacy Policy">
      <p>Rishishwar Industry Private Limited (“RIPL”, “we”) respects your privacy. This policy explains what we collect when you use this website and how we use it.</p>
      <h2>What we collect</h2>
      <ul><li>Details you submit in our forms — such as name, company, mobile number, email, location, store or product details.</li><li>Basic technical information needed to run and secure the website.</li></ul>
      <h2>How we use it</h2>
      <ul><li>To respond to your enquiry, partnership request or funding requirement.</li><li>To assess eligibility and connect you with the right RIPL team.</li><li>To prevent spam and misuse of our forms.</li></ul>
      <h2>Sharing</h2>
      <p>We do not sell your personal data. Where needed to process your request (for example, with a funding partner), we share only relevant details and only with your knowledge.</p>
      <h2>Your choices</h2>
      <p>You can ask us to correct or delete your details at any time by writing to <a href={`mailto:${COMPANY.infoEmail}`}>{COMPANY.infoEmail}</a>.</p>
    </LegalPage>
  );
}
