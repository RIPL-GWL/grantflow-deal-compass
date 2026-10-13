import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/frontend/components/site-chrome";
import { PaymentDetails } from "@/frontend/features/payment/sections";

export const Route = createFileRoute("/payment")({
  head: () => ({ meta: [
    { title: "Payment Account Details — Rishishwar Industry" },
    { name: "description", content: "Bank account details for payments to Rishishwar Industry Private Limited by country, currency and payment method." },
    { property: "og:title", content: "Payment Account Details — Rishishwar Industry" },
    { property: "og:description", content: "Find Rishishwar Industry payment details for USD, GBP, AED, EUR, CAD and AUD transfers." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <div className="min-h-screen bg-background"><SiteHeader /><PaymentDetails /><SiteFooter /></div>,
});