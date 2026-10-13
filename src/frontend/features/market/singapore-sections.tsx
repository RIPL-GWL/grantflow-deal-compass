import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Globe2, TrendingUp, Handshake, Ship, SprayCan, Pill, Shirt, Sprout, Cog, FlaskConical, Car, Cpu, BriefcaseBusiness, HeartPulse, ShoppingBag, Package, Users, Layers, Truck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import heroSrc from "@/frontend/assets/singapore-market/hero.webp";
const hero = { url: heroSrc };
import partnerSrc from "@/frontend/assets/singapore-market/partner.webp";
const partner = { url: partnerSrc };
import productsSrcAsset from "@/assets/sg-products.webp.asset.json";
const productsSrc = productsSrcAsset.url;
const products = { url: productsSrc };
import portSrcAsset from "@/assets/sg-port.webp.asset.json";
const portSrc = portSrcAsset.url;
const port = { url: portSrc };

type Point = { icon: LucideIcon; title: string; note?: string };
const highlights: Point[] = [
  { icon: Globe2, title: "Gateway to ASEAN Markets", note: "Strategic location for regional expansion" },
  { icon: TrendingUp, title: "High Purchasing Power", note: "Premium market with growing demand" },
  { icon: Handshake, title: "Strong Trade Relations", note: "Trusted partner in global trade" },
  { icon: Ship, title: "Modern Logistics Infrastructure", note: "World-class connectivity and supply chain" },
];
const fromIndia: Point[] = [
  { icon: SprayCan, title: "FMCG & Household Products", note: "Dishwash, Cleaners, Personal Care" },
  { icon: Pill, title: "Pharmaceuticals & Healthcare Products" },
  { icon: Shirt, title: "Textiles & Garments" },
  { icon: Sprout, title: "Food Products", note: "Spices, Tea, Rice, Processed Foods" },
  { icon: Cog, title: "Engineering Goods & Machinery" },
  { icon: FlaskConical, title: "Chemicals & Plastics" },
  { icon: Car, title: "Auto Components" },
];
const fromSingapore: Point[] = [
  { icon: Cpu, title: "Electronics & Electrical Equipment" },
  { icon: FlaskConical, title: "Petrochemicals & Refined Petroleum Products" },
  { icon: Cog, title: "Advanced Machinery & Technology" },
  { icon: HeartPulse, title: "Medical Devices & Healthcare Products" },
  { icon: BriefcaseBusiness, title: "Financial & Professional Services" },
  { icon: ShoppingBag, title: "High-Quality Consumer Goods" },
  { icon: Package, title: "Processed Food & Beverages" },
];
const categories = [
  { title: "Household Cleaning Products", note: "Dishwash, Floor Cleaners, Surface Cleaners", alt: "Household spray bottles, dishwashing liquid and sponges" },
  { title: "Personal Care Products", note: "Soaps, Handwash, Shampoos, Hygiene Products", alt: "Personal care bottles, handwash and soap" },
  { title: "Food & Agri Products", note: "Spices, Tea, Rice, Pulses, Processed Foods", alt: "Jars of Indian spices, rice, tea and pulses" },
  { title: "Textiles & Garments", note: "Home Textiles, Fabrics, Apparel", alt: "Folded colourful fabrics and textiles" },
  { title: "Engineering Goods", note: "Machinery, Auto Components, Industrial Products", alt: "Precision gears, bearings and auto components" },
];
const strengths: Point[] = [
  { icon: Cog, title: "High Quality Indian Products", note: "Trusted and reliable manufacturing standards" },
  { icon: Layers, title: "Wide Product Portfolio", note: "FMCG to industrial goods and more" },
  { icon: Truck, title: "Strong Supply Chain", note: "Timely and efficient deliveries" },
  { icon: Handshake, title: "Customized Solutions", note: "Tailored to market requirements" },
  { icon: TrendingUp, title: "Long Term Partnerships", note: "Mutual growth and success" },
];

