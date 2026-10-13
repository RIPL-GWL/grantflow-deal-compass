import { Link } from "@tanstack/react-router";
import { ArrowRight, Factory, Globe, Handshake, MapPin, Store, Truck, Users } from "lucide-react";
import heroBgAsset from "@/frontend/assets/hero-bg.webp";
import handshakeImage from "@/frontend/assets/cta-handshake.jpg";
import { Button } from "@/frontend/components/ui/button";
import { storeFigure } from "@/frontend/data/retail-network";

import { services, steps } from "./content";

export function HeroSection({ storeCount, districtCount }: { storeCount: number; districtCount: number }) {
  return (
    <section className="dark-surface relative overflow-hidden border-b border-border sm:h-[calc(100svh-272px)] sm:min-h-[568px] sm:max-h-[830px]">
      <img src={heroBgAsset} alt="Rishishwar Industry representative inside an FMCG retail store" className="absolute inset-0 size-full object-cover object-[62%_center]" />
      <div className="hero-overlay-mobile absolute inset-0 md:hidden" /><div className="hero-overlay absolute inset-0 hidden md:block" />
      <div className="page-shell relative flex h-full flex-col justify-center py-14 sm:items-start sm:py-20">
        <div className="max-w-3xl lg:max-w-4xl">
          <p className="royal-label">From Manufacturer to Market</p>
          <h1 className="mt-5 text-4xl leading-[1.06] sm:mt-7 sm:text-5xl lg:text-6xl"><span className="block">We Build Markets.</span><span className="mt-2 block text-accent-foreground">You Grow Your Sales.</span></h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-ink-foreground/65 sm:mt-7 sm:text-lg">Rishishwar Industry connects FMCG manufacturers with retail networks, distributors and international opportunities.</p>
          <div className="mt-8 grid gap-3 sm:mt-9 sm:flex sm:flex-wrap sm:gap-4"><Button asChild size="lg" className="w-full sm:w-auto"><Link to="/manufacturers">For Manufacturers <ArrowRight /></Link></Button><Button asChild size="lg" variant="outline" className="w-full border-ink-foreground/30 text-ink-foreground sm:w-auto"><Link to="/our-services">Explore Services</Link></Button></div>
        </div>
        <dl className="mt-10 grid grid-cols-2 border border-border bg-ink/75 backdrop-blur-md sm:absolute sm:bottom-8 sm:right-6 sm:mt-0 sm:w-[520px] sm:grid-cols-4 lg:right-8">
          {[[storeFigure(storeCount),"Retail Stores"],[String(districtCount),"Districts Covered"],["9","Countries"],["End-to-End","Support"]].map(([v,l]) => <div key={l} className="border-r border-border p-4 last:border-r-0"><dt className="font-display text-xl text-accent-foreground">{v}</dt><dd className="mt-1 text-xs uppercase tracking-wider text-ink-foreground/50">{l}</dd></div>)}
        </dl>
      </div>
    </section>
  );
}

export function CapabilitiesSection() {
  return (
    <section className="cinematic-section bg-foreground text-primary-foreground"><div className="page-shell">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end"><div><p className="royal-label">Strategic Capabilities</p><h2 className="market-access-heading mt-6 max-w-3xl text-4xl sm:text-6xl">Complete market access<br/>for ambitious FMCG brands.</h2></div><p className="max-w-lg border-l border-primary pl-6 leading-7 opacity-65">From the first market plan to shelf placement and global reach, every service follows one clear growth route.</p></div>
      <div className="mt-16 grid border-l border-t border-primary-foreground/15 md:grid-cols-5">{services.map(({icon:Icon,title,text,to},i)=><Link key={title} to={to} className="group flex min-w-0 flex-col border-b border-r border-primary-foreground/15 p-6 transition-colors hover:bg-primary hover:text-primary-foreground md:p-4 lg:p-6 xl:p-8"><span className="text-xs text-primary group-hover:text-primary-foreground/70">0{i+1}</span><Icon className="mt-10 size-8 text-primary group-hover:text-primary-foreground"/><h3 className="mt-6 text-xl md:text-base lg:text-xl">{title}</h3><p className="mt-3 text-sm leading-6 opacity-60">{text}</p><span className="mt-auto pt-8"><ArrowRight className="size-5 transition-transform group-hover:translate-x-2"/></span></Link>)}</div>
    </div></section>
  );
}

export function ProcessSection() {
  return (
    <section className="cinematic-section"><div className="page-shell"><div className="text-center"><p className="royal-label justify-center">The Rishishwar Industry Standard</p><h2 className="mx-auto mt-6 max-w-3xl text-4xl sm:text-6xl">A disciplined route from factory to market.</h2></div><ol className="mt-16">{steps.map(({icon:Icon,title,text},i)=><li key={title} className="group grid gap-5 border-t border-border py-9 sm:grid-cols-[100px_1fr_1fr] sm:items-center"><span className="font-display text-5xl text-primary/25 transition-colors group-hover:text-primary">0{i+1}</span><div className="flex items-center gap-4"><Icon className="size-7 text-primary"/><h3 className="text-2xl">{title}</h3></div><p className="leading-7 text-muted-foreground">{text}</p></li>)}</ol></div></section>
  );
}

export function CtaSection() {
  return (
    <section className="dark-surface relative min-h-[520px] overflow-hidden"><img src={handshakeImage} alt="Long-term business partnership" className="absolute inset-0 size-full object-cover"/><div className="absolute inset-0 bg-ink/75"/><div className="page-shell relative flex min-h-[520px] items-center"><div className="max-w-2xl"><p className="royal-label">Built For Long-Term Growth</p><h2 className="mt-6 text-4xl sm:text-6xl">Your Growth.<span className="block text-accent-foreground">Our Commitment.</span></h2><p className="mt-6 max-w-lg text-lg leading-8 text-ink-foreground/65">Manufacturer, retailer or growth partner — let's build a stronger route to market together.</p><Button asChild size="lg" className="mt-9"><Link to="/partner-with-us">Partner With Us <ArrowRight /></Link></Button></div></div></section>
  );
}
