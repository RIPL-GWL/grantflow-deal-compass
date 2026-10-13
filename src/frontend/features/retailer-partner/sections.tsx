import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeIndianRupee, Boxes, Store, Truck, Users } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/frontend/components/site-chrome";
import { Button } from "@/frontend/components/ui/button";
import { IncomeCalculator } from "@/frontend/components/forms/income-calculator";
import storeImage from "@/frontend/assets/retailer-store.webp";



export function HeroSection() {
  return (
    <>
        <section className="dark-surface relative isolate flex min-h-[540px] items-center overflow-hidden sm:min-h-[590px]">
          <img src={storeImage} alt="Rishishwar Industry retailer in a well-stocked grocery store" className="absolute inset-0 -z-20 size-full object-cover object-[58%_center]" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/90 to-ink/20 max-md:bg-gradient-to-t max-md:from-ink max-md:via-ink/75 max-md:to-ink/10" />
          <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
            <div className="max-w-xl">
              <p className="text-sm font-bold uppercase text-primary">Rishishwar Industry · Retailer Partnership</p>
              <h1 className="mt-5 text-4xl leading-tight sm:text-5xl lg:text-6xl">Retailer Partner Bane. <span className="text-primary">Zyada Kamaye.</span></h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-ink-foreground/85 sm:text-lg">Apni shop ko Rishishwar Industry ke saath jodiye aur apni location aur store area ke hisab se approximate monthly rent ki opportunity paaiye.</p>
              <Button asChild size="lg" className="mt-7 h-auto min-h-11 whitespace-normal px-6 py-3 text-center">
                <Link to="/register-your-store">Register Your Store With Us <ArrowRight aria-hidden="true" /></Link>
              </Button>
              <div className="mt-10 grid max-w-lg grid-cols-2 gap-5 border-t border-ink-foreground/20 pt-6 text-sm sm:grid-cols-4">
                {[
                  { icon: BadgeIndianRupee, text: "Approx. Rent Opportunity" },
                  { icon: Store, text: "Area-Based Calculation" },
                  { icon: Boxes, text: "Quality Products" },
                  { icon: Users, text: "Long-Term Partnership" },
                ].map(({ icon: Icon, text }) => <div key={text}><Icon className="mb-2 size-6 text-primary" aria-hidden="true" /><span className="leading-tight text-ink-foreground/90">{text}</span></div>)}
              </div>

            </div>
          </div>
        </section>
    </>
  );
}

export function HighlightsSection() {
  return (
    <>
        <section className="border-b border-border bg-ink py-6 text-ink-foreground">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:grid-cols-3 sm:px-6">
            {[
              { icon: Store, title: "Approx. Monthly Rent", text: "Location aur area ke hisab se" },
              { icon: Boxes, title: "Product Supply", text: "Quality products, time par supply" },
              { icon: Truck, title: "Brand Support", text: "Product supply aur market support" },

            ].map(({ icon: Icon, title, text }) => <div key={title} className="flex items-start gap-3 sm:border-r sm:border-ink-foreground/15 sm:last:border-r-0"><Icon className="mt-1 size-6 shrink-0 text-primary" aria-hidden="true" /><div><h2 className="text-base">{title}</h2><p className="mt-0.5 text-sm text-ink-foreground/65">{text}</p></div></div>)}
          </div>
        </section>
    </>
  );
}

export function CalculatorSection() {
  return (
    <>
        <section id="calculator" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="mb-8 max-w-2xl">
            <p className="text-xs font-bold uppercase text-primary">Estimated / Indicative</p>
            <h2 className="mt-2 text-3xl sm:text-4xl">Retailer Partner <span className="text-primary">Rent Calculator</span></h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">Apni shop ki location aur area daaliye aur approximate monthly rent dekhiye. Ye koi offer ya guarantee nahi hai.</p>

          </div>
          <IncomeCalculator />
        </section>
    </>
  );
}

export function CtaSection() {
  return (
    <>
        <section className="bg-ink px-4 py-12 text-ink-foreground sm:px-6">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center"><div><h2 className="text-2xl sm:text-3xl">Grow Together.</h2><p className="mt-2 text-ink-foreground/70">Apni dukaan ko Rishishwar Industry ke saath jodiye.</p></div><Button asChild size="lg"><Link to="/register-your-store">Register Your Store With Us <ArrowRight aria-hidden="true" /></Link></Button></div>
        </section>
    </>
  );
}