function MarketFlag({ singapore = false }: { singapore?: boolean }) {
  return singapore ? <svg className="sg-flag" viewBox="0 0 60 40" role="img" aria-label="Singapore"><path className="sg-flag-white" d="M0 0h60v40H0z" /><path className="sg-flag-red" d="M0 0h60v20H0z" /><circle className="sg-flag-white" cx="13" cy="10" r="7" /><circle className="sg-flag-red" cx="16" cy="9" r="6" />{[[25,5],[30,9],[28,15],[22,15],[20,9]].map(([x,y]) => <text key={`${x}-${y}`} x={x} y={y} className="sg-flag-star">★</text>)}</svg> : <svg className="sg-flag" viewBox="0 0 60 40" role="img" aria-label="India"><path className="sg-flag-white" d="M0 0h60v40H0z" /><path className="sg-flag-saffron" d="M0 0h60v13.33H0z" /><path className="sg-flag-green" d="M0 26.67h60V40H0z" /><circle cx="30" cy="20" r="5" fill="none" className="sg-flag-wheel" />{Array.from({length:12},(_,i)=><path key={i} d="M30 15v10" transform={`rotate(${i*15} 30 20)`} className="sg-flag-wheel" />)}</svg>;
}

function TradeList({ title, items, reverse = false }: { title: string; items: Point[]; reverse?: boolean }) {
  return <div className={reverse ? "sg-trade sg-trade-inbound" : "sg-trade"}>
    <h2 className="text-lg font-bold uppercase">{title}</h2>
    <div className="my-5 flex items-center justify-center gap-5" aria-label={reverse ? "Singapore to India" : "India to Singapore"}><MarketFlag singapore={reverse} /><ArrowRight className="size-7" /><MarketFlag singapore={!reverse} /></div>
    <ul className="space-y-4">{items.map(({ icon: Icon, title: text, note }) => <li key={text} className="flex items-center gap-3"><span className="sg-trade-icon grid size-9 shrink-0 place-items-center rounded-full"><Icon className="size-5" /></span><span className="text-sm font-medium">{text}{note && <span className="block text-xs font-normal text-muted-foreground">({note})</span>}</span></li>)}</ul>
  </div>;
}

