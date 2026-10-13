import { Link } from "@tanstack/react-router";
import { ArrowRight, Lightbulb, Users, Handshake, UserRoundCheck, Coins, TrendingUp, Network, FileText, Search, Settings, Rocket, CheckCircle2, HeartPulse, GraduationCap, Leaf, Wheat, Truck, Factory, Plane, Package, Target } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { isNavratri, useSiteTheme } from "@/frontend/lib/site-theme";
import heroSrcAsset from "@/assets/ripl-startup-hero.webp.asset.json";
const heroSrc = heroSrcAsset.url;
const hero = { url: heroSrc };
import enterpriseSrcAsset from "@/assets/ripl-startup-enterprise.webp.asset.json";
const enterpriseSrc = enterpriseSrcAsset.url;
const enterprise = { url: enterpriseSrc };
import transformationSrcAsset from "@/assets/ripl-startup-transformation.webp.asset.json";
const transformationSrc = transformationSrcAsset.url;
const transformation = { url: transformationSrc };
import teamAsset from "@/assets/startup-team.webp.asset.json";
const team = teamAsset.url;
import summitAsset from "@/assets/ripl-startup-summit.webp.asset.json";
const summit = summitAsset.url;

const stats = [
  { icon: Lightbulb, value: "500+", label: "Startup Ideas", detail: "Evaluated" },
  { icon: Users, value: "120+", label: "Startups", detail: "Supported" },
  { icon: Handshake, value: "50+", label: "Investor", detail: "Connections" },
  { icon: UserRoundCheck, value: "20+", label: "Industry", detail: "Mentors" },
];
const pathways = [
  { icon: Coins, title: "Funding Pathways", text: "Connect with investors, venture funds and strategic partners for early and growth stage funding.", to: "/fund-your-startup" },
  { icon: TrendingUp, title: "Growth Strategy", text: "Business research, market analysis and go-to-market strategy to accelerate your growth.", to: "/scale-your-startup" },
  { icon: Network, title: "Sales & Market Access", text: "Leverage our pan-India retail, distributor and institutional network to scale faster.", to: "/our-services" },
  { icon: Users, title: "Mentorship", text: "Learn from industry experts, successful entrepreneurs and domain specialists.", to: "/our-mentors" },
] as const;
const journey = [
  { icon: FileText, title: "Share Your Idea", text: "Tell us about your vision, product and goals." },
  { icon: Search, title: "Evaluate & Refine", text: "Our team analyses your idea and helps refine the business model." },
  { icon: Settings, title: "Build the Roadmap", text: "Get a customized plan for funding, product, market and growth." },
  { icon: Rocket, title: "Launch & Scale", text: "Execute with our support and unlock our national and global network." },
];
const sectors = [
  { icon: Package, title: "FMCG & Consumer Products" }, { icon: HeartPulse, title: "Healthcare & Wellness" },
  { icon: GraduationCap, title: "Education & Skilling" }, { icon: Leaf, title: "Clean Tech & Sustainability" },
  { icon: Wheat, title: "Agri & Food Processing" }, { icon: Truck, title: "Technology & IT Solutions" },
  { icon: Factory, title: "Manufacturing & Industrial" }, { icon: Plane, title: "Travel & Tourism" },
];
function Apply({ children = "Apply Now" }: { children?: React.ReactNode }) {
  return <Button asChild size="lg" className="startup-button"><Link to="/fund-your-startup" hash="startup-apply">{children}<ArrowRight /></Link></Button>;
}
function Talk() {
  return <Button asChild variant="outline" size="lg" className="startup-talk"><Link to="/contact">Talk to Our Team</Link></Button>;
}
export function RiplStartupPageContent() {
  const seasonal = isNavratri(useSiteTheme());
  return <main className={`startup-page ripl-startup ${seasonal ? "startup-seasonal" : ""}`}>
    <section className="ripl-hero">
      <img className="startup-backdrop" src={hero.url} alt="Indian startup founders with a connected India and growing skyline" width={1920} height={768} fetchPriority="high" />
      <div className="ripl-hero-fade" />
      <div className="page-shell ripl-hero-inner">
        <div className="ripl-hero-copy"><p className="startup-eyebrow">STARTUP WITH RIPL</p><h1>Build with <em>RIPL.</em><br />Grow with <em>Purpose.</em></h1>
          <p className="ripl-intro">We empower visionary founders with funding, mentorship, strategic support and nationwide market access to turn bold ideas into successful businesses.</p>
          <div className="startup-actions"><Apply>Apply for Startup Support</Apply><Talk /></div>
          {seasonal && <p className="startup-greeting">॥ Happy Navratri · New Beginnings, New Possibilities ॥</p>}
          <dl className="ripl-stats">{stats.map(({ icon: Icon, value, label, detail }) => <div key={label}><Icon /><dt>{value}</dt><dd>{label}<br />{detail}</dd></div>)}</dl>
        </div>
        <p className="ripl-hero-note">Ideas<br />Funding<br />Mentorship<br />Market Access</p>
      </div>
    </section>
    <section className="ripl-enterprise ripl-photo-band">
      <img className="startup-backdrop" src={enterprise.url} alt="Founder looking toward a connected India and the road to business growth" width={1920} height={640} loading="lazy" />
      <div className="ripl-band-fade" /><div className="page-shell"><div className="ripl-band-copy"><h2>From Idea to <em>Enterprise</em></h2><p>RIPL partners with early-stage and growth-stage startups to provide the right combination of funding, strategy, mentorship and market access. We help you validate, build, scale and create a lasting impact.</p>
        <div className="ripl-mini-steps">{[{ icon: Lightbulb, title: "Validate Your Idea" }, { icon: Target, title: "Build Your Product" }, { icon: Coins, title: "Access Funding" }, { icon: Network, title: "Scale with Our Network" }].map(({ icon: Icon, title }) => <div key={title}><Icon /><span>{title}</span></div>)}</div><Apply>Start Your Journey</Apply></div>
        <div className="ripl-signposts" aria-hidden="true"><span>IDEA</span><span>STRATEGY</span><span>MARKET ACCESS</span><span>GROWTH</span></div>
      </div>
    </section>
    <section className="ripl-pathways"><div className="page-shell"><header className="ripl-section-heading"><h2>More Than <em>Funding</em></h2><p>A complete ecosystem to help startups grow, scale and succeed.</p></header><div className="ripl-pathway-grid">{pathways.map(({ icon: Icon, title, text, to }) => <article key={title}><span className="ripl-service-icon"><Icon /></span><h3>{title}</h3><p>{text}</p><Button asChild variant="link"><Link to={to}>Learn More<ArrowRight /></Link></Button></article>)}</div></div></section>
    <section className="ripl-transformation ripl-photo-band"><img className="startup-backdrop" src={transformation.url} alt="Entrepreneur portrait with a city and staircase representing business transformation" width={1920} height={642} loading="lazy" /><div className="ripl-band-fade" /><div className="page-shell"><div className="ripl-band-copy"><h2>Business Transformation<br />for a <em>Bigger Tomorrow</em></h2><p>From refining your business model to scaling operations, we work closely with founders at every stage of their transformation journey.</p><Button asChild size="lg" className="startup-button"><Link to="/scale-your-startup">Explore Our Approach<ArrowRight /></Link></Button></div></div></section>
    <section className="ripl-journey"><div className="page-shell"><header className="ripl-section-heading"><h2>The <em>RIPL</em> Startup Journey</h2><p>A simple, structured process to turn your idea into a successful business.</p></header><ol>{journey.map(({ icon: Icon, title, text }, index) => <li key={title}><span className="ripl-journey-number">0{index + 1}</span><Icon /><h3>{title}</h3><p>{text}</p>{index < 3 && <ArrowRight className="ripl-journey-arrow" />}</li>)}</ol></div></section>
    <section className="ripl-founders"><div className="page-shell"><div className="ripl-founder-copy"><h2>For Founders With <em>Ambition</em></h2><p>We work with passionate founders who are solving real problems and building for a better tomorrow.</p><ul>{["Early-stage and growth-stage startups", "Innovative products and services", "Scalable business models", "Commitment to create real impact"].map(text => <li key={text}><CheckCircle2 />{text}</li>)}</ul><Apply /></div><div className="ripl-founder-photo"><img src={team} alt="Indian founders collaborating on their startup" width={1536} height={768} loading="lazy" /><ul>{[{ icon: Lightbulb, label: "Startups" }, { icon: Rocket, label: "Innovators" }, { icon: Target, label: "Changemakers" }, { icon: Users, label: "Problem Solvers" }].map(({ icon: Icon, label }) => <li key={label}><Icon />{label}</li>)}</ul></div></div></section>
    <section className="ripl-ready"><img className="startup-backdrop" src={summit} alt="Startup founder celebrating on a mountain summit at sunrise" width={1920} height={640} loading="lazy" /><div className="page-shell"><h2>Ready to Build With RIPL?</h2><p>Get access to funding, mentorship, market opportunities and a powerful network to grow your startup.</p><div className="startup-actions"><Talk /><Apply /></div></div></section>
    <section className="ripl-sectors"><div className="page-shell"><h2>Our Focus Sectors</h2><div>{sectors.map(({ icon: Icon, title }) => <article key={title}><Icon /><h3>{title}</h3></article>)}</div></div></section>
  </main>;
}