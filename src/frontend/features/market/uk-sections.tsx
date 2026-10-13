import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Users, TrendingUp, Globe2, Ship, Gem, Shirt, Cog, Pill, Sprout, Car, FlaskConical, Laptop, Armchair, Factory, Truck, Store, ShieldCheck, Handshake, Building2, FileCheck2, BarChart3, Package, Plane } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import heroSrc from "@/frontend/assets/uk-market/hero.webp";
const hero = { url: heroSrc };
import productsSrcAsset from "@/assets/uk-products.webp.asset.json";
const productsSrc = productsSrcAsset.url;
const products = { url: productsSrc };
import bridgeSrcAsset from "@/assets/uk-bridge.webp.asset.json";
const bridgeSrc = bridgeSrcAsset.url;
const bridge = { url: bridgeSrc };

type Point = { icon: LucideIcon; title: string; note?: string };
const exports: Point[] = [
  { icon: Shirt, title: "Textiles & Apparel (Ready-made Garments)" },
  { icon: Pill, title: "Pharmaceuticals & Healthcare Products" },
  { icon: Gem, title: "Gems & Jewellery" },
  { icon: Cog, title: "Engineering Goods & Machinery" },
  { icon: Car, title: "Automobiles & Auto Components" },
  { icon: FlaskConical, title: "Chemicals & Plastics" },
  { icon: Sprout, title: "Agri & Food Products (Spices, Tea, Rice, Processed Foods)" },
  { icon: Laptop, title: "IT Services & Professional Services" },
];
const imports: Point[] = [
  { icon: Pill, title: "Pharmaceuticals & Medical Products" },
  { icon: Shirt, title: "Textiles, Fabrics & Home Textiles" },
  { icon: Gem, title: "Gems, Diamonds & Precious Stones" },
  { icon: Cog, title: "Machinery & Electrical Equipment" },
  { icon: FlaskConical, title: "Petroleum Products & Chemicals" },
  { icon: Sprout, title: "Food Products (Tea, Spices, Processed Foods)" },
  { icon: Laptop, title: "IT & Professional Services" },
  { icon: Armchair, title: "Furniture, Handicrafts & Lifestyle Products" },
];
const categories = [
  { title: "Textiles & Garments", note: "Fabrics, Apparel, Home Textiles", alt: "Colourful Indian silk fabrics" },
  { title: "Pharmaceuticals", note: "Formulations, Generics, Healthcare Products", alt: "Medicine bottles and tablets" },
  { title: "Gems & Jewellery", note: "Diamonds, Gold Jewellery, Precious & Semi-Precious Stones", alt: "Gold jewellery and diamonds" },
  { title: "Engineering Goods", note: "Machinery, Electrical Equipment, Industrial Products", alt: "Steel gears and bearings" },
  { title: "Food & Agri Products", note: "Spices, Tea, Rice, Processed Foods", alt: "Indian spices, tea and rice" },
  { title: "Automobiles & Auto Components", note: "Vehicles, Components, Spare Parts", alt: "Car assembly line" },
];
const partners: Point[] = [
  { icon: Factory, title: "Manufacturers", note: "Expand your products to the UK market with our support." },
  { icon: Truck, title: "Distributors", note: "Grow your distribution network across the UK and Europe." },
  { icon: Store, title: "Retailers", note: "Partner with us for high-quality Indian products with competitive margins." },
];
const reasons: Point[] = [
  { icon: Globe2, title: "Access to UK & European Markets", note: "Leverage our trade network and local support." },
  { icon: BarChart3, title: "Business Growth", note: "Scalable and long-term opportunities." },
  { icon: ShieldCheck, title: "Trusted Partner", note: "Quality, compliance and reliability." },
  { icon: Handshake, title: "End-to-End Support", note: "From market entry to distribution." },
];
const whyUk: Point[] = [
  { icon: Building2, title: "Strong Economy & High Purchasing Power" },
  { icon: Users, title: "Gateway to European Markets" },
  { icon: FileCheck2, title: "Transparent Trade Regulations" },
  { icon: Ship, title: "World-Class Logistics & Ports" },
  { icon: TrendingUp, title: "Opportunities Across Multiple Sectors" },
];

