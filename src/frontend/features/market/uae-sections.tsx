import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Users, TrendingUp, Globe2, Ship, Gem, Fuel, Shirt, Cog, Pill, Sprout, Car, Armchair, FlaskConical, ShoppingBag, MapPin, FileCheck2, Handshake, Network, Package, Plane } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import heroSrc from "@/frontend/assets/uae-market/hero.webp";
const hero = { url: heroSrc };
import productsSrcAsset from "@/assets/uae-products.webp.asset.json";
const productsSrc = productsSrcAsset.url;
const products = { url: productsSrc };
import portSrcAsset from "@/assets/uae-port.webp.asset.json";
const portSrc = portSrcAsset.url;
const port = { url: portSrc };

type Point = { icon: LucideIcon; title: string };
const exports: Point[] = [
  { icon: Gem, title: "Gems & Jewellery" },
  { icon: Fuel, title: "Petroleum Products" },
  { icon: Shirt, title: "Textiles & Garments" },
  { icon: Cog, title: "Engineering Goods & Machinery" },
  { icon: Pill, title: "Pharmaceuticals & Healthcare Products" },
  { icon: Sprout, title: "Food Products (Rice, Spices, Processed Foods)" },
  { icon: Car, title: "Automobiles & Auto Components" },
  { icon: Armchair, title: "Furniture & Home Décor" },
];
const imports: Point[] = [
  { icon: Sprout, title: "Food & Agricultural Products" },
  { icon: Shirt, title: "Textiles, Apparels & Home Textiles" },
  { icon: Cog, title: "Machinery & Electrical Equipment" },
  { icon: Gem, title: "Gems, Diamonds & Precious Stones" },
  { icon: FlaskConical, title: "Chemicals & Plastics" },
  { icon: Pill, title: "Pharmaceuticals & Medical Devices" },
  { icon: Car, title: "Automobile & Auto Components" },
  { icon: ShoppingBag, title: "Consumer Goods & Lifestyle Products" },
];
const categories = [
  { title: "Food & Agri Products", note: "Spices, Rice, Tea, Processed Foods, Fruits & Vegetables", alt: "Indian spices, rice and pulses" },
  { title: "Textiles & Garments", note: "Fabrics, Home Textiles, Apparel, Made-ups", alt: "Colourful Indian fabrics and textiles" },
  { title: "Gems & Jewellery", note: "Diamonds, Gold Jewellery, Precious & Semi-Precious Stones", alt: "Gold jewellery, diamonds and gemstones" },
  { title: "Engineering Goods", note: "Machinery, Auto Components, Industrial Equipment", alt: "Steel gears, bearings and engineering components" },
  { title: "Pharmaceuticals", note: "Formulations, Bulk Drugs, Healthcare Products", alt: "Medicine bottles and tablet blister packs" },
  { title: "Consumer Goods", note: "Furniture, Home Décor, Lifestyle & Gift Products", alt: "Brass lantern, vase and home decor products" },
];
const advantages: Point[] = [
  { icon: MapPin, title: "Strategic Location" },
  { icon: Globe2, title: "Access to Global Markets" },
  { icon: FileCheck2, title: "Business-Friendly Regulations" },
  { icon: Ship, title: "Advanced Logistics Infrastructure" },
];
const support: Point[] = [
  { icon: Handshake, title: "Market Entry Support" },
  { icon: Globe2, title: "Business Networking" },
  { icon: FileCheck2, title: "Regulatory Guidance" },
  { icon: Network, title: "Distribution Partnerships" },
];

function Flag({ uae = false }: { uae?: boolean }) {
  return <svg className="uae-flag" viewBox="0 0 60 40" role="img" aria-label={uae ? "United Arab Emirates" : "India"}>
    <path className="uae-flag-white" d="M0 0h60v40H0z" />
    {uae ? <><path className="uae-flag-green" d="M15 0h45v13.33H15z" /><path className="uae-flag-black" d="M15 26.67h45V40H15z" /><path className="uae-flag-red" d="M0 0h15v40H0z" /></> : <><path className="uae-flag-saffron" d="M0 0h60v13.33H0z" /><path className="uae-flag-green" d="M0 26.67h60V40H0z" /><circle cx="30" cy="20" r="5" fill="none" className="uae-flag-wheel" />{Array.from({ length: 12 }, (_, i) => <path key={i} d="M30 15v10" transform={`rotate(${i * 15} 30 20)`} className="uae-flag-wheel" />)}</>}
  </svg>;
}
function Enquire({ children, yellow = false }: { children: React.ReactNode; yellow?: boolean }) {
  return <Button asChild size="lg" className={yellow ? "uae-cta uae-cta-yellow" : "uae-cta"}><Link to="/contact">{children}<ArrowRight className="size-4" /></Link></Button>;
}
function TradeList({ inbound = false }: { inbound?: boolean }) {
  return <div className={inbound ? "uae-trade uae-trade-inbound" : "uae-trade"}>
    <h2 className="text-xl uppercase">{inbound ? "UAE Imports from India" : "India Exports to UAE"}</h2>
    <div className="my-5 flex items-center justify-center gap-5"><Flag /><ArrowRight className="size-7 text-primary" /><Flag uae /></div>
    <ul className="space-y-3">{(inbound ? imports : exports).map(({ icon: Icon, title }) => <li key={title} className="flex items-center gap-3"><span className="uae-trade-icon grid size-8 shrink-0 place-items-center rounded-full"><Icon className="size-4" /></span><span className="text-sm leading-5">{title}</span></li>)}</ul>
  </div>;
}

