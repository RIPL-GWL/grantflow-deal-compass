import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Target,
  Eye,
  ArrowRight,
  Store,
  MapPin,
  Users,
  Globe,
  Truck,
  ShieldCheck,
  Star,
  Handshake,
} from "lucide-react";
import { SiteHeader, SiteFooter } from "@/frontend/components/site-chrome";
import aboutHero from "@/frontend/assets/about-hero.jpg";
import officeImage from "@/frontend/assets/about-office.jpg";
import handshakeImage from "@/frontend/assets/cta-handshake.jpg";

import { stats, services, trustPoints, countries, purpose, marketProblems, solveProblem, solveAnswer } from "./content";
import { districtFigure, totalStoreFigure } from "@/frontend/data/retail-network";

export function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-ink text-ink-foreground">
      <img
        src={aboutHero}
        alt="Rishishwar Industry team member carrying products through a distribution warehouse"
        width={1600}
        height={768}
        className="absolute inset-0 size-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/20" />
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-32">
        <div className="max-w-xl">
            <p className="royal-label">
            About Rishishwar Industry
          </p>
            <h1 className="mt-6 text-4xl leading-[1.02] sm:text-6xl lg:text-7xl">
            Driven by Markets.
             <span className="block text-accent-foreground">Built for Manufacturers.</span>
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-ink-foreground/80 sm:text-lg">
            We help FMCG manufacturers grow beyond factory walls by creating
            strong retail networks, distributor partnerships and global market
            opportunities.
          </p>
          <p className="mt-8 font-display text-2xl font-bold italic">
            Growing
            <span className="block text-primary underline decoration-primary decoration-2 underline-offset-8">
              Brands Together
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

