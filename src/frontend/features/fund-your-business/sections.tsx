import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Coins, Factory, Handshake, Rocket, Sprout, TrendingUp, FileText } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import fundingBannerAssetSrcAsset from "@/assets/funding-banner.webp.asset.json";
const fundingBannerAssetSrc = fundingBannerAssetSrcAsset.url;
const fundingBannerAsset = { url: fundingBannerAssetSrc };
const fundingBanner = fundingBannerAsset.url;
import fundMachinery from "@/frontend/assets/fund-machinery.jpg";
import fundWorkingCapital from "@/frontend/assets/fund-working-capital.jpg";
import fundExpansion from "@/frontend/assets/fund-expansion.jpg";
import fundWelder from "@/frontend/assets/fund-welder-clean.jpg";
import fundIndia from "@/frontend/assets/fund-india.jpg";
import { FundingForm } from "@/frontend/components/forms/funding-form";
import { processSteps } from "./content";

const options = [
  { icon: Sprout, title: "Seed Funding", range: "₹50,000 – ₹5 Lakh", text: "For early-stage businesses, ideas and prototype development." },
  { icon: Factory, title: "Growth Funding", range: "₹5 Lakh – ₹50 Lakh", text: "For working capital, machinery, inventory and market expansion." },
  { icon: TrendingUp, title: "Expansion Funding", range: "₹50 Lakh – ₹2 Crore", text: "For scaling operations, a new unit and technology upgrades." },
  { icon: Handshake, title: "Strategic Support", range: "Guidance & assistance", text: "Business assessment, documentation and suitable funding-partner introductions." },
];
export function HeroSection({ title = "Fund Your Business", suffix = "with RIPL" }: { title?: string; suffix?: string } = {}) {
 return <><section className="funding-hero relative overflow-hidden">
  <img src={fundingBanner} alt="Indian manufacturer and startup founder looking towards business growth" width={1792} height={1024} className="funding-hero-image absolute inset-0 h-full w-full object-cover" />
  <div className="page-shell relative py-10 sm:py-14 lg:py-20">
   <div className="funding-hero-copy max-w-xl">
    <p className="mb-4 text-xs font-bold uppercase text-primary">Business Funding & Assistance</p>
    <h1 className="text-4xl leading-[1.1] sm:text-5xl lg:text-6xl">{title}{suffix ? <><br /><span className="text-primary">{suffix}</span></> : null}</h1>
    <p className="mt-5 max-w-md text-xl font-semibold leading-snug">Funding guidance for your next stage of growth.</p>
    <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">Explore funding requirements from ₹50,000 to ₹2 Crore with Rishishwar Industry. From your first idea to your next production line, take the next step with guidance.</p>
    <div className="mt-6 flex flex-wrap gap-3"><Button asChild size="lg"><a href="#apply">Apply for Funding <ArrowRight /></a></Button><Button asChild variant="outline" size="lg"><Link to="/contact">Talk to Our Team</Link></Button></div>
    <p className="mt-4 text-xs text-muted-foreground">Subject to eligibility, assessment and funding-partner approval.</p>
   </div>
  </div>
 </section>
 <section className="border-y border-border bg-muted/50"><div className="page-shell grid grid-cols-2 gap-6 py-7 lg:grid-cols-4">{[
  { icon: Coins, title: "₹50,000 to ₹2 Crore", text: "Indicative funding requirements" },
  { icon: Factory, title: "Manufacturers", text: "Working capital & expansion" },
  { icon: Rocket, title: "Startups", text: "From idea to market" },
  { icon: Handshake, title: "Guidance & Support", text: "Assessment to documentation" },
 ].map(({icon:Icon,title,text})=><div key={title} className="flex items-start gap-3"><Icon className="mt-1 size-8 shrink-0 text-primary"/><div><h2 className="text-base sm:text-lg">{title}</h2><p className="mt-1 text-sm text-muted-foreground">{text}</p></div></div>)}</div></section></>;
}
export function FundingNeedsSection() {
 return <section className="border-b border-border bg-background"><div className="page-shell py-12 sm:py-16"><div className="mb-8 grid gap-4 lg:grid-cols-2"><div><p className="text-xs font-bold uppercase text-primary">Funding pathways</p><h2 className="mt-3 text-3xl leading-tight">Fueling Growth<br />at <span className="text-primary">Every Stage</span></h2></div><p className="mt-4 text-sm leading-relaxed text-muted-foreground">Whether you are expanding production or building a startup, we help you explore suitable financing options. Final amounts, interest, security and repayment terms depend on the funding partner.</p></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{options.map(({icon:Icon,title,range,text})=><article key={title} className="rounded-none border-t-2 border-primary bg-muted/40 p-6"><Icon className="size-8 text-primary"/><h3 className="mt-5 text-base">{title}</h3><p className="mt-2 text-sm font-semibold text-primary">{range}</p><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p></article>)}</div></div></section>;
}
export function WhoCanApplyFormSection() {
 return <section id="eligibility" className="page-shell scroll-mt-24 py-12 sm:py-16"><p className="text-xs font-bold uppercase text-primary">Eligibility</p><h2 className="mt-3 text-3xl sm:text-4xl">Who Can <span className="text-primary">Apply?</span></h2><p className="mt-3 text-muted-foreground">Genuine, growth-oriented businesses with a clear funding requirement.</p><div className="mt-7 grid gap-5 md:grid-cols-2">{[
  { title:"Manufacturers", icon:Factory, img:fundWelder, points:["Small & medium manufacturing businesses", "FMCG, chemicals and consumer products", "Machinery & equipment manufacturers", "Expansion, modernization or a new unit"] },
  { title:"Startups", icon:Rocket, img:fundExpansion, points:["Early-stage startups", "Product and technology businesses", "Innovative, scalable business ideas", "Pre-revenue or revenue-stage ventures"] },
 ].map(({title,icon:Icon,img,points})=><article key={title} className="grid overflow-hidden border border-border bg-background sm:grid-cols-[180px_1fr]"><img src={img} alt={title === "Manufacturers" ? "Manufacturing work on the factory floor" : "Business expansion and production facility"} width={1024} height={1024} loading="lazy" className="h-44 w-full object-cover sm:h-full"/><div className="p-5"><h3 className="flex items-center gap-3 text-xl"><Icon className="size-6 text-primary"/>{title}</h3><ul className="mt-4 space-y-2">{points.map(p=><li key={p} className="flex gap-2 text-sm"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary"/>{p}</li>)}</ul></div></article>)}</div></section>;
}
export function FundingProcessSection() {
 return <section className="border-y border-border"><div className="page-shell py-12 sm:py-16"><p className="text-xs font-bold uppercase text-primary">Process</p><h2 className="mt-3 text-3xl sm:text-4xl">How It <span className="text-primary">Works?</span></h2><p className="mt-3 text-muted-foreground">A clear path from your requirement to a funding decision.</p><ol className="mt-9 grid gap-7 sm:grid-cols-2 lg:grid-cols-5">{processSteps.map(({icon:Icon,step,title,text})=><li key={step}><div className="flex items-center gap-4"><span className="flex size-7 items-center justify-center rounded-none bg-primary text-sm font-bold text-primary-foreground">{Number(step)}</span><Icon className="size-8"/></div><h3 className="mt-4 text-base">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p></li>)}</ol></div></section>;
}
export function AcrossIndiaSection() {
 return <><section className="page-shell py-12 sm:py-16"><div className="grid gap-7 md:grid-cols-3">{[{img:fundMachinery,title:"Upgrade Your Machinery",text:"Build production capacity with suitable equipment finance."},{img:fundWorkingCapital,title:"Keep Business Moving",text:"Support raw materials, inventory and your production cycle."},{img:fundIndia,title:"Grow Across India",text:"Explore the right structure for your next phase of growth."}].map(({img,title,text})=><article key={title}><img src={img} alt={title} width={1024} height={1024} loading="lazy" className="aspect-[4/3] w-full object-cover"/><h3 className="mt-4 text-xl">{title}</h3><p className="mt-2 text-sm text-muted-foreground">{text}</p></article>)}</div></section><section id="apply" className="scroll-mt-24 border-t border-border bg-muted/40"><div className="page-shell grid gap-10 py-12 sm:py-16 lg:grid-cols-[0.7fr_1.3fr]"><div><p className="text-xs font-bold uppercase text-primary">Apply for Funding</p><h2 className="mt-3 text-3xl sm:text-4xl">Tell Us About<br /><span className="text-primary">Your Business.</span></h2><p className="mt-4 leading-relaxed text-muted-foreground">Share your business details and funding needs. Our team will review your enquiry and discuss suitable next steps.</p><div className="mt-6 flex gap-3 border-t border-border pt-5 text-sm text-muted-foreground"><FileText className="size-5 shrink-0 text-primary"/><p>Your application opens in your email app. Send the prepared message to complete your enquiry.</p></div></div><div className="min-w-0"><FundingForm /></div></div></section></>;
}
export function DisclaimerSection() {
 return <section className="border-t border-border py-6"><p className="page-shell text-xs leading-relaxed text-muted-foreground">Rishishwar Industry provides funding assistance and guidance, not guaranteed financing. All ranges are indicative. Funding is subject to eligibility, due diligence, documentation, credit/business assessment and the applicable funding partner’s approval. Rates, fees, security and repayment terms are confirmed in writing before acceptance. Applying does not guarantee approval or disbursement.</p></section>;
}
