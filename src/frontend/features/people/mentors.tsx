import { Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, CalendarDays, MapPin, Quote, Target, Coins, ChartNoAxesCombined, Users, GraduationCap, Globe, Briefcase } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/frontend/components/site-chrome";
import { Button } from "@/frontend/components/ui/button";
import { Portrait, SectionHeading } from "@/frontend/features/investors/shared";
import { mentors as defaultMentors, type Mentor } from "./data";

export function MentorsPage({ mentors = defaultMentors }: { mentors?: Mentor[] }) {
  return <><SiteHeader /><main className="investor-page people-page">
    <section className="people-hero"><div className="page-shell">
      <p className="investor-eyebrow">Guide | Support | Grow Together</p>
      <h1>Our <em>Mentors</em> Network</h1>
      <h2 className="people-sub">Experience. Guidance. Growth.</h2>
      <p className="people-lead">Connecting founders and businesses with experienced mentors for strategy, sales, finance, technology, operations, branding and market expansion.</p>
      <dl className="people-stats">{[[Users, "50+", "Industry Mentors"], [Briefcase, "15+", "Business Domains"], [Globe, "8", "Global Markets"], [ChartNoAxesCombined, "100+", "Founder Sessions"]].map(([I, v, l]) => { const Icon = I as typeof Users; return <div key={String(l)}><Icon /><dt>{String(v)}</dt><dd>{String(l)}</dd></div>; })}</dl>
      <div className="people-actions"><Button asChild><a href="#mentors">Find a Mentor<ArrowRight /></a></Button><Button asChild variant="outline"><Link to="/contact">Become a Mentor</Link></Button></div>
    </div></section>
    <section id="mentors" className="page-shell people-section">
      <SectionHeading eyebrow="Our Mentors Network">Meet Our <em>Mentors</em></SectionHeading>
      <div className="people-mentor-grid">{mentors.map((m) => <Link key={m.slug} to="/our-mentors/$slug" params={{ slug: m.slug }} className="people-mentor-card">
        <Portrait index={m.portrait} name={m.name} />
        <div><span className="investor-sample">Sample Profile</span><h3>{m.name}</h3><p className="people-role">{m.title}</p>
          <ul>{m.focus.map((f) => <li key={f}><Target />{f}</li>)}<li><MapPin />{m.regions.join(" | ")}</li></ul>
          <span className="people-link">View Profile<ArrowRight /></span></div>
      </Link>)}</div>
    </section>
    <MentorCta />
  </main><SiteFooter /></>;
}

function MentorCta() {
  return <section className="people-cta"><div className="page-shell"><p className="investor-eyebrow">Let's Build Together</p><h2>Share Your Challenge.<br />Meet the Right Mentor.</h2><p>Get personalised guidance from experienced professionals to grow your business.</p><div className="people-actions"><Button asChild><Link to="/contact">Book a Session<ArrowRight /></Link></Button><Button asChild variant="outline"><Link to="/our-mentors">Explore All Mentors</Link></Button></div></div></section>;
}

export function MentorProfile({ mentor: m }: { mentor: Mentor }) {
  const [first, ...rest] = m.name.split(" ");
  const icons = [Target, Coins, ChartNoAxesCombined, Users];
  return <><SiteHeader /><main className="investor-page people-page">
    <div className="page-shell people-section">
      <nav className="investor-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><span>›</span><Link to="/our-mentors">Our Mentors</Link><span>›</span><b>{m.name}</b></nav>
      <section className="people-profile-hero">
        <div className="people-profile-photo"><Portrait index={m.portrait} name={m.name} large /></div>
        <div><p className="investor-eyebrow">Mentor Profile</p><h1>{first} <em>{rest.join(" ")}</em></h1><h2 className="people-sub">{m.title}</h2><p className="people-lead">{m.bio}</p>
          <p className="people-loc"><MapPin />{m.regions.join("  |  ")}</p>
          <div className="people-actions"><Button asChild><Link to="/contact">Connect With {first}<ArrowRight /></Link></Button><Button asChild variant="outline"><Link to="/contact"><CalendarDays />Book a Session</Link></Button></div></div>
      </section>
      <section className="people-split"><SectionHeading eyebrow="Areas of Expertise">Expertise That Creates <em>Real Impact</em></SectionHeading>
        <div className="people-tiles">{m.expertise.map((e, n) => { const I = icons[n % 4] ?? Target; return <article key={e.title}><span><I /></span><h3>{e.title}</h3><p>{e.text}</p></article>; })}</div></section>
      <section className="people-split"><SectionHeading eyebrow="Experience & Impact">A Track Record of Building <em>Successful Businesses</em></SectionHeading>
        <dl className="people-stats">{[[GraduationCap, m.years, "Years Experience"], [Users, m.guided, "Businesses Guided"], [ChartNoAxesCombined, m.investments, "Investments Supported"], [Globe, m.countries, "Countries Worked In"]].map(([I, v, l]) => { const Icon = I as typeof Users; return <div key={String(l)}><Icon /><dt>{String(v)}</dt><dd>{String(l)}</dd></div>; })}</dl></section>
      <section className="people-split"><SectionHeading eyebrow="Journey">From Experience to <em>Lasting Impact</em></SectionHeading>
        <ol className="people-timeline">{m.journey.map((j) => <li key={j.year}><b>{j.year}</b><p>{j.text}</p></li>)}</ol></section>
      <blockquote className="people-quote"><Quote /><p>“{m.quote}”</p><footer>— {m.name}</footer></blockquote>
      <p className="investor-disclaimer"><BadgeCheck /> Mentor profiles and figures shown are illustrative samples.</p>
    </div>
    <MentorCta />
  </main><SiteFooter /></>;
}
