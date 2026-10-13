import { Link } from "@tanstack/react-router";
import { ArrowRight, BriefcaseBusiness, CalendarDays, Car, ChartNoAxesCombined, CheckCircle2, ClipboardCheck, FilePenLine, Globe2, GraduationCap, Handshake, Headphones, Hotel, Lightbulb, MapPin, Mic, Plane, Rocket, ScanSearch, Star, Target, Trophy, Users, Utensils, type LucideIcon } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/frontend/components/ui/accordion";
import { ProgrammeApplicationForm } from "./application-form";
import heroPhoto from "@/assets/funding-gwalior-hero.jpg";
import supportPhotos from "@/assets/funding-support-photos.jpg";
import logo from "@/assets/header-wordmark-dark.webp.asset.json";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/frontend/components/ui/dialog";
import { Play } from "lucide-react";
import { programmeRules, registrationTotal } from "./rules";
import { SiteFooter, SiteHeader } from "@/frontend/components/site-chrome";
const hero = { url: heroPhoto };
import benefit0Asset from "@/assets/funding-programme-benefit-0.webp.asset.json";
const benefit0 = benefit0Asset.url;
import benefit1Asset from "@/assets/funding-programme-benefit-1.webp.asset.json";
const benefit1 = benefit1Asset.url;
import benefit2Asset from "@/assets/funding-programme-benefit-2.webp.asset.json";
const benefit2 = benefit2Asset.url;
import benefit3Asset from "@/assets/funding-programme-benefit-3.webp.asset.json";
const benefit3 = benefit3Asset.url;
import benefit4Asset from "@/assets/funding-programme-benefit-4.webp.asset.json";
const benefit4 = benefit4Asset.url;
import benefit5Asset from "@/assets/funding-programme-benefit-5.webp.asset.json";
const benefit5 = benefit5Asset.url;

const benefits = [
  { icon: Users, title: "Mentor Support", text: "Get guidance from experienced mentors to refine your business idea and pitch.", image: benefit0 },
  { icon: Handshake, title: "Investor Connect", text: "Pitch to investors and connect with industry experts.", image: benefit1 },
  { icon: ClipboardCheck, title: "Business Evaluation", text: "Understand your startup’s strengths and growth potential.", image: benefit2 },
  { icon: Users, title: "Strategic Networking", text: "Connect with founders, industry leaders and ecosystem partners.", image: benefit3 },
  { icon: Mic, title: "National Visibility", text: "Showcase your startup on a national platform.", image: benefit4 },
  { icon: ChartNoAxesCombined, title: "Growth Support", text: "Access opportunities to scale your business on a larger platform.", image: benefit5 },
];
const journey = [
  { icon: FilePenLine, title: "Register", text: "Submit your startup details to the RIPL funding team." },
  { icon: ScanSearch, title: "Startup Scanning", text: `Within ${programmeRules.scanningDays} days, RIPL evaluates your startup, understands your business and provides a rating.` },
  { icon: Users, title: "First Pitch", text: "Pitch your startup to our jury panel with support from RIPL mentors." },
  { icon: Star, title: "Senior Jury Pitch", text: "Selected startups pitch to the senior jury panel with continued mentor support." },
  { icon: Mic, title: "Investor Pitch", text: "Final selected startups pitch to participating investors for potential funding." },
];
const support = [
  { icon: Hotel, title: "Accommodation", note: "Stay" },
  { icon: Utensils, title: "Food", note: "Meals" },
  { icon: Plane, title: "One-Side Travel Ticket", note: "Reimbursement" },
  { icon: Car, title: "Local Travel", note: "In Gwalior" },
  { icon: MapPin, title: "Local Tour", note: "Gwalior highlights" },
];
const eligibility = [
  { icon: Rocket, title: "Early-Stage Startups" }, { icon: GraduationCap, title: "Student-Led Startups" },
  { icon: Lightbulb, title: "Innovative Business Ideas" }, { icon: BriefcaseBusiness, title: "Product or Service Based" },
  { icon: ChartNoAxesCombined, title: "Growth-Stage Businesses" }, { icon: Target, title: "Funding-Ready Startups" },
];
const faqs = [
  ["What is the registration fee?", `The fee is ₹${programmeRules.registrationFee.toLocaleString("en-IN")} plus ${programmeRules.gstPercent}% GST (₹${registrationTotal(2).toLocaleString("en-IN")} total) per startup for up to two people. Each additional participant costs ₹${programmeRules.additionalParticipantFee.toLocaleString("en-IN")} plus ${programmeRules.gstPercent}% GST (₹${(registrationTotal(3) - registrationTotal(2)).toLocaleString("en-IN")} total).`],
  ["Who can participate?", "Early-stage, student-led, innovative, product- or service-based and growth-stage startups can submit their details. Participation is subject to review and selection."],
  ["Is the funding guaranteed?", "The non-refundable grant of up to ₹15 lakhs is awarded to only the top two performing startups. Beyond the grant, selected startups may also pitch to participating investors for funding — but investor funding is not guaranteed and depends on evaluation, eligibility, performance and applicable terms."],
  ["What does the registration include?", "The stated fee covers participation for up to two people from one startup. The team will confirm participation details and applicable terms before payment."],
  ["Will travel, stay and food be provided?", "Eligible selected participants receive accommodation, food, one-side travel ticket reimbursement, local travel and a Gwalior tour, subject to programme policy and terms. Confirm eligibility and reimbursement arrangements with the team before booking."],
  ["What is the last date to register?", "A registration deadline has not been announced here. Contact the RIPL team to confirm availability and the application schedule."],
  ["Can a student-led startup apply?", "Yes. Student-led startups and founders with innovative business ideas are welcome to submit their details for review."],
  ["Where will the event be held?", "The three-day summit is scheduled for 29–31 December 2026 in Gwalior, Madhya Pradesh, India. The team will share the exact venue with confirmed participants."],
];

