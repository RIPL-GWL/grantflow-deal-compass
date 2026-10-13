import { Link } from "@tanstack/react-router";
import { ArrowRight, ChartNoAxesCombined, Coins, FileText, Globe2, HandCoins, Handshake, MessageCircle, Rocket, Users } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { FundingForm } from "@/frontend/components/forms/funding-form";
import { isNavratri, useSiteTheme } from "@/frontend/lib/site-theme";
import heroSrcAsset from "@/assets/startup-staircase.webp.asset.json";
const heroSrc = heroSrcAsset.url;
const hero = { url: heroSrc };
import impactSrcAsset from "@/assets/startup-india.webp.asset.json";
const impactSrc = impactSrcAsset.url;
const impact = { url: impactSrc };
import teamAsset from "@/assets/startup-team.webp.asset.json";
const team = teamAsset.url;
import supportAsset from "@/assets/startup-support.webp.asset.json";
const support = supportAsset.url;

const strengths = [
  { icon: Coins, title: "Funding Support", text: "From Idea to Scale" },
  { icon: Users, title: "Expert Mentorship", text: "From Industry Leaders" },
  { icon: ChartNoAxesCombined, title: "Strategic Guidance", text: "For Sustainable Growth" },
  { icon: Globe2, title: "Pan-India Network", text: "Investors, Partners & Markets" },
];
const benefits = [
  { icon: Coins, title: "Access to Funding", text: "Connect with angel investors, VCs and strategic partners." },
  { icon: Users, title: "Expert Mentorship", text: "Learn from industry leaders and successful entrepreneurs." },
  { icon: ChartNoAxesCombined, title: "Business Strategy", text: "Validate, plan and build a strong growth strategy." },
  { icon: Globe2, title: "Market Access", text: "Reach new markets across India and global opportunities." },
  { icon: Rocket, title: "Long-Term Support", text: "We stay with you from idea to impact." },
];
const steps = [
  { icon: FileText, title: "Apply & Share", text: "Your Idea" },
  { icon: Users, title: "Evaluation &", text: "Discussion" },
  { icon: HandCoins, title: "Funding &", text: "Strategic Support" },
  { icon: Rocket, title: "Scale &", text: "Grow Together" },
];
function ApplyButton({ children = "Apply for Funding" }: { children?: React.ReactNode }) {
  return <Button asChild size="lg" className="startup-button"><a href="#startup-apply">{children}<ArrowRight /></a></Button>;
}
export function StartupPageContent() {
  const seasonal = isNavratri(useSiteTheme());
  return <main className={`startup-page ${seasonal ? "startup-seasonal" : ""}`}>
    <section className="startup-hero">
      <img src={hero.url} alt="Founder climbing from idea and funding to mentorship, growth and success" width={1657} height={768} fetchPriority="high" className="startup-backdrop" />
      <div className="startup-hero-fade" />
      <div className="page-shell startup-hero-inner"><div className="startup-hero-copy">
        <p className="startup-eyebrow">Ideas Today. Impact Tomorrow.</p>
        <h1>Fund Your Idea<br />Fund Your <em>Startup</em><br />Fund Your <em>Dreams</em></h1>
        <p className="startup-intro">Rishishwar Industry empowers visionary founders with funding, mentorship, strategic support and a nationwide network to turn bold ideas into successful businesses.</p>
        <div className="startup-actions"><ApplyButton /><Button asChild variant="outline" size="lg" className="startup-talk"><Link to="/contact"><MessageCircle />Talk to Our Team</Link></Button></div>
        {seasonal && <p className="startup-greeting">॥ Happy Navratri · New Beginnings, New Possibilities ॥</p>}
      </div></div>
    </section>
    <section className="startup-strengths"><div className="page-shell">{strengths.map(({icon: Icon, title, text}) => <div key={title}><span className="startup-icon"><Icon /></span><div><h2>{title}</h2><p>{text}</p></div></div>)}</div></section>
    <section className="startup-benefits"><div className="page-shell">
      <p className="startup-eyebrow">Why Choose Rishishwar Industry</p><h2>More Than <em>Funding</em></h2><p className="startup-subtitle">We give your startup the complete ecosystem to grow, scale and succeed.</p>
      <div className="startup-benefit-grid">{benefits.map(({icon: Icon, title, text}, index) => <article key={title}><div className={`startup-benefit-photo startup-photo-${index}`}><img src={support} alt={title} width={1920} height={640} loading="lazy" /></div><div className="startup-benefit-body"><span className="startup-icon"><Icon /></span><div><h3>{title}</h3><p>{text}</p></div></div></article>)}</div>
    </div></section>
    <section className="startup-impact"><img src={impact.url} alt="Indian entrepreneur overlooking India Gate, connected India and growing cities" width={1920} height={641} loading="lazy" className="startup-backdrop" /><div className="startup-impact-fade" /><div className="page-shell startup-impact-inner"><div className="startup-impact-copy"><h2>Turning Ideas<br />into <em>Impact</em></h2><p>We believe in founders, innovation and a stronger India.</p><ApplyButton>Start Your Journey</ApplyButton></div><dl className="startup-numbers">{[["500+", "Startup Ideas", "Evaluated"], ["120+", "Startups", "Supported"], ["50+", "Investor", "Connections"], ["20+", "Industry", "Mentors"]].map(([value, label, detail]) => <div key={label}><dt>{value}</dt><dd>{label}<br />{detail}</dd></div>)}</dl></div></section>
    <section className="startup-process"><div className="page-shell"><div><p className="startup-eyebrow">How It Works</p><h2>From Idea to Impact</h2></div><ol>{steps.map(({icon: Icon, title, text}, index) => <li key={title}><span className="startup-step-icon"><Icon /></span><span className="startup-step-number">0{index + 1}</span><h3>{title}<br />{text}</h3>{index < 3 && <ArrowRight className="startup-step-arrow" />}</li>)}</ol></div></section>
    <section className="startup-commitment"><img src={team} alt="Indian startup founders collaborating with their team" width={1536} height={768} loading="lazy" className="startup-backdrop" /><div className="startup-team-fade" /><div className="page-shell"><div className="startup-commitment-copy"><p className="startup-eyebrow">Our Commitment</p><h2>A Stronger<br /><em>Startup India</em></h2><p>Empowering founders to build innovative businesses that create real value, jobs and opportunities for a better tomorrow.</p></div><div className="startup-community">{[{icon: FileText, title: "Investors", text: "Backed by visionary investors"}, {icon: Users, title: "Mentors", text: "Guided by industry experts"}, {icon: Handshake, title: "Community", text: "Supported by a growing ecosystem"}, {icon: Globe2, title: "Nationwide Impact", text: "Creating opportunities across India"}].map(({icon: Icon, title, text}) => <div key={title}><span className="startup-icon"><Icon /></span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div></div></section>
    <section id="startup-apply" className="startup-application"><div className="page-shell"><div><p className="startup-eyebrow">Start Your Journey</p><h2>Tell Us About<br /><em>Your Startup.</em></h2><p>Share your idea, business details and funding needs. Our team will review your enquiry and discuss the next steps.</p></div><FundingForm /></div></section>
    <section className="startup-disclaimer page-shell"><p>Funding assistance and partner introductions are subject to eligibility, assessment, documentation and funding-partner approval. Applying does not guarantee investment or disbursement.</p></section>
  </main>;
}