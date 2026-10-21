import { Link } from "@tanstack/react-router";
import { ArrowRight, Rocket, Users, MapPin, Globe2, CheckCircle2, Target, Coins, ChartNoAxesCombined, Settings, Search, Lightbulb, FileText, Handshake } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { isNavratri, useSiteTheme } from "@/frontend/lib/site-theme";
import { districtFigure } from "@/frontend/data/retail-network";
import heroSrcAsset from "@/assets/scale-startup-hero.webp.asset.json";
const heroSrc = heroSrcAsset.url;
const hero = { url: heroSrc };
import tractionSrcAsset from "@/assets/scale-startup-journey.webp.asset.json";
const tractionSrc = tractionSrcAsset.url;
const traction = { url: tractionSrc };
import foundersAsset from "@/assets/startup-team.webp.asset.json";
const founders = foundersAsset.url;
import summitAsset from "@/assets/scale-startup-summit.webp.asset.json";
const summit = summitAsset.url;

const services = [
  { icon: Target, title: "Strategy & Positioning", text: "Refine your business model, market positioning and go-to-market strategy.", to: "/startup-with-ripl" },
  { icon: Coins, title: "Funding & Capital", text: "Connect with the right investors and funding opportunities at every stage.", to: "/fund-your-startup" },
  { icon: ChartNoAxesCombined, title: "Sales & Revenue Growth", text: "Build strong sales systems, channel partners and market penetration strategies.", to: "/our-services" },
  { icon: Globe2, title: "Market Expansion", text: "Access new cities, states and international markets through our network.", to: "/global-presence" },
  { icon: Settings, title: "Technology & Transformation", text: "Leverage technology, automation and digital tools to scale efficiently.", to: "/contact" },
  { icon: Users, title: "Mentorship & Leadership", text: "Get guidance from experienced entrepreneurs, industry experts and business mentors.", to: "/our-mentors" },
] as const;
const steps = [
  { icon: Search, title: "Diagnose", text: "Understand your current stage, challenges and opportunities." },
  { icon: Lightbulb, title: "Strategize", text: "Create a customized growth strategy and action plan." },
  { icon: Settings, title: "Build", text: "Strengthen your product, team, systems and market readiness." },
  { icon: ChartNoAxesCombined, title: "Expand", text: "Enter new markets, build sales channels and scale operations." },
  { icon: Rocket, title: "Scale", text: "Achieve sustainable growth and create long-term impact." },
];
function ScaleButton({ children = "Scale With RIPL" }: { children?: React.ReactNode }) {
  return <Button asChild size="lg" className="startup-button"><Link to="/contact">{children}<ArrowRight /></Link></Button>;
}
export function ScaleStartupPageContent() {
  const seasonal = isNavratri(useSiteTheme());
  return <main className={`startup-page scale-startup ${seasonal ? "startup-seasonal" : ""}`}>
    <section className="scale-hero"><img className="startup-backdrop" src={hero.url} alt="Startup founder and team in an office overlooking India's growing cities" width={1920} height={768} fetchPriority="high" /><div className="scale-photo-fade" /><div className="page-shell scale-hero-inner"><div className="scale-hero-copy"><p className="startup-eyebrow">Scale Your Startup</p><h1>Scale Faster.<br /><em>Build Smarter.</em><br />Grow Stronger.</h1><p>We help startups move from early traction to sustainable growth with the right strategy, funding, sales support, market access, technology and mentorship.</p><div className="startup-actions"><ScaleButton /><Button asChild size="lg" variant="outline" className="startup-talk"><Link to="/contact">Talk to Our Team</Link></Button></div>{seasonal && <p className="startup-greeting">॥ Happy Navratri · New Beginnings, New Possibilities ॥</p>}</div><dl className="scale-stats">{[{ icon: Rocket, value: "100+", label: "Growth Projects" }, { icon: Users, value: "50+", label: "Investor Connections" }, { icon: MapPin, value: districtFigure, label: "District Market Reach" }, { icon: Globe2, value: "8", label: "Global Markets" }].map(({ icon: Icon, value, label }) => <div key={label}><Icon /><dt>{value}</dt><dd>{label}</dd></div>)}</dl></div></section>
    <section className="scale-traction"><img className="startup-backdrop" src={traction.url} alt="Entrepreneur climbing the staircase from startup traction toward wider markets and growth" width={1920} height={768} loading="lazy" /><div className="scale-photo-fade" /><div className="page-shell"><div className="scale-traction-copy"><p className="startup-eyebrow">From Traction to Scale</p><h2>From Traction<br />to <em>Scale</em></h2><p>We work with early-stage and growth-stage startups to validate, build, and scale their business with real market opportunities, strategic guidance and end-to-end support.</p><ul>{["Validate your idea", "Build a scalable business model", "Access funding and investor network", "Enter new markets across India and globally"].map(text => <li key={text}><CheckCircle2 />{text}</li>)}</ul><Button asChild size="lg" className="startup-button"><Link to="/startup-with-ripl">Learn More<ArrowRight /></Link></Button></div></div></section>
    <section className="scale-engine"><div className="page-shell"><div className="scale-section-heading"><div><p className="startup-eyebrow">The Scale Engine</p><h2>End-to-End Support for<br />Every Stage of <em>Your Growth</em></h2></div><p>A complete ecosystem to help you scale — from strategy and funding to sales, technology and global expansion.</p></div><div className="scale-services">{services.map(({ icon: Icon, title, text, to }) => <article key={title}><Icon /><div><h3>{title}</h3><p>{text}</p></div><Button asChild variant="outline" size="icon-sm" className="scale-service-link" title={`Explore ${title}`}><Link to={to} aria-label={`Explore ${title}`}><ArrowRight /></Link></Button></article>)}</div></div></section>
    <section className="scale-roadmap"><div className="page-shell"><div className="scale-section-heading"><div><p className="startup-eyebrow">Your Growth Roadmap</p><h2>A Clear Path from <em>Idea to Impact</em></h2></div><p>Our proven 5-step approach to help you scale faster and build a sustainable, successful business.</p></div><ol>{steps.map(({ icon: Icon, title, text }, index) => <li key={title}><span className="scale-step-icon"><Icon /></span><span className="scale-step-number">0{index + 1}</span><h3>{title}</h3><p>{text}</p>{index < 4 && <ArrowRight className="scale-step-arrow" />}</li>)}</ol></div></section>
    <section className="scale-founders"><div className="scale-founder-image"><img src={founders} alt="Indian startup founders collaborating around a laptop" width={1536} height={768} loading="lazy" /></div><div className="scale-founder-copy"><p className="startup-eyebrow">Built for Ambitious Founders</p><h2>Turning Bold Ideas<br />into <em>Bigger Opportunities</em></h2><p>Whether you're building a product, a service or a technology platform, RIPL gives you the network, expertise and resources to scale with confidence.</p><ul>{[{ icon: FileText, title: "Stronger Business Model" }, { icon: Users, title: "Investor Readiness" }, { icon: ChartNoAxesCombined, title: "Predictable Sales Growth" }, { icon: Settings, title: "Operational Systems" }, { icon: Globe2, title: "Wider Market Access" }, { icon: Handshake, title: "Long-Term Partnership" }].map(({ icon: Icon, title }) => <li key={title}><Icon />{title}</li>)}</ul></div></section>
    <section className="scale-ready"><img className="startup-backdrop" src={summit} alt="Founders helping each other reach a summit above a growing city" width={1920} height={640} loading="lazy" /><div className="page-shell"><h2>Ready to Scale Your Startup?</h2><p>Partner with Rishishwar Industry and get the right support to build, grow and create a lasting impact.</p><ScaleButton>Start Your Scale Journey</ScaleButton></div></section>
  </main>;
}