export function SingaporeMarketPage() {
  return <div className="singapore-page text-foreground">
    <section className="relative bg-secondary">
      <h1 className="sr-only">Singapore — From India to Singapore</h1>
      <img src={hero.url} alt="Singapore — Expanding global opportunities. From India to Singapore, with Marina Bay Sands and the Merlion at sunset" width={1365} height={768} fetchPriority="high" className="block h-auto w-full" />
      <Link to="/global-presence" className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded bg-card/95 px-3 py-2 text-sm font-semibold text-foreground"><ArrowLeft className="size-4" /> Global Presence</Link>
    </section>

    <section className="sg-highlight-band py-7 sm:py-9"><div className="page-shell grid grid-cols-2 gap-y-7 lg:grid-cols-4">{highlights.map(({ icon: Icon, title, note }) => <div key={title} className="px-4 text-center even:border-l lg:border-l lg:first:border-l-0"><Icon className="mx-auto size-9" /><h2 className="mx-auto mt-3 max-w-52 text-sm font-bold uppercase sm:text-base">{title}</h2><p className="mx-auto mt-2 max-w-48 text-sm opacity-85">{note}</p></div>)}</div></section>

    <section className="page-shell py-8"><div className="grid items-stretch gap-5 lg:grid-cols-[1fr_0.6fr_1fr]">
      <TradeList title="India Exports to Singapore" items={fromIndia} />
      <div className="flex flex-col items-center justify-center gap-5 py-8 text-center"><div className="flex items-center gap-4"><MarketFlag /><ArrowRight className="size-8 text-primary" /><MarketFlag singapore /></div><Globe2 className="size-24 text-primary" strokeWidth={1} /><Ship className="size-14 text-primary" /><h2 className="max-w-52 text-xl uppercase">Stronger Trade<br />Brighter Tomorrow</h2></div>
      <TradeList title="Singapore Exports to India" items={fromSingapore} reverse />
    </div></section>

    <section className="page-shell pb-10"><h2 className="mb-6 text-2xl sm:text-3xl">Our Key Export Products for Singapore</h2><div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">{categories.map(({ title, note, alt }, index) => <article key={title} className="overflow-hidden rounded-lg border border-border bg-card"><div className={`sg-product-photo sg-product-${index + 1}`}><img src={products.url} alt={alt} width={1920} height={640} loading="lazy" /></div><div className="p-4"><h3 className="text-sm font-bold">{title}</h3><p className="mt-2 text-xs leading-5 text-muted-foreground">{note}</p></div></article>)}</div></section>

    <section className="sg-why relative isolate overflow-hidden bg-secondary py-10 sm:py-14">
      <img src={port.url} alt="Singapore port, container ship and air freight connections" loading="lazy" width={1536} height={864} className="absolute inset-0 -z-20 size-full object-cover object-right" /><div className="sg-why-overlay absolute inset-0 -z-10" />
      <div className="page-shell"><div className="max-w-lg"><h2 className="text-3xl sm:text-4xl">Why Singapore?</h2><h3 className="mt-3 text-xl">A Premium Market with Global Opportunities</h3><p className="mt-4 leading-7 text-muted-foreground">Singapore is one of the world’s most business-friendly markets, offering access to ASEAN and the wider Asia-Pacific region. With strong trade relations, modern infrastructure and high demand for quality Indian products, Singapore presents opportunities for Indian manufacturers.</p><Button asChild size="lg" className="sg-cta mt-5"><Link to="/contact">Explore Trade Opportunities <ArrowRight /></Link></Button></div>
      <div className="mt-10 grid grid-cols-2 gap-6 border border-border bg-card/95 px-5 py-7 lg:grid-cols-4">{[
        { icon: Users, value: "5.9M+", label: "Population · 2023" },
        { icon: TrendingUp, value: "USD 500B+", label: "GDP (Nominal) · 2023" },
        { icon: Globe2, value: "1st in Asia", label: "Doing Business · 2020 ranking" },
        { icon: Ship, value: "World-Class", label: "Port & Logistics Hub" },
      ].map(({ icon: Icon, value, label }) => <div key={value} className="text-center"><Icon className="mx-auto size-8 text-primary" /><strong className="mt-3 block text-xl text-primary">{value}</strong><p className="mt-1 text-xs text-muted-foreground">{label}</p></div>)}</div></div>
    </section>

    <section className="page-shell py-10"><h2 className="mb-6 text-3xl">Our Strengths</h2><div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">{strengths.map(({ icon: Icon, title, note }) => <article key={title} className="rounded-lg border border-border bg-card px-4 py-6 text-center"><Icon className="mx-auto size-9 text-primary" /><h3 className="mt-4 text-base">{title}</h3><p className="mt-3 text-sm leading-5 text-muted-foreground">{note}</p></article>)}</div></section>

    <section className="sg-partner relative isolate flex min-h-80 items-start justify-center overflow-hidden py-10 sm:min-h-96 sm:py-12"><img src={partner.url} alt="Singapore Marina Bay skyline illuminated at night" loading="lazy" width={1920} height={720} className="absolute inset-0 -z-20 size-full object-cover" /><div className="sg-partner-overlay absolute inset-0 -z-10" /><div className="page-shell text-center"><h2 className="text-3xl sm:text-4xl">Partner With Us in Singapore</h2><p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg">Let’s build a cleaner, healthier and more sustainable future together.<br className="hidden sm:block" /> Explore new markets, create value and grow globally.</p><Button asChild size="lg" className="sg-cta mt-6"><Link to="/contact">Get in Touch <ArrowRight /></Link></Button></div></section>
  </div>;
}