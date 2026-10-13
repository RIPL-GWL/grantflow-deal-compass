import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Box,
  Handshake,
  Truck,
  ClipboardList,
  BarChart3,
  Headset,
  Globe,
  Users,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import heroGlobe from "@/frontend/assets/gp-india-globe.webp";
import shipImg from "@/frontend/assets/gp-ship.webp";
import imgIndia from "@/frontend/assets/gp-india-gate.webp";
import imgAustralia from "@/frontend/assets/gp-australia.webp";
import imgUsa from "@/frontend/assets/gp-usa.webp";
import imgCanada from "@/frontend/assets/gp-canada.webp";
import imgUae from "@/frontend/assets/gp-uae.webp";
import imgSingapore from "@/frontend/assets/gp-singapore.webp";
import imgUk from "@/frontend/assets/gp-uk.webp";
import imgEurope from "@/frontend/assets/gp-europe.webp";
import worldMap from "@/frontend/assets/gp-world-map.webp";

import { heroStats, countries, support, trustPoints } from "./content";
import { mergeById, useSiteContent } from "@/lib/site-content";


export function HeroSection() {
  return (
    <>
        <section className="relative overflow-hidden bg-ink text-ink-foreground">
          <img
            src={heroGlobe}
            alt="Global landmarks with glowing trade routes"
            className="absolute inset-0 h-full w-full object-cover object-right opacity-70"
            width={1920}
            height={640}
          />
          <div className="hero-overlay absolute inset-0" />
          <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-16 sm:px-6 sm:pt-24">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Global Presence
            </p>
            <h1 className="mt-4 max-w-2xl text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
              Indian Brands.{" "}
              <span className="text-primary">Global Markets.</span>
            </h1>
            <p className="mt-5 max-w-xl leading-relaxed text-ink-foreground/75">
              Rishishwar Industry is helping FMCG manufacturers take their
              products beyond borders with reliable market access, strong
              partnerships and end-to-end support in international markets.
            </p>
            <Link
              to="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Expand Globally <ArrowRight className="size-4" />
            </Link>

            {/* Inline stats row */}
            <div className="mt-14 grid grid-cols-2 gap-6 border-t border-border pt-8 sm:grid-cols-4">
              {heroStats.map((s) => (
                <div key={s.label} className="flex flex-col items-start gap-1">
                  <s.icon className="size-6 text-primary" strokeWidth={1.8} />
                  <p className="font-display text-2xl font-extrabold">{s.value}</p>
                  <p className="text-xs uppercase tracking-[0.15em] text-ink-foreground/60">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
    </>
  );
}

export function CountriesSection() {
  const edits = useSiteContent("countries");
  const list = mergeById(countries, edits, (x) => x.slug, (e) => e.slug);
  return (
    <>
        <section id="countries" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Our Global Footprint
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl">
                Present in <span className="text-primary">8 Countries</span>
              </h2>
               <p className="mt-3 max-w-md text-muted-foreground">
                We are currently serving clients in 8 countries, helping FMCG
                manufacturers expand their reach with reliable distribution
                networks, local partnerships and market support.
              </p>
              <a
                href="#market-links"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                View Markets <ArrowRight className="size-4" />
              </a>
            </div>
            <img
              src={worldMap}
              alt="World map showing Rishishwar Industry's presence in 8 countries from India"
              loading="lazy"
              className="w-full"
              width={1748}
              height={900}
            />
          </div>

          <div id="market-links" className="mt-12 grid scroll-mt-24 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {list.map((c) => (
              <Link
                key={c.name}
                to="/global-presence/$market"
                params={{ market: c.slug }}
                 className="group overflow-hidden rounded-sm border border-border bg-card card-lift"
              >
                <div className="relative aspect-[16/10]">
                  <div className="size-full overflow-hidden">
                    <img
                      src={c.img}
                      alt={c.name}
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <span className="absolute -bottom-6 left-4 flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-card bg-card text-2xl leading-none shadow-md" aria-label={`${c.name} flag`}>
                    {c.flag}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-3 p-4 pt-9">
                  <div>
                    <h3 className="font-display text-base font-bold">{c.name}</h3>
                     <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      {c.note}
                    </p>
                  </div>
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <ArrowRight className="size-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
    </>
  );
}

export function EndToEndSupportSection() {
  return (
    <>
        <section className="bg-secondary py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Our Support
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl">
                End-to-End Support for{" "}
                <span className="text-primary">International Markets</span>
              </h2>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-6">
              {support.map((s) => (
                <div key={s.title} className="text-center">
                  <s.icon className="mx-auto size-9 text-primary" strokeWidth={1.6} />
                  <h3 className="mt-4 font-display text-sm font-bold">{s.title}</h3>
                   <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {s.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
    </>
  );
}

export function BiggerMarketsSection() {
  return (
    <>
        <section className="relative overflow-hidden bg-ink text-ink-foreground">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Why Go Global With Us
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl">
                Bigger Markets.{" "}
                <span className="text-primary">Greater Opportunities.</span>
              </h2>
               <p className="mt-4 max-w-md leading-relaxed text-ink-foreground/70">
                We combine industry expertise, a strong network and a hands-on
                approach to help FMCG manufacturers successfully enter and grow
                in international markets.
              </p>
              <Link
                to="/contact"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Partner for Global Growth <ArrowRight className="size-4" />
              </Link>
            </div>
            <div>
              <img
                src={shipImg}
                alt="Container ship at port ready for export"
                loading="lazy"
                className="w-full rounded-sm border border-border object-cover"
              />
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {trustPoints.map((t) => (
                  <div key={t.label} className="flex flex-col items-center gap-2 text-center">
                     <t.icon className="size-6 text-ink-foreground" strokeWidth={1.6} />
                     <p className="text-xs font-medium text-ink-foreground/80">{t.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
    </>
  );
}

export function CtaSection() {
  return (
    <>
        <section className="relative overflow-hidden bg-primary text-primary-foreground">
          <img
            src={shipImg}
            alt=""
            aria-hidden
            className="absolute inset-y-0 right-0 h-full w-1/2 object-cover opacity-40 [mask-image:linear-gradient(to_left,black,transparent)]"
          />
          <div className="relative mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-12 sm:px-6 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl">
                Take Your Brand to Global Markets
              </h2>
              <p className="mt-2 max-w-md text-sm text-primary-foreground/90">
                Partner with Rishishwar Industry and explore new opportunities
                in international markets.
              </p>
            </div>
            <Link
              to="/contact"
               className="inline-flex items-center gap-2 rounded-sm bg-ink px-6 py-3 text-sm font-semibold text-ink-foreground transition-opacity hover:opacity-90"
            >
              Get in Touch <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
    </>
  );
}
