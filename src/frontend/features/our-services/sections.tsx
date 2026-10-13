import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Store,
  Users,
  Truck,
  Globe,
  HandCoins,
  Handshake,
  CheckCircle2,
  MapPin,
  Search,
  ClipboardCheck,
  Rocket,
  LineChart,
  ShieldCheck,
  PackageCheck,
  Boxes,
  FileText,
  Landmark,
  type LucideIcon,
} from "lucide-react";
import { SiteHeader, SiteFooter } from "@/frontend/components/site-chrome";
import { Button } from "@/frontend/components/ui/button";
import servicesHero from "@/frontend/assets/services-hero.jpg";

import { Service, services, howWeWork, stats, whoWeServe } from "./content";
import { totalStoreFigure } from "@/frontend/data/retail-network";
import { mergeById, useSiteContent } from "@/lib/site-content";


export function HeroSection() {
  return (
    <>
        <section className="relative overflow-hidden border-b border-border bg-ink text-ink-foreground">
          <img src={servicesHero} alt="FMCG distribution warehouse with stacked shelves of packaged products" className="absolute inset-0 size-full object-cover opacity-50" width={1792} height={1024} />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/30" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
             <h1 className="text-4xl leading-tight sm:text-7xl">
               Our <span className="text-accent-foreground">Services</span>
            </h1>
            <p className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm font-bold uppercase tracking-wide text-primary-foreground">
              From Factory Gate To Global Shelf
            </p>
            <p className="mt-5 max-w-2xl font-display text-2xl font-bold">
              Everything your brand needs to reach real markets — in India and abroad.
            </p>
            <p className="mt-3 max-w-xl text-ink-foreground/75">
              Rishishwar Industry is a business management company for FMCG manufacturers. Each service below is a complete, working route from your production floor to a customer's hands.
            </p>
             <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap sm:gap-4">
               <Button asChild size="lg" className="h-12">
                <a href="#services">Explore Our Services <ArrowRight aria-hidden="true" /></a>
              </Button>
               <Button asChild size="lg" variant="outline" className="h-12 border-ink-foreground/30 bg-transparent text-ink-foreground hover:bg-ink-foreground/10 hover:text-ink-foreground">
                <Link to="/contact">Talk To Our Team</Link>
              </Button>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {stats.map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex flex-col gap-1.5 border-l-2 border-primary/60 pl-4">
                  <Icon className="size-6 text-primary" aria-hidden="true" />
                  <span className="font-display text-2xl font-bold">{value}</span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-ink-foreground/70">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
    </>
  );
}

export function ServicesDetailSection() {
  const edits = useSiteContent("services");
  const list = mergeById(services, edits, (x) => x.id, (e) => e.id);
  return (
    <>
        <section id="services" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-14 sm:px-6 sm:py-20">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl">
              What We <span className="text-primary">Do For You</span>
            </h2>
            <p className="mt-3 text-muted-foreground">
               Seven services, one goal: getting your products into customers' hands — profitably and at scale.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {list.map(({ id, icon: Icon, title, tagline, text, points }) => (
              <article key={id} className="card-lift flex flex-col rounded-lg border border-border bg-card p-6 sm:p-7">
                <span className="flex size-12 items-center justify-center rounded-lg bg-accent text-primary">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-xl">{title}</h3>
                <p className="mt-1 text-sm font-semibold text-primary">{tagline}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
                <ul className="mt-5 space-y-2.5 border-t border-border pt-5">
                  {points.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                      <span className="text-muted-foreground">{p}</span>
                    </li>
                  ))}
                </ul>
                 <Button asChild variant="outline" className="mt-6 self-start"><Link to="/our-services/$serviceId" params={{ serviceId: id }}>View service details <ArrowRight aria-hidden="true" /></Link></Button>
              </article>
            ))}
          </div>
        </section>
    </>
  );
}

export function HowWeWorkSection() {
  return (
    <>
        <section className="border-t border-border bg-ink px-4 py-14 text-ink-foreground sm:px-6 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-3xl sm:text-4xl">
              How We <span className="text-primary">Work</span>
            </h2>
            <p className="mt-3 max-w-2xl text-ink-foreground/70">
              A clear, structured route from your first enquiry to products on shelves.
            </p>
            <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {howWeWork.map(({ icon: Icon, step, title, text }) => (
                <li key={step} className="relative">
                  <div className="flex items-center gap-3">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="font-display text-sm font-bold text-primary">{step}</span>
                  </div>
                  <h3 className="mt-3 font-display text-base font-bold">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-foreground/70">{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
    </>
  );
}

export function WhoWeServeSection() {
  return (
    <>
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl">
              Who We <span className="text-primary">Serve</span>
            </h2>
            <p className="mt-3 text-muted-foreground">
              Our services are built for businesses at different stages of growth — and for the stores that sell their products.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whoWeServe.map(({ icon: Icon, title, text }) => (
              <div key={title} className="card-lift rounded-lg border border-border bg-card p-6 text-center">
                <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-accent text-primary">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-display text-base font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </section>
    </>
  );
}

export function ServiceCtasSection() {
  return (
    <>
        <section className="border-t border-border bg-accent/40 px-4 py-14 sm:px-6 sm:py-16">
          <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
             <div className="rounded-sm border border-border bg-card p-7">
              <Landmark className="size-8 text-primary" aria-hidden="true" />
              <h3 className="mt-4 font-display text-lg font-bold">Need Funding?</h3>
               <p className="mt-2 text-sm text-muted-foreground">Funding assistance for manufacturers and startups — machinery, working capital and growth.</p>
              <Button asChild variant="outline" className="mt-5">
                <Link to="/fund-your-business">Fund Your Business <ArrowRight aria-hidden="true" /></Link>
              </Button>
            </div>
             <div className="rounded-sm border border-border bg-card p-7">
              <Store className="size-8 text-primary" aria-hidden="true" />
              <h3 className="mt-4 font-display text-lg font-bold">Have A Store?</h3>
              <p className="mt-2 text-sm text-muted-foreground">Join {totalStoreFigure} retail stores as a retail partner and calculate your approximate rent.</p>
              <Button asChild variant="outline" className="mt-5">
                <Link to="/retailer-partner">Retailer Partner <ArrowRight aria-hidden="true" /></Link>
              </Button>
            </div>
             <div className="rounded-sm border border-border bg-card p-7">
              <Handshake className="size-8 text-primary" aria-hidden="true" />
              <h3 className="mt-4 font-display text-lg font-bold">Ready To Partner?</h3>
              <p className="mt-2 text-sm text-muted-foreground">Register as a manufacturer or retail store partner and start the conversation.</p>
              <Button asChild className="mt-5">
                <Link to="/partner-with-us">Partner With Us <ArrowRight aria-hidden="true" /></Link>
              </Button>
            </div>
          </div>
        </section>
    </>
  );
}

export function CtaStripSection() {
  return (
    <>
        <section className="bg-ink px-4 py-14 text-center text-ink-foreground sm:px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Let's Put Your Products <span className="text-primary">On Every Shelf</span>
            </h2>
            <p className="mt-4 text-ink-foreground/75">
              Tell us about your business and we'll show you exactly which services fit your growth plan.
            </p>
            <Button asChild size="lg" className="mt-7 h-12">
              <Link to="/contact">Contact Us Today <ArrowRight aria-hidden="true" /></Link>
            </Button>
          </div>
        </section>
    </>
  );
}
