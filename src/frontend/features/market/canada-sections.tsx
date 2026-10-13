import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, ExternalLink } from "lucide-react";

import { Button } from "@/frontend/components/ui/button";
import {
  canadaCategories,
  canadaHeroImage,
  canadaOpportunityPoints,
  canadaProcess,
  canadaSources,
  canadaSupportHighlights,
} from "./canada-content";

export function CanadaMarketPage() {
  return (
    <>
      <section className="relative isolate min-h-[548px] overflow-hidden bg-ink text-ink-foreground sm:min-h-[588px] lg:min-h-[528px]">
        <img
          src={canadaHeroImage}
          alt="Trade route connecting Canada and India by air and sea"
          className="absolute inset-0 size-full object-cover object-[43%_center] sm:object-center"
          fetchPriority="high"
          width={1600}
          height={912}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--ink)_0%,transparent_34%,var(--ink)_100%)] opacity-80 sm:hidden" />
        <div className="hero-overlay absolute inset-0 hidden sm:block" />
        <div className="page-shell relative flex min-h-[548px] flex-col justify-between py-6 sm:min-h-[588px] sm:py-8 lg:min-h-[528px]">
          <div>
            <Link to="/global-presence" className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-accent-foreground">
              <ArrowLeft className="size-4" /> Global Presence
            </Link>
            <div className="mt-8 max-w-2xl sm:mt-10 lg:mt-8">
              <p className="royal-label">Canada to India · FMCG market entry</p>
              <h1 className="mt-4 text-4xl leading-tight sm:text-5xl lg:text-6xl">
                Bring your Canada FMCG product <span className="text-primary">to India.</span>
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-ink-foreground/80 sm:text-lg sm:leading-8">
                Plan your Indian market entry with practical support for product positioning, import preparation, distributor introductions and retail access.
              </p>
              <div className="mt-5 grid gap-3 sm:flex sm:flex-wrap">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <a href="#canada-opportunity">Explore India opportunity <ArrowRight /></a>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full border-ink-foreground/40 text-ink-foreground sm:w-auto">
                  <Link to="/contact">Talk to our team <ArrowRight /></Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-3 lg:max-w-4xl">
            {canadaSupportHighlights.map(({ icon: Icon, title, note }) => (
              <div key={title} className="flex min-w-0 items-start gap-4 bg-ink/90 p-4 backdrop-blur-md sm:p-5">
                <Icon className="mt-0.5 size-6 shrink-0 text-primary" />
                <div className="min-w-0">
                  <h2 className="text-sm">{title}</h2>
                  <p className="mt-1 text-xs leading-5 text-ink-foreground/60">{note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="canada-opportunity" className="scroll-mt-24 border-y border-border bg-secondary py-14 sm:py-20">
        <div className="page-shell">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="royal-label">Why India</p>
              <h2 className="mt-5 text-3xl sm:text-4xl">A market with varied consumer needs and routes to sale.</h2>
              <p className="mt-5 max-w-xl leading-7 text-muted-foreground">
                India offers Canadian FMCG brands opportunities across everyday, premium and specialist categories. With Canada–India CEPA negotiations relaunched in November 2025, product fit, pricing, labelling and local distribution should be assessed early.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {canadaOpportunityPoints.map(({ icon: Icon, title, note }) => (
                <article key={title} className="border border-border bg-card p-5">
                  <Icon className="size-7 text-primary" />
                  <h3 className="mt-5 text-lg">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{note}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="cinematic-section">
        <div className="page-shell">
          <p className="royal-label">Product categories</p>
          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="max-w-3xl text-3xl sm:text-4xl">Canadian FMCG categories for the Indian market.</h2>
            <p className="max-w-md text-sm leading-6 text-muted-foreground">Final suitability depends on the product, claims, ingredients, packaging and target sales channel.</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {canadaCategories.map((category) => (
              <article key={category.title} className="group overflow-hidden border border-border bg-card">
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img src={category.image} alt={category.alt} loading="lazy" decoding="async" width={720} height={540} className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-5">
                  <h3 className="text-lg">{category.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{category.note}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-ink py-16 text-ink-foreground sm:py-24">
        <div className="page-shell">
          <p className="royal-label">How we support you</p>
          <h2 className="mt-5 max-w-3xl text-3xl sm:text-4xl">From first assessment to a practical market-entry path.</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-0">
            {canadaProcess.map(({ icon: Icon, number, title, note }, index) => (
              <article key={title} className="relative border-t border-border pt-6 lg:border-l lg:border-t-0 lg:px-7 lg:pt-0 first:lg:border-l-0 first:lg:pl-0">
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm font-bold text-primary">{number}</span>
                  <Icon className="size-7 text-primary" />
                </div>
                <h3 className="mt-6 text-xl">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-ink-foreground/65">{note}</p>
                {index < canadaProcess.length - 1 && <ArrowRight className="absolute -right-2 top-1/2 hidden size-4 text-primary lg:block" aria-hidden="true" />}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-ink py-16 text-ink-foreground sm:py-24">
        <img src={canadaHeroImage} alt="" loading="lazy" decoding="async" width={1600} height={912} className="absolute inset-0 size-full object-cover object-center opacity-35" />
        <div className="absolute inset-0 bg-ink/75" />
        <div className="page-shell relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="royal-label">Start the conversation</p>
            <h2 className="mt-5 max-w-3xl text-3xl sm:text-5xl">Let’s bring your Canada FMCG product <span className="text-primary">to India.</span></h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-ink-foreground/70">Share your product category, current market and India goals for a focused first discussion.</p>
          </div>
          <Button asChild size="lg">
            <Link to="/contact">Start market assessment <ArrowRight /></Link>
          </Button>
        </div>
      </section>

      <section className="page-shell py-14 sm:py-20">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="size-6 text-primary" />
          <h2 className="text-2xl sm:text-3xl">Sources and market references</h2>
        </div>
        <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">Import rules and product requirements can change. Review the official sources and confirm current requirements with qualified specialists before shipment.</p>
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {canadaSources.map((source) => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noreferrer" className="flex h-full items-start justify-between gap-4 border border-border bg-card p-5 transition-colors hover:border-primary">
                <span><strong className="block">{source.label}</strong><span className="mt-1 block text-sm text-muted-foreground">{source.year}</span></span>
                <ExternalLink className="size-4 shrink-0 text-primary" />
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