export function UaeMarketPage() {
  return <div className="uae-page text-foreground">
    <section className="relative">
      <h1 className="sr-only">UAE — Expanding Global Opportunities, From India to UAE</h1>
      <img src={hero.url} alt="UAE — From India to UAE. Dubai skyline, Burj Khalifa, Museum of the Future and global trade connections" width={1365} height={768} fetchPriority="high" className="block h-auto w-full" />
      <div className="uae-hero-enquiry absolute"><Enquire>Explore Trade Opportunities</Enquire></div>
      <Link to="/global-presence" className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded bg-card/95 px-3 py-2 text-xs font-semibold text-foreground"><ArrowLeft className="size-4" />Global Presence</Link>
    </section>

    <section className="uae-stats py-6"><div className="page-shell grid grid-cols-2 gap-y-6 lg:grid-cols-4">{[
      { icon: Users, value: "11.29M", label: "Population · 2024", url: "https://fcsc.gov.ae/" },
      { icon: TrendingUp, value: "USD 504B+", label: "GDP (Nominal) · 2023", url: "https://fred.stlouisfed.org/series/MKTGDPAEA646NWDB" },
      { icon: Globe2, value: "1st in MENA", label: "IMD Competitiveness · 2024", url: "https://fcsc.gov.ae/en-us/Pages/Press-Release/18-06-2024.aspx" },
      { icon: Ship, value: "World-Class", label: "Ports & Free Zones", url: "https://u.ae/en/information-and-services/business/starting-a-business-in-a-free-zone" },
    ].map(({ icon: Icon, value, label, url }) => <a key={value} href={url} target="_blank" rel="noreferrer" className="px-4 text-center even:border-l lg:border-l lg:first:border-l-0"><Icon className="mx-auto size-7 text-primary" /><strong className="mt-2 block text-xl text-primary">{value}</strong><span className="mt-1 block text-xs text-muted-foreground">{label}</span></a>)}</div></section>

    <section className="uae-trade-band"><div className="page-shell grid items-stretch gap-6 py-8 lg:grid-cols-[1fr_0.65fr_1fr]">
      <TradeList />
      <div className="flex flex-col items-center justify-center gap-5 py-6 text-center"><div className="flex items-center gap-4"><Flag /><ArrowRight className="size-7 text-primary" /><Flag uae /></div><Globe2 className="size-28 text-primary" strokeWidth={1} /><div className="flex gap-5 text-primary"><Package className="size-9" /><Plane className="size-9" /><Ship className="size-9" /></div><h2 className="text-xl uppercase">Stronger Trade<br />Brighter Tomorrow</h2></div>
      <TradeList inbound />
    </div></section>

    <section className="page-shell py-8"><h2 className="mb-6 text-2xl sm:text-3xl">Our Key Export Products for UAE</h2><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">{categories.map(({ title, note, alt }, index) => <article key={title} className="overflow-hidden rounded-lg border border-border bg-card"><div className={`uae-product-photo uae-product-${index + 1}`}><img src={products.url} alt={alt} loading="lazy" width={1920} height={640} /></div><div className="p-3"><h3 className="text-sm">{title}</h3><p className="mt-2 text-xs leading-5 text-muted-foreground">{note}</p></div></article>)}</div></section>

    <section className="uae-why relative isolate overflow-hidden py-10 sm:py-12"><img src={port.url} alt="Dubai skyline, global shipping and air freight connections" loading="lazy" width={1536} height={640} className="absolute inset-0 -z-20 size-full object-cover" /><div className="uae-why-overlay absolute inset-0 -z-10" /><div className="page-shell grid items-center gap-8 lg:grid-cols-[0.85fr_1.15fr]"><div><h2 className="text-3xl sm:text-4xl">Why UAE?</h2><h3 className="mt-2 text-lg">A Global Trade & Investment Destination</h3><p className="mt-4 max-w-lg text-sm leading-6">The UAE offers world-class infrastructure, business-friendly policies, strategic location and access to markets across the Middle East, Africa and Europe, making it a key destination for Indian businesses.</p><div className="mt-5"><Enquire yellow>Partner With Us</Enquire></div></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{advantages.map(({ icon: Icon, title }) => <div key={title} className="uae-advantage rounded-lg border px-3 py-6 text-center"><Icon className="mx-auto size-8" /><h3 className="mt-4 text-sm leading-5">{title}</h3></div>)}</div></div></section>

    <section className="page-shell grid items-center gap-8 py-10 lg:grid-cols-[0.85fr_1.15fr]"><div><h2 className="text-2xl sm:text-3xl">Let’s Grow Together in UAE</h2><p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">Partner with us to explore new markets, build strong trade connections and take your business global.</p><div className="mt-5"><Enquire>Get In Touch</Enquire></div></div><div className="grid grid-cols-2 gap-y-7 rounded-lg border border-border bg-card py-6 sm:grid-cols-4">{support.map(({ icon: Icon, title }) => <div key={title} className="px-4 text-center even:border-l sm:border-l sm:first:border-l-0"><Icon className="mx-auto size-8 text-primary" /><h3 className="mt-4 text-sm leading-5">{title}</h3></div>)}</div></section>
  </div>;
}