function Flag({ uk = false }: { uk?: boolean }) {
  if (!uk) return <svg className="uae-flag" viewBox="0 0 60 40" role="img" aria-label="India"><path className="uae-flag-white" d="M0 0h60v40H0z" /><path className="uae-flag-saffron" d="M0 0h60v13.33H0z" /><path className="uae-flag-green" d="M0 26.67h60V40H0z" /><circle cx="30" cy="20" r="5" fill="none" className="uae-flag-wheel" /></svg>;
  return <svg className="uae-flag" viewBox="0 0 60 30" role="img" aria-label="United Kingdom"><path className="uk-flag-blue" d="M0 0h60v30H0z" /><path className="uae-flag-white" d="M0 0l60 30M60 0L0 30" strokeWidth="6" stroke="currentColor" style={{ color: "var(--uae-photo-text)" }} /><path d="M0 0l60 30M60 0L0 30" strokeWidth="2" className="uk-flag-red-stroke" /><path d="M30 0v30M0 15h60" strokeWidth="10" stroke="var(--uae-photo-text)" /><path d="M30 0v30M0 15h60" strokeWidth="6" className="uk-flag-red-stroke" /></svg>;
}
function Enquire({ children }: { children: React.ReactNode }) {
  return <Button asChild size="lg" className="uae-cta"><Link to="/contact">{children}<ArrowRight className="size-4" /></Link></Button>;
}
function TradeList({ inbound = false }: { inbound?: boolean }) {
  return <div className={inbound ? "uae-trade uae-trade-inbound" : "uae-trade"}>
    <h2 className="text-xl uppercase">{inbound ? "UK Imports from India" : "India Exports to UK"}</h2>
    <div className="my-5 flex items-center justify-center gap-5"><Flag /><ArrowRight className="size-7 text-primary" /><Flag uk /></div>
    <ul className="space-y-3">{(inbound ? imports : exports).map(({ icon: Icon, title }) => <li key={title} className="flex items-center gap-3"><span className="uae-trade-icon grid size-8 shrink-0 place-items-center rounded-full"><Icon className="size-4" /></span><span className="text-sm leading-5">{title}</span></li>)}</ul>
  </div>;
}