function RegisterButton({ compact = false }: { compact?: boolean }) {
  return <Button asChild variant="programme" size={compact ? "default" : "lg"} className="programme-register"><a href="#register" onClick={(event) => { event.preventDefault(); document.getElementById("register")?.scrollIntoView({ behavior: "smooth" }); }}>{compact ? "Register Now" : "Register Your Startup Now"}<ArrowRight /></a></Button>;
}
function Heading({ children, note }: { children: React.ReactNode; note?: string }) {
  return <div className="programme-heading"><h2>{children}</h2><span aria-hidden="true" />{note && <p>{note}</p>}</div>;
}
function IconTiles({ items }: { items: { icon: LucideIcon; title: string }[] }) {
  return <div className="programme-icon-tiles">{items.map(({ icon: Icon, title }) => <div key={title}><Icon aria-hidden="true" /><h3>{title}</h3></div>)}</div>;
}
export function FundingProgrammePage() {
  const [videoOpen, setVideoOpen] = useState(false);
  return <><SiteHeader />
    <main className="programme-page">
    <section className="programme-hero">
      <img src={hero.url} alt="Startup founder overlooking Gwalior’s fort and palace at sunset" width={1944} height={700} fetchPriority="high" className="programme-hero-photo" />
      <div className="programme-hero-veil" />
      <div className="page-shell programme-hero-inner">
        <div className="programme-hero-copy">
          <p className="programme-eyebrow">RIPL STARTUP <span aria-hidden="true" /></p>
          <h1><span>FUNDING</span><br />PROGRAMME</h1>
          <p className="programme-tagline">Pitch. Connect. Raise. Grow.</p>
          <p className="programme-intro">A platform to identify promising startups and emerging businesses and provide eligible founders with funding support, mentorship and investor connections.</p>
          <div className="programme-hero-points">{[{ icon: Lightbulb, title: "PITCH", text: "Your startup" }, { icon: Users, title: "CONNECT", text: "With investors" }, { icon: ChartNoAxesCombined, title: "RAISE", text: "Funding opportunity" }, { icon: Rocket, title: "GROW", text: "Your business" }].map(({ icon: Icon, title, text }) => <div key={title}><Icon /><div><b>{title}</b><small>{text}</small></div></div>)}</div>
          <div className="programme-hero-actions"><RegisterButton /><Button variant="ghost" className="programme-watch" onClick={() => setVideoOpen(true)}><span><Play /></span><div>Watch Video<small>See how it works</small></div></Button></div>
        </div>
        <div className="programme-gwalior"><strong>Gwalior</strong><p><MapPin /> Madhya Pradesh, India</p><em>Ideas Today.<br />Impact Tomorrow.</em></div>
        <div className="programme-date"><CalendarDays /><div><strong>29 · 30 · 31</strong><b>DECEMBER 2026</b><span>(3-Day Summit)</span></div><p><MapPin /> Gwalior, Madhya Pradesh, India</p></div>
      </div>
    </section>
    <section className="programme-strip"><div className="page-shell"><IconTiles items={[{ icon: Lightbulb, title: "Funding Opportunities" }, { icon: Handshake, title: "Investor Connect" }, { icon: Users, title: "Mentorship Support" }, { icon: ClipboardCheck, title: "Business Evaluation" }, { icon: Handshake, title: "Strategic Networking" }, { icon: ChartNoAxesCombined, title: "National Visibility" }]} /><p><img src={logo.url} alt="RIPL" width={70} height={35} />Organised by <strong>Rishishwar Industry Private Limited (RIPL)</strong><small>Grow Your Business With Us.</small></p></div></section>
    <section id="about-programme" className="programme-funding"><div className="page-shell programme-funding-grid">
      <div className="programme-opportunity"><p>UP TO</p><h2>₹15 LAKHS<span>NON-REFUNDABLE GRANT OPPORTUNITY</span></h2><p>A platform to support innovative startups and emerging businesses with a non-refundable grant, mentorship and investor connections.</p><p className="programme-grant-highlight"><strong>The non-refundable grant will be awarded to only two startups.</strong> But funding can also come your way — selected startups pitch to participating investors for additional funding.</p></div>
      <div><div className="programme-prizes">{[{ title: "Top Performing Startup", amount: "₹10 LAKHS" }, { title: "Second Top Performing Startup", amount: "₹5 LAKHS" }].map(({ title, amount }) => <article key={title}><Trophy /><div><h3>{title}</h3><p>Up to <strong>{amount}</strong></p></div></article>)}</div><p className="programme-terms">The non-refundable grant is awarded to only two startups. Subject to evaluation, eligibility, performance and applicable Terms &amp; Conditions.</p><IconTiles items={[{icon:Users,title:"Mentor Support"},{icon:Handshake,title:"Investor Meetings"},{icon:ClipboardCheck,title:"Business Evaluation"},{icon:ChartNoAxesCombined,title:"5-Stage Startup Journey"},{icon:Handshake,title:"Strategic Partnerships"},{icon:Globe2,title:"National Exposure"}]} /></div>
    </div></section>
    <section id="process" className="page-shell programme-section"><Heading note="FROM IDEA TO INVESTMENT">The 5-Stage <em>Startup</em> Journey</Heading><ol className="programme-journey">{journey.map(({ icon: Icon, title, text }, index) => <li key={title}><span className="programme-step">0{index + 1}</span><Icon /><h3>{title}</h3><p>{text}</p>{index < 4 && <ArrowRight className="programme-step-arrow" />}</li>)}</ol></section>
    <section id="benefits" className="programme-benefits"><div className="page-shell programme-section"><Heading>What You Get</Heading><div className="programme-benefit-grid">{benefits.map(({ icon: Icon, title, text, image }) => <article key={title}><img src={image} alt={title} width={592} height={298} loading="lazy" /><div><span className="programme-benefit-icon"><Icon /></span><h3>{title}</h3><p>{text}</p></div></article>)}</div></div></section>
    <section className="page-shell programme-section programme-logistics">
      <div className="programme-fee"><h2 className="programme-band-title">Registration Fee</h2><div className="programme-fee-body"><div className="programme-main-fee"><Users /><p><strong>₹2,999/-</strong><span>+18% GST</span></p></div><p>Includes participation for up to 2 persons per startup.</p><div className="programme-extra-fee"><Users /><div><h3>Additional Participant</h3><strong>₹2,000/-</strong><p>+18% GST per person</p><small>Applicable beyond the first 2 persons.</small></div></div></div></div>
      <div className="programme-support"><h2 className="programme-band-title">Completely Free for Selected Participants</h2><div className="programme-support-body"><div className="programme-support-grid">{support.map(({ icon: Icon, title, note }) => <div key={title}><Icon /><h3>{title}</h3><p>({note})</p></div>)}</div><div className="programme-support-photos"><img src={supportPhotos} alt="Accommodation, meals, train ticket, local travel and Gwalior tour" width={1536} height={512} loading="lazy" /></div><p className="programme-support-banner">STAY · FOOD · ONE-SIDE TICKET · LOCAL TRAVEL · LOCAL TOUR<br /><strong>COMPLETELY FREE</strong></p><p className="programme-small">Eligible participants receive these benefits subject to policy, eligibility and Terms & Conditions. Confirm travel reimbursement before booking.</p></div></div>
      <div className="programme-event"><h2 className="programme-band-title">Event Details</h2><div><p><CalendarDays /><span><strong>29 – 31 December 2026</strong><small>(3-Day Summit)</small></span></p><p><MapPin /><strong>Gwalior, Madhya Pradesh, India</strong></p><img src={hero.url} alt="Gwalior summit location" width={1944} height={700} loading="lazy" /><RegisterButton compact /></div></div>
    </section>
    <section className="page-shell programme-section programme-eligibility"><div><Heading>Who Can Apply?</Heading><IconTiles items={eligibility} /><div id="why-participate"><Heading>Why Participate?</Heading></div><IconTiles items={[{ icon: Lightbulb, title: "Funding Opportunities" }, { icon: Users, title: "Mentorship Support" }, { icon: Handshake, title: "Investor Connect" }, { icon: ClipboardCheck, title: "Business Evaluation" }, { icon: Handshake, title: "Strategic Partnerships" }, { icon: Globe2, title: "National Visibility" }]} /></div><div className="programme-platform"><img src={benefit4} alt="Founder presenting a startup to an audience" width={592} height={298} loading="lazy" /><div><h2>A PLATFORM FOR<br /><em>REAL IDEAS,<br />REAL FOUNDERS,</em><br />REAL IMPACT.</h2><RegisterButton compact /></div></div></section>
    <section id="register" className="page-shell programme-section programme-app"><Heading note="APPLY NOW">Startup <em>Application</em> Form</Heading><p className="programme-app-intro">Apne startup ka idea, stage aur funding need batayein — turant AI se personalised grant eligibility aur investor-funding recommendations paayein. Grant sirf 2 startups ko milega, par investor funding aapko bhi mil sakti hai.</p><ProgrammeApplicationForm /></section>
    <section id="programme-faq" className="page-shell programme-section"><Heading>Frequently Asked Questions</Heading><div className="programme-faq-layout"><Accordion type="single" collapsible className="programme-faq">{faqs.map(([question, answer], index) => <AccordionItem value={`faq-${index}`} key={question}><AccordionTrigger>{question}</AccordionTrigger><AccordionContent>{answer}</AccordionContent></AccordionItem>)}</Accordion><aside className="programme-help"><Headphones /><h3>Still have questions?</h3><p>Get in touch with our team.</p><Button asChild variant="outline"><Link to="/contact">Contact Us <ArrowRight /></Link></Button></aside></div></section>
    <section className="programme-closing"><img src={hero.url} alt="Gwalior palace at sunset" width={1944} height={700} loading="lazy" /><div className="page-shell"><h2>Ideas Today. Impact Tomorrow.</h2><p>Join the RIPL Startup Funding Programme and take your startup to the next level.</p><RegisterButton /></div></section>
    </main><SiteFooter />
    <Dialog open={videoOpen} onOpenChange={setVideoOpen}><DialogContent><DialogTitle>RIPL Startup Funding Programme</DialogTitle><p>The programme video has not been provided yet. Explore the five-stage startup journey below.</p><Button variant="programme" asChild><a href="#process" onClick={() => setVideoOpen(false)}>View Startup Journey <ArrowRight /></a></Button></DialogContent></Dialog>
  </>;
}
