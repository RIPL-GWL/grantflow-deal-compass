import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Mail } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/frontend/components/site-chrome";
import { Button } from "@/frontend/components/ui/button";
import productionImage from "@/frontend/assets/manufacturer-floor.jpg";
import productsImage from "@/frontend/assets/hero-products.jpg";
import handshakeImage from "@/frontend/assets/cta-handshake.jpg";
import storeAsset from "@/frontend/assets/retailer-store.webp";
import shipAsset from "@/frontend/assets/gp-ship.webp";

import { stats, channels, bring, steps } from "./content";


export function HeroSection() {
  return (
    <>
        <section className="dark-surface relative isolate flex min-h-[650px] items-end overflow-hidden border-b border-border sm:min-h-[700px]">
          <img src={productionImage} alt="Quality check on a bottling line" width={1600} height={900} className="absolute inset-0 -z-20 size-full object-cover object-[62%_center]" />
          <div className="hero-overlay-mobile absolute inset-0 -z-10 md:hidden" />
          <div className="hero-overlay absolute inset-0 -z-10 hidden md:block" />
          <div className="page-shell w-full pb-14 pt-28">
            <p className="royal-label">For FMCG manufacturers</p>
            <h1 className="mt-6 max-w-3xl text-4xl leading-[1.02] sm:text-6xl lg:text-7xl">You make the product. <span className="text-accent-foreground">We get it sold.</span></h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-ink-foreground/80 sm:text-lg">Rishishwar Industry places FMCG brands in retail stores, connects them with distributors, and opens export routes across India and international markets.</p>
            <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
              <Button asChild size="lg" className="h-auto min-h-12 whitespace-normal text-center"><Link to="/partner-with-us" search={{ partner: "manufacturer" }}>Register as a manufacturer <ArrowRight aria-hidden="true" /></Link></Button>
              <Button asChild size="lg" variant="outline" className="h-auto min-h-12 whitespace-normal border-ink-foreground/40 text-ink-foreground"><a href="mailto:sales@rishishwarindustry.in"><Mail aria-hidden="true" /> sales@rishishwarindustry.in</a></Button>
            </div>
            <dl className="mt-10 grid max-w-2xl grid-cols-2 gap-5 border-t border-ink-foreground/20 pt-6 sm:mt-14 sm:grid-cols-3">
              {stats.map((s) => (
                <div key={s.label}><dt className="text-xs uppercase tracking-[0.2em] text-ink-foreground/60">{s.label}</dt><dd className="mt-1 font-display text-3xl font-bold sm:text-4xl">{s.value}</dd></div>
              ))}
            </dl>
          </div>
        </section>
    </>
  );
}

export function ChannelsSection() {
  return (
    <>
        <section className="cinematic-section">
          <div className="page-shell">
            <p className="royal-label">What we do for you</p>
            <h2 className="mt-6 max-w-2xl text-4xl sm:text-5xl">Three ways your product reaches more buyers.</h2>
            <div className="mt-10 space-y-12 sm:mt-14 sm:space-y-20">
              {channels.map((c, i) => (
                <article key={c.title} className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-16 ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
                  <img src={c.image} alt="" loading="lazy" className="aspect-[16/10] w-full border border-border object-cover" />
                  <div>
                    <h3 className="text-2xl sm:text-3xl">{c.title}</h3>
                    <p className="mt-4 max-w-lg leading-8 text-muted-foreground">{c.body}</p>
                    <Link to={c.to} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">Learn more <ArrowRight className="size-4" aria-hidden="true" /></Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
    </>
  );
}

export function HowItWorksSection() {
  return (
    <>
        <section className="cinematic-section border-y border-border bg-secondary">
          <div className="page-shell grid gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="royal-label">How it works</p>
              <h2 className="mt-6 text-4xl sm:text-5xl">From first call to first reorder.</h2>
              <ol className="mt-10 space-y-8">
                {steps.map((s, i) => (
                  <li key={s.title} className="flex gap-5">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-primary font-display text-sm font-bold text-primary">{i + 1}</span>
                    <div><h3 className="text-lg">{s.title}</h3><p className="mt-1 leading-7 text-muted-foreground">{s.body}</p></div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="border border-border bg-background p-5 sm:p-10">
              <h3 className="text-xl">Keep these ready for the first call</h3>
              <ul className="mt-6 space-y-4">
                {bring.map((b) => (
                  <li key={b} className="flex gap-3 text-muted-foreground"><Check className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />{b}</li>
                ))}
              </ul>
              <p className="mt-8 border-t border-border pt-6 text-sm leading-6 text-muted-foreground">Don't have everything yet? That's fine — write to us anyway and we'll work it out together.</p>
            </div>
          </div>
        </section>
    </>
  );
}

export function CtaSection() {
  return (
    <>
        <section className="dark-surface relative isolate overflow-hidden bg-ink py-24 text-ink-foreground sm:py-32">
          <img src={handshakeImage} alt="" loading="lazy" className="absolute inset-0 -z-20 size-full object-cover" />
          <div className="hero-overlay absolute inset-0 -z-10" />
          <div className="page-shell"><div className="max-w-3xl">
            <h2 className="text-4xl sm:text-6xl">Tell us what you make.</h2>
            <p className="mt-6 max-w-xl leading-8 text-ink-foreground/80">Fill in a short form and our team will get back to you.</p>
            <Button asChild size="lg" className="mt-9"><Link to="/partner-with-us" search={{ partner: "manufacturer" }}>Manufacturer registration <ArrowRight aria-hidden="true" /></Link></Button>
          </div></div>
        </section>
    </>
  );
}