export function UkMarketPage() {
  return <div className="uae-page text-foreground">
    <section className="relative">
      <h1 className="sr-only">UK — Expanding Global Opportunities, From India to UK</h1>
      <img src={hero.url} alt="UK — From India to UK. Big Ben, London Eye, Westminster and global trade" width={1920} height={720} fetchPriority="high" className="block h-auto w-full" />
      <Button asChild variant="ghost" className="uk-hero-hitarea"><Link to="/contact" aria-label="Partner With Us" /></Button>
      <Button asChild variant="secondary" size="sm" className="uk-back-link"><Link to="/global-presence"><ArrowLeft className="size-4" />Global Presence</Link></Button>
    </section>
    <div className="uk-mobile-enquiry"><Enquire>Partner With Us</Enquire></div>

    <section className="uae-stats py-6"><div className="page-shell grid grid-cols-2 gap-y-6 lg:grid-cols-4">{[
      { icon: Users, value: "68M+", label: "Population · 2023", url: "https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationestimates" },
      { icon: TrendingUp, value: "USD 3.3T+", label: "GDP (Nominal) · 2023", url: "https://data.worldbank.org/country/united-kingdom" },
      { icon: Globe2, value: "6th", label: "Largest Economy in the World", url: "https://www.imf.org/external/datamapper/NGDPD@WEO" },
      { icon: Ship, value: "World-Class", label: "Ports & Trade Connectivity", url: "https://www.gov.uk/government/collections/maritime-and-shipping-statistics" },
    ].map(({ icon: Icon, value, label, url }) => <a key={value} href={url} target="_blank" rel="noreferrer" className="px-4 text-center even:border-l lg:border-l lg:first:border-l-0"><Icon className="mx-auto size-7 text-primary" /><strong className="mt-2 block text-xl text-primary">{value}</strong><span className="mt-1 block text-xs text-muted-foreground">{label}</span></a>)}</div></section>

    <section className="uae-trade-band"><div className="page-shell grid items-stretch gap-6 py-8 lg:grid-cols-[1fr_0.65fr_1fr]">
      <TradeList />
      <div className="flex flex-col items-center justify-center gap-5 py-6 text-center"><div className="flex items-center gap-4"><Flag /><ArrowRight className="size-7 text-primary" /><Flag uk /></div><Globe2 className="size-28 text-primary" strokeWidth={1} /><div className="flex gap-5 text-primary"><Package className="size-9" /><Plane className="size-9" /><Ship className="size-9" /></div><h2 className="text-xl uppercase">Stronger Trade<br />Brighter Tomorrow</h2></div>
      <TradeList inbound />
    </div></section>

    <section className="page-shell py-8"><h2 className="mb-6 text-2xl sm:text-3xl">Our Key Export Products for UK</h2><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">{categories.map(({ title, note, alt }, index) => <article key={title} className="overflow-hidden rounded-lg border border-border bg-card"><div className={`uae-product-photo uae-product-${index + 1}`}><img src={products.url} alt={alt} loading="lazy" width={1920} height={640} /></div><div className="p-3"><h3 className="text-sm">{title}</h3><p className="mt-2 text-xs leading-5 text-muted-foreground">{note}</p></div></article>)}</div></section>

    <section className="grid lg:grid-cols-[1.6fr_1fr]">
      <div className="uae-why relative isolate overflow-hidden px-4 py-10 sm:px-8"><img src={bridge.url} alt="Tower Bridge and London skyline at sunset" loading="lazy" width={1536} height={640} className="absolute inset-0 -z-20 size-full object-cover" /><div className="uae-why-overlay absolute inset-0 -z-10" />
        <h2 className="text-3xl sm:text-4xl">Partner With Us in UK</h2><p className="mt-2 max-w-lg text-sm leading-6">Join Rishishwar Industry Pvt. Ltd. and be part of a trusted global trade network connecting India & UK.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">{partners.map(({ icon: Icon, title, note }) => <div key={title} className="rounded-lg border border-border bg-card p-4 text-card-foreground"><Icon className="size-8 text-primary" /><h3 className="mt-3 text-base">{title}</h3><p className="mt-2 text-xs leading-5 text-muted-foreground">{note}</p></div>)}</div>
      </div>
      <div className="uae-why px-6 py-10"><h2 className="text-2xl">Why Partner With Us?</h2><ul className="mt-5 space-y-4">{reasons.map(({ icon: Icon, title, note }) => <li key={title} className="flex gap-3"><Icon className="mt-0.5 size-7 shrink-0" /><div><h3 className="text-sm">{title}</h3><p className="text-xs opacity-80">{note}</p></div></li>)}</ul><div className="mt-6"><Enquire>Become Our Partner</Enquire></div></div>
    </section>

    <section className="page-shell grid items-center gap-8 py-10 lg:grid-cols-[0.8fr_1.2fr]"><div><h2 className="text-3xl">Why UK?</h2><h3 className="mt-2 text-lg">A Stable, Mature & High-Value Market</h3><p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">The UK offers a business-friendly environment, strong consumer demand, transparent regulations and access to the wider European market, making it an ideal destination for Indian businesses.</p><div className="mt-5"><Enquire>Get in Touch</Enquire></div></div><div className="grid grid-cols-2 gap-y-7 rounded-lg border border-border bg-card py-6 sm:grid-cols-5">{whyUk.map(({ icon: Icon, title }) => <div key={title} className="px-3 text-center sm:border-l sm:first:border-l-0"><Icon className="mx-auto size-8 text-primary" /><h3 className="mt-3 text-xs leading-5">{title}</h3></div>)}</div></section>
  </div>;
}
