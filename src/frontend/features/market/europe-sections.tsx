import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Users, TrendingUp, Globe2, Ship, Shirt, Pill, Cog, Car, FlaskConical, Sprout, Gem, Laptop, Leaf, Factory, Truck, Store, ShieldCheck, Handshake } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import heroSrcAsset from "@/assets/europe-hero.webp.asset.json";
const heroSrc = heroSrcAsset.url;
const hero = { url: heroSrc };
import whyBannerSrcAsset from "@/assets/europe-why.webp.asset.json";
const whyBannerSrc = whyBannerSrcAsset.url;
const whyBanner = { url: whyBannerSrc };
import productsPointerSrcAsset from "@/assets/europe-products.webp.asset.json";
const productsPointerSrc = productsPointerSrcAsset.url;
const productsPointer = { url: productsPointerSrc };
const products = productsPointer.url;
import partnerPhotoPointerSrcAsset from "@/assets/europe-partners.webp.asset.json";
const partnerPhotoPointerSrc = partnerPhotoPointerSrcAsset.url;
const partnerPhotoPointer = { url: partnerPhotoPointerSrc };
const partnerPhoto = partnerPhotoPointer.url;
import tradeMapPointerSrcAsset from "@/assets/europe-trade-map.webp.asset.json";
const tradeMapPointerSrc = tradeMapPointerSrcAsset.url;
const tradeMapPointer = { url: tradeMapPointerSrc };
const tradeMap = tradeMapPointer.url;