export function MissionVision() {
  return (
    <section aria-labelledby="purpose-title" className="border-y border-border bg-secondary/40 py-10 md:py-16">
      <div className="page-shell">
        <p className="royal-label">Our Purpose</p>
        <div className="mt-4 grid gap-4 lg:grid-cols-2 lg:items-end lg:gap-12">
          <h2 id="purpose-title" className="text-2xl sm:text-4xl">Why we exist and <span className="text-primary">where we are going.</span></h2>
          <p className="max-w-xl text-base leading-6 text-muted-foreground">Our mission guides the work we do every day. Our vision is the future we are building for FMCG manufacturers.</p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {purpose.map(({ icon: Icon, title, text, points }, index) => (
            <article key={title} className="card-lift flex flex-col rounded-sm border border-border bg-card p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <span className="flex size-11 items-center justify-center rounded-full bg-primary/10"><Icon className="size-6 text-primary" strokeWidth={1.5} /></span>
                <span className="font-display text-3xl text-primary/20">0{index + 1}</span>
              </div>
              <h3 className="mt-5 text-2xl sm:text-3xl">{title}</h3>
              <div className="orange-rule mt-3" />
              <p className="mt-4 text-base leading-6">{text}</p>
              <ul className="mt-5 space-y-2 border-t border-border pt-4">
                {points.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-sm leading-6 text-muted-foreground"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />{p}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhatWeDoAndSolve() {
  return (
    <section aria-labelledby="what-we-solve-title" className="cinematic-section">
      <div className="page-shell">
        <p className="royal-label">What we do &amp; why it matters</p>
        <h2 id="what-we-solve-title" className="mt-6 max-w-4xl text-3xl sm:text-5xl">We turn good FMCG products into <span className="text-primary">products people can actually buy.</span></h2>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <article className="rounded-sm border border-border bg-card p-8 sm:p-10">
            <p className="text-xs font-semibold tracking-[0.2em] text-destructive">THE MARKET PROBLEM</p>
            <h3 className="mt-4 text-2xl">Great products stay stuck at the factory.</h3>
            <ul className="mt-6 space-y-4">
              {solveProblem.map((p) => <li key={p} className="flex gap-3 leading-7 text-muted-foreground"><span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-destructive" aria-hidden />{p}</li>)}
            </ul>
          </article>
          <article className="rounded-sm border border-primary bg-ink p-8 text-ink-foreground sm:p-10">
            <p className="text-xs font-semibold tracking-[0.2em] text-primary">WHAT WE DO</p>
            <h3 className="mt-4 text-2xl">One partner from factory to shelf.</h3>
            <ul className="mt-6 space-y-4">
              {solveAnswer.map((p) => <li key={p} className="flex gap-3 leading-7 text-ink-foreground/80"><span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />{p}</li>)}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}

export function MarketChallenges() {
  return <section className="cinematic-section bg-secondary/30" aria-labelledby="market-challenges-title"><div className="page-shell">
    <p className="royal-label">The gap we bridge</p>
    <div className="mt-6 grid gap-6 lg:grid-cols-2 lg:gap-16"><h2 id="market-challenges-title" className="text-3xl sm:text-5xl">From making a product<br/><span className="text-primary">to reaching its market.</span></h2><p className="max-w-xl text-lg leading-8 text-muted-foreground">Rishishwar Industry helps FMCG brands connect production with retail, distribution and new markets. We address the access and planning gaps that keep good products from reaching the right customers.</p></div>
    <div className="mt-12 divide-y divide-border">{marketProblems.map(({problem, detail, response, icon: Icon}, i) => <div key={problem} className="grid gap-5 py-8 md:grid-cols-[48px_1fr_1fr] md:gap-8"><Icon className="size-8 text-primary" strokeWidth={1.5}/><div><p className="text-xs text-primary">0{i+1} / MARKET CHALLENGE</p><h3 className="mt-2 text-xl">{problem}</h3><p className="mt-3 leading-7 text-muted-foreground">{detail}</p></div><div><p className="text-xs font-semibold text-primary">OUR ROLE</p><p className="mt-3 leading-7">{response}</p></div></div>)}</div>
  </div></section>;
}

export function Story() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Our Story
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl">
            From Local Markets
            <span className="block text-primary">to Global Opportunities</span>
          </h2>
          <p className="mt-5 leading-relaxed text-muted-foreground">
            Rishishwar Industry was founded with a clear purpose — to bridge
            the gap between great FMCG products and real markets. We
            understood that many good products fail to reach customers due to
            lack of market access, distribution and retail networks.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            So, we built a solution — a strong, reliable and growing network
            that helps manufacturers take their brands from production to
            people.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Today, with {totalStoreFigure} retail stores across {districtFigure} districts in India and
            presence in 9 international markets, we continue to create new
            growth opportunities for FMCG brands.
          </p>
          <Link
            to="/contact"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Our Journey <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="relative">
          <img
            src={officeImage}
            alt="Rishishwar Industry office — where partnerships begin"
            loading="lazy"
            width={1200}
            height={912}
            className="w-full rounded-sm object-cover shadow-xl"
          />
          <div className="absolute right-3 top-3 max-w-[85%] rounded-sm border border-border bg-ink/90 px-5 py-4 text-ink-foreground backdrop-blur sm:right-5 sm:top-5">
            <p className="font-display text-lg font-bold italic leading-snug">
              People. Partnerships.
              <span className="block text-primary">Possibilities. Progress.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function StatsBar() {
  return (
    <section className="px-4 pb-16 sm:px-6">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 rounded-sm border border-border bg-ink px-4 py-8 text-ink-foreground sm:gap-8 sm:px-8 sm:py-12 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col items-center text-center">
            <span className="flex size-14 items-center justify-center rounded-full border-2 border-primary">
              <s.icon className="size-6 text-primary" strokeWidth={1.8} />
            </span>
            <p className="mt-3 font-display text-lg font-bold leading-tight">
              {s.value}
            </p>
            <p className="text-sm text-ink-foreground/70">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function WhatWeDo() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
        What We Do
      </p>
      <h2 className="mx-auto mt-3 max-w-3xl text-center text-3xl sm:text-4xl">
        We Create Market Access for{" "}
        <span className="text-primary">FMCG Manufacturers</span>
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-muted-foreground">
        Our focus is simple — to help good products reach more people, more
        markets and create bigger opportunities.
      </p>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((s) => (
          <article
            key={s.title}
            className="card-lift rounded-sm border bg-card p-7 text-center"
          >
            <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10">
              <s.icon className="size-8 text-primary" strokeWidth={1.8} />
            </span>
            <h3 className="mt-5 text-base leading-snug">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {s.text}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function WhyUs() {
  return (
    <section className="grid lg:grid-cols-2">
      <div className="bg-ink px-6 py-16 text-ink-foreground sm:px-12 lg:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
          Why Choose Us
        </p>
        <h2 className="mt-3 text-3xl sm:text-4xl">
          A Partner <span className="text-primary">You Can Trust</span>
        </h2>
        <ul className="mt-10 space-y-6">
          {trustPoints.map((t) => (
            <li key={t.title} className="flex items-start gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-primary/60">
                <t.icon className="size-5 text-primary" strokeWidth={1.8} />
              </span>
              <div>
                <h3 className="text-base font-semibold">{t.title}</h3>
                <p className="mt-1 text-sm text-ink-foreground/70">{t.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="dark-surface relative min-h-72">
        <img
          src={handshakeImage}
          alt="Business handshake — your growth, our commitment"
          loading="lazy"
          width={1344}
          height={768}
          className="absolute inset-0 size-full object-cover"
        />
        <p className="absolute bottom-5 right-5 max-w-[80%] font-display text-2xl font-medium italic text-ink-foreground drop-shadow-md sm:bottom-6 sm:right-8">
          Your Growth.
          <span className="block underline decoration-primary decoration-4 underline-offset-4">
            Our Commitment.
          </span>
        </p>
      </div>
    </section>
  );
}

export function GlobalMindset() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="dotted-map relative overflow-hidden rounded-sm border p-8">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-4">
            {countries.map((c) => (
              <li key={c} className="flex items-center gap-3 text-sm font-medium">
                <span className="size-2 rounded-full bg-primary" aria-hidden />
                {c}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Our Global Mindset
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl">
            Indian Brands. <span className="text-primary">Global Reach.</span>
          </h2>
          <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">
            We proudly serve clients in 8 countries, helping FMCG
            manufacturers expand beyond borders with reliable market access
            and long-term partnerships.
          </p>
          <Link
            to="/global-presence"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            View Global Presence <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function GrowCta() {
  return (
    <section className="px-4 pb-20 sm:px-6">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-sm border border-border bg-ink text-ink-foreground">
        <img
          src={aboutHero}
          alt=""
          loading="lazy"
          width={1600}
          height={768}
          className="absolute inset-0 size-full object-cover opacity-40"
        />
        <div className="relative flex flex-col items-start gap-6 px-8 py-16 sm:px-14 md:flex-row md:items-center md:justify-between">
          <div className="max-w-lg">
            <h2 className="text-3xl sm:text-4xl">Let's Grow Together</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-foreground/80">
              Partner with Rishishwar Industry and take your FMCG brand to
              more markets, more customers and a bigger tomorrow.
            </p>
          </div>
          <div className="flex flex-col items-start gap-4 md:items-end">
            <p className="font-display text-xl font-bold italic">
              Bigger Markets.
              <span className="block text-primary">Brighter Tomorrows.</span>
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Get in Touch <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

