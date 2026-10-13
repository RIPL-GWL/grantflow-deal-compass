import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/frontend/components/site-chrome";
import { EmailForm } from "@/frontend/components/forms/email-form";
import { storeFields } from "@/frontend/content/forms";

export const Route = createFileRoute("/register-your-store")({
  head: () => ({
    meta: [
      { title: "Register Your Store — Rishishwar Industry Retailer Partner" },
      { name: "description", content: "Register your shop as a Rishishwar Industry retailer partner. Our team will contact you for store inspection and commercial discussion." },
      { property: "og:title", content: "Register Your Store — Rishishwar Industry" },
      { property: "og:description", content: "Join the Rishishwar Industry retailer partner network." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
       <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24">
         <p className="royal-label">Retailer Partnership</p>
         <h1 className="mt-6 text-4xl sm:text-6xl">Register Your <span className="text-accent-foreground">Store</span></h1>
        <p className="mt-3 text-muted-foreground">Details bhejiye — hamari team store inspection aur commercial discussion ke liye aapse contact karegi.</p>
         <div className="mt-10 rounded-sm border border-border bg-card p-5 sm:p-8"><EmailForm fields={storeFields} columns={1} subject="Store Registration" intro="I want to register my store." /></div>
      </main>
      <SiteFooter />
    </div>
  );
}