type Point = { icon: LucideIcon; title: string; note?: string };
const exports: Point[] = [
  { icon: Shirt, title: "Textiles & Apparel (Garments, Fabrics, Home Textiles)" },
  { icon: Pill, title: "Pharmaceuticals & Healthcare Products" },
  { icon: Cog, title: "Engineering Goods & Machinery" },
  { icon: Car, title: "Automobiles & Auto Components" },
  { icon: FlaskConical, title: "Chemicals & Plastics" },
  { icon: Sprout, title: "Agri & Food Products (Rice, Spices, Tea, Processed Foods)" },
  { icon: Gem, title: "Gems & Jewellery" },
  { icon: Laptop, title: "IT Services & Professional Services" },
];
const imports: Point[] = [
  { icon: Sprout, title: "Processed Food & Organic Products" },
  { icon: Pill, title: "Pharmaceuticals & Medical Devices" },
  { icon: Shirt, title: "Textiles, Apparel & Home Furnishings" },
  { icon: Cog, title: "Machinery & Electrical Equipment" },
  { icon: Car, title: "Automobiles & Auto Components" },
  { icon: FlaskConical, title: "Chemicals & Industrial Products" },
  { icon: Gem, title: "Jewellery, Gems & Precious Stones" },
  { icon: Laptop, title: "IT & Digital Services" },
  { icon: Leaf, title: "Sustainable & Eco-Friendly Products" },
];
const categories = [
  { title: "Textiles & Garments", note: "Fabrics, Apparel, Home Textiles", alt: "Colourful textile fabrics" },
  { title: "Pharmaceuticals", note: "Formulations, Generics, Healthcare Products", alt: "Medicines and healthcare products" },
  { title: "Engineering Goods", note: "Machinery, Electrical Equipment, Industrial Products", alt: "Industrial steel gears and bearings" },
  { title: "Food & Agri Products", note: "Spices, Tea, Rice, Processed Foods", alt: "Indian spices, tea and rice" },
  { title: "Gems & Jewellery", note: "Diamonds, Gold Jewellery, Precious & Semi-Precious Stones", alt: "Diamonds and gold jewellery" },
  { title: "Automobiles & Auto Components", note: "Vehicles, Components, Spare Parts", alt: "Modern car assembly line" },
];
const partners: Point[] = [
  { icon: Factory, title: "Manufacturers", note: "Bring your quality products to the European market with our support." },
  { icon: Truck, title: "Distributors", note: "Expand your distribution network across 27 European countries." },
  { icon: Store, title: "Retailers", note: "Grow your business with high-quality products and competitive margins." },
];
const reasons: Point[] = [
  { icon: Globe2, title: "Access to 27 European Markets", note: "Leverage our trade network and local support." },
  { icon: TrendingUp, title: "Business Growth", note: "Scalable and long-term opportunities." },
  { icon: ShieldCheck, title: "Trusted Partner", note: "Quality, compliance and reliability." },
  { icon: Handshake, title: "End-to-End Support", note: "From market entry to distribution." },
];
function Enquire({ children }: { children: React.ReactNode }) {
  return <Button asChild size="lg" className="uae-cta"><Link to="/contact">{children}<ArrowRight className="size-4" /></Link></Button>;
}
function Flag({ europe = false }: { europe?: boolean }) {
  const clipId = europe ? "europe-circle" : "india-circle";
  return <svg role="img" aria-label={europe ? "European Union" : "India"} className="europe-round-flag" viewBox="0 0 48 48"><defs><clipPath id={clipId}><circle cx="24" cy="24" r="23" /></clipPath></defs><g clipPath={`url(#${clipId})`}>{europe ? <><path className="uk-flag-blue" d="M0 0h48v48H0z" />{Array.from({ length: 12 }, (_, i) => <path key={i} className="europe-flag-star" d="M0-2.7 .8-.9 2.7-.9 1.2.4 1.7 2.4 0 1.2-1.7 2.4-1.2.4-2.7-.9-.8-.9Z" transform={`translate(${24 + 14 * Math.sin(i * Math.PI / 6)} ${24 - 14 * Math.cos(i * Math.PI / 6)})`} />)}</> : <><path className="uae-flag-white" d="M0 0h48v48H0z" /><path className="uae-flag-saffron" d="M0 0h48v16H0z" /><path className="uae-flag-green" d="M0 32h48v16H0z" /><circle cx="24" cy="24" r="6" fill="none" className="uae-flag-wheel" />{Array.from({ length: 24 }, (_, i) => <path key={i} className="uae-flag-wheel" d="M24 24v-6" transform={`rotate(${i * 15} 24 24)`} />)}</>}</g></svg>;
}
function TradeList({ inbound = false }: { inbound?: boolean }) {
  return <div className={inbound ? "uae-trade uae-trade-inbound" : "uae-trade"}>
    <h2 className="text-xl uppercase">{inbound ? "Europe Imports from India" : "India Exports to Europe"}</h2>
    <div className="my-4 flex items-center justify-center gap-5"><Flag /><ArrowRight className="size-7 text-primary" /><Flag europe /></div>
    <ul className="space-y-3">{(inbound ? imports : exports).map(({ icon: Icon, title }) => <li key={title} className="flex items-center gap-3"><span className="europe-trade-icon grid size-8 shrink-0 place-items-center rounded-full"><Icon className="size-4" /></span><span className="text-sm leading-5">{title}</span></li>)}</ul>
  </div>;
}
export function EuropeMarketPage() {
  return <div className="uae-page europe-page text-foreground">
    <section className="relative" aria-label="Europe trade opportunities">
      <h1 className="sr-only">Europe — From India to Europe, Partner With Us</h1>
      <img src={hero.url} alt="Partner With Us in Europe — From India to Europe, European landmarks, EU flag and global shipping" width={1920} height={720} fetchPriority="high" className="block h-auto w-full" />
      <Button asChild variant="ghost" className="europe-banner-hitarea europe-hero-hitarea"><Link to="/contact" aria-label="Become Our Partner in Europe" /></Button>
      <Button asChild variant="secondary" size="sm" className="uk-back-link"><Link to="/global-presence"><ArrowLeft className="size-4" />Global Presence</Link></Button>
    </section>
    <div className="uk-mobile-enquiry"><Enquire>Become Our Partner</Enquire></div>

    <section className="europe-stats page-shell relative"><div className="grid grid-cols-2 gap-y-5 rounded-lg border border-border bg-card py-5 shadow-sm lg:grid-cols-4">{[
      { icon: Users, value: "448M+", label: "Population" },
      { icon: TrendingUp, value: "USD 18.4T+", label: "GDP (Nominal)" },
      { icon: Globe2, value: "27", label: "Member Countries" },
      { icon: Ship, value: "World’s Largest", label: "Single Market" },
    ].map(({ icon: Icon, value, label }) => <div key={value} className="px-3 text-center even:border-l lg:border-l lg:first:border-l-0"><Icon className="mx-auto size-7 text-primary" /><strong className="mt-2 block text-xl text-primary">{value}</strong><span className="mt-1 block text-xs text-muted-foreground">{label}</span></div>)}</div></section>

    <section className="uae-trade-band"><div className="page-shell grid gap-6 py-8 lg:grid-cols-[1fr_0.65fr_1fr]">
      <TradeList />
      <div className="flex flex-col items-center justify-center py-6 text-center"><img src={tradeMap} alt="India to Europe trade connection" width={1024} height={768} loading="lazy" className="w-full max-w-80" /><div className="mt-3 flex w-full justify-around text-base font-bold text-primary"><span>INDIA</span><span>EUROPE</span></div><h2 className="mt-6 text-xl uppercase">Stronger Trade<br />Brighter Tomorrow</h2></div>
      <TradeList inbound />
    </div></section>

    <section className="page-shell pb-8 pt-4"><h2 className="mb-5 text-2xl sm:text-3xl">Our Key Export Products for Europe</h2><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">{categories.map(({ title, note, alt }, index) => <article key={title} className="overflow-hidden rounded-lg border border-border bg-card"><div className={`uae-product-photo uae-product-${index + 1}`}><img src={products} alt={alt} width={1920} height={640} loading="lazy" /></div><div className="p-3"><h3 className="text-sm">{title}</h3><p className="mt-2 text-xs leading-5 text-muted-foreground">{note}</p></div></article>)}</div></section>

    <section className="grid lg:grid-cols-[1.8fr_1fr]">
      <div className="uae-why relative isolate overflow-hidden px-4 py-8 sm:px-8"><img src={partnerPhoto} alt="Indian and European business partners meeting beside European Union flags" width={1536} height={864} loading="lazy" className="absolute inset-0 -z-20 size-full object-cover object-right" /><div className="uae-why-overlay absolute inset-0 -z-10" />
        <h2 className="text-3xl sm:text-4xl">Partner With Us in Europe</h2><p className="mt-2 max-w-lg text-sm leading-6">Join Rishishwar Industry Pvt. Ltd. and become part of a trusted global trade network connecting India and Europe.</p>
        <div className="mt-6 grid max-w-xl gap-3 sm:grid-cols-3">{partners.map(({ icon: Icon, title, note }) => <div key={title} className="rounded-lg border border-border bg-card p-4 text-center text-card-foreground"><Icon className="mx-auto size-8 text-primary" /><h3 className="mt-3 text-sm">{title}</h3><p className="mt-2 text-xs leading-5 text-muted-foreground">{note}</p></div>)}</div>
      </div>
      <div className="uae-why px-6 py-8"><h2 className="text-2xl">Why Partner With Us?</h2><ul className="mt-5 space-y-4">{reasons.map(({ icon: Icon, title, note }) => <li key={title} className="flex gap-3"><Icon className="mt-0.5 size-7 shrink-0" /><div><h3 className="text-sm">{title}</h3><p className="text-xs opacity-80">{note}</p></div></li>)}</ul><div className="mt-6"><Enquire>Become Our Partner</Enquire></div></div>
    </section>

    <section className="relative" aria-label="Why Europe? A high-value and sustainable market">
      <h2 className="sr-only">Why Europe? A High-Value and Sustainable Market</h2>
      <p className="sr-only">Europe offers a stable economy, high purchasing power, transparent trade regulations, sustainability and innovation, and opportunities across multiple sectors.</p>
      <img src={whyBanner.url} alt="Why Europe? A high-value and sustainable market — stable economy, European market access, transparent trade regulations, sustainability and innovation" width={1920} height={720} loading="lazy" className="block h-auto w-full" />
      <Button asChild variant="ghost" className="europe-banner-hitarea europe-why-hitarea"><Link to="/contact" aria-label="Get in Touch about Europe" /></Button>
    </section>
    <div className="uk-mobile-enquiry"><Enquire>Get in Touch</Enquire></div>
  </div>;
}