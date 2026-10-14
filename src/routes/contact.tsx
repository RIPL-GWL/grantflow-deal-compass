import { createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/frontend/components/site-chrome";
import { EmailForm } from "@/frontend/components/forms/email-form";
import { EnquiryChecklist } from "@/frontend/components/forms/enquiry-checklist";
import { contactFields } from "@/frontend/content/forms";
import { SeasonalPageBanner } from "@/frontend/components/seasonal-page-banner";

export const Route = createFileRoute("/contact")({
  head: () => ({ links: [{ rel: "canonical", href: "/contact" }],
    meta: [
      {
        title:
          "Contact Us — Rishishwar Industry Pvt. Ltd. | Let's Build Your Market Together",
      },
      {
        name: "description",
        content:
          "Partner with Rishishwar Industry for FMCG market access. Write to sales@rishishwarindustry.in and our team will get back to you.",
      },
      {
        property: "og:title",
        content: "Contact Rishishwar Industry — Partner With Us",
      },
      {
        property: "og:description",
        content:
          "Ready to grow your FMCG brand in India and beyond? Talk to our team today.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

const contactCards = [
  {
    icon: Mail,
    title: "Sales Enquiries",
    value: "sales@rishishwarindustry.in",
    href: "mailto:sales@rishishwarindustry.in",
  },
  {
    icon: Mail,
    title: "General Information",
    value: "info@rishishwarindustry.in",
    href: "mailto:info@rishishwarindustry.in",
  },
];

function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <SeasonalPageBanner title="Let’s Grow Together This Navratri." />
        <section className="cinematic-section bg-ink text-ink-foreground">
          <div className="page-shell">
            <p className="royal-label">
              Contact Us
            </p>
            <h1 className="mt-6 max-w-3xl text-4xl leading-[1.02] sm:text-6xl lg:text-7xl">
              Let's Build Your{" "}
              <span className="text-primary">Market Together</span>
            </h1>
            <p className="mt-5 max-w-xl leading-relaxed text-ink-foreground/75">
              Whether you want to grow in India or go global, our team is
              ready to help your FMCG brand reach more stores, more cities and
              more countries.
            </p>
          </div>
        </section>

        <EnquiryChecklist />
        <section className="page-shell py-14 sm:py-28">
          <div className="mx-auto max-w-3xl space-y-10">
            <div className="rounded-sm border bg-card p-6 sm:p-8">
              <h2 className="mb-6 text-2xl">Send Us a Message</h2>
              <EmailForm fields={contactFields} subject="Partnership Enquiry" intro="I would like to discuss a partnership." submitLabel="Send Enquiry" />
            </div>

            <div className="space-y-6">
              {contactCards.map((c) => {
                const inner = (
                  <>
                    <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <c.icon className="size-6 text-primary" strokeWidth={1.8} />
                    </span>
                    <div className="min-w-0">
                      <h2 className="text-lg">{c.title}</h2>
                      <p className="mt-1 break-all text-sm text-muted-foreground">
                        {c.value}
                      </p>
                    </div>
                  </>
                );
                return c.href ? (
                  <a
                    key={c.title}
                    href={c.href}
                    className="card-lift flex items-center gap-3 rounded-sm border bg-card p-4 sm:gap-5 sm:p-6"
                  >
                    {inner}
                  </a>
                ) : (
                  <div
                    key={c.title}
                    className="flex items-center gap-5 rounded-sm border bg-card p-6"
                  >
                    {inner}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
