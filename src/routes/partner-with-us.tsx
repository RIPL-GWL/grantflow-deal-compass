import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Factory, Store } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/frontend/components/site-chrome";
import { Button } from "@/frontend/components/ui/button";
import { EmailForm } from "@/frontend/components/forms/email-form";
import { mfgFields, retailFields } from "@/frontend/content/forms";

export const Route = createFileRoute("/partner-with-us")({
  validateSearch: (search: Record<string, unknown>): { partner?: "manufacturer" } =>
    search["partner"] === "manufacturer" ? { partner: "manufacturer" } : {},
  head: () => ({
    meta: [
      { title: "Partner With Us — Retail Store & Manufacturer Registration | Rishishwar Industry" },
      { name: "description", content: "Register as a retail store partner or as an FMCG manufacturer with Rishishwar Industry. Our team will contact you for the next steps." },
      { property: "og:title", content: "Partner With Us — Rishishwar Industry" },
      { property: "og:description", content: "Retail store and manufacturer registration forms for Rishishwar Industry partnerships." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PartnerPage,
});

function PartnerPage() {
  const { partner } = Route.useSearch();
  const [tab, setTab] = useState<"retail" | "mfg">(partner === "manufacturer" ? "mfg" : "retail");
  const tabs = [
    { id: "retail" as const, icon: Store, title: "Retail Store Partner", text: "Apni dukaan ko hamare network se jodiye" },
    { id: "mfg" as const, icon: Factory, title: "Manufacturer Partner", text: "Apne products ko naye markets tak pahunchaiye" },
  ];
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
         <section className="cinematic-section border-b border-border bg-ink px-4 text-ink-foreground sm:px-6">
          <div className="mx-auto max-w-4xl text-center">
             <p className="royal-label justify-center">Partnership Registration</p>
              <h1 className="mt-6 text-4xl sm:text-6xl lg:text-7xl">Partner <span className="text-accent-foreground">With Us</span></h1>
            <p className="mx-auto mt-4 max-w-2xl text-ink-foreground/75">Retail store ho ya FMCG manufacturer — neeche apni category chuniye, form bhariye, aur hamari team aapse agle steps ke liye contact karegi.</p>
          </div>
        </section>
        <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
          <div role="tablist" className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            {tabs.map(({ id, icon: Icon, title, text }) => (
               <Button key={id} id={`${id}-tab`} role="tab" aria-controls="partner-panel" aria-selected={tab === id} onClick={() => setTab(id)} variant="outline"
                  className={`card-lift h-auto justify-start whitespace-normal rounded-sm border p-4 text-left normal-case tracking-normal sm:p-5 ${tab === id ? "border-primary bg-accent text-foreground" : "border-border bg-card text-foreground"}`}>
                <Icon className="mt-0.5 size-7 shrink-0 text-primary" aria-hidden="true" />
                <div><h2 className="text-lg">{title}</h2><p className="mt-1 text-sm text-muted-foreground">{text}</p></div>
               </Button>
            ))}
          </div>
           <div id="partner-panel" role="tabpanel" aria-labelledby={`${tab}-tab`} className="mt-8 rounded-sm border border-border bg-card p-5 sm:p-8">
            <h2 className="mb-6 text-2xl">{tab === "retail" ? "Retail Store Registration Form" : "Manufacturer Registration Form"}</h2>
            {tab === "retail"
              ? <EmailForm key="r" fields={retailFields} subject="Retail Store Partner Registration" intro="Retail Store Partner Registration" />
              : <EmailForm key="m" fields={mfgFields} subject="Manufacturer Partner Registration" intro="Manufacturer Partner Registration" />}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
