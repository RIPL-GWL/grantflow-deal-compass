import { Link } from "@tanstack/react-router";
import { ArrowRight, Compass, Handshake, TrendingUp } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/frontend/components/site-chrome";
import { Button } from "@/frontend/components/ui/button";
import { EmailForm } from "@/frontend/components/forms/email-form";
import { contactFields } from "@/frontend/content/forms";
import coverSrcAsset from "@/assets/svc-partnerships.webp.asset.json";
const coverSrc = coverSrcAsset.url;
const cover = { url: coverSrc };

type CommunityPageProps = { title: string; description: string; kind: "investors" | "mentors" | "startup" | "scale" };

export function CommunityPage({ title, description, kind }: CommunityPageProps) {
  const family = kind === "investors" || kind === "mentors";
  const stages = kind === "scale" ? [
    { icon: Compass, title: "Choose Your Next Market", text: "Discuss your current reach, target locations and distribution priorities." },
    { icon: Handshake, title: "Build the Right Network", text: "Explore retailer, distributor and manufacturer partnerships suited to your brand." },
    { icon: TrendingUp, title: "Plan Sustainable Growth", text: "Review funding readiness, sales opportunities and your next expansion steps." },
  ] : [
    { icon: Compass, title: "Share Your Business", text: "Tell us about your idea, products, current stage and the market you want to serve." },
    { icon: Handshake, title: "Explore a Partnership", text: "Discuss market access, retail connections and the support your startup needs." },
    { icon: TrendingUp, title: "Prepare for Growth", text: "Understand your valuation and explore funding and expansion pathways." },
  ];
  return <div className="min-h-screen bg-background">
    <SiteHeader />
    <main>
      <section className="community-cover dark-surface">
        <img src={cover.url} alt="Business partners discussing market growth" fetchPriority="high" />
        <div className="page-shell"><span className="royal-label">{family ? "Our Family" : "Startups and Investments"}</span><h1 className="mt-5">{title}</h1><p>{description}</p></div>
      </section>
      <section className="page-shell community-body">
        {family ? <>
          <h2 className="text-3xl">{kind === "investors" ? "Investor Relationships" : "Guidance and Experience"}</h2>
          <p>{kind === "investors" ? "Investor profiles have not been provided for publication yet. For investment and strategic partnership enquiries, connect with Rishishwar Industry." : "Mentor profiles have not been provided for publication yet. If you would like to contribute your experience in business, manufacturing or market expansion, get in touch."}</p>
          <Button asChild className="mt-8"><Link to="/contact">{kind === "investors" ? "Discuss an Investment" : "Connect with Us"}<ArrowRight /></Link></Button>
        </> : <>
          <h2 className="text-3xl">{kind === "scale" ? "Your Next Stage of Growth" : "From Idea to Market"}</h2>
          <div className="community-steps">{stages.map(({ icon: Icon, title: heading, text }) => <article key={heading}><Icon /><h3>{heading}</h3><p>{text}</p></article>)}</div>
          <div className="flex flex-wrap gap-3 mb-12"><Button asChild><Link to="/business-valuation-calculator">Business Valuation Calculator<ArrowRight /></Link></Button><Button asChild variant="outline"><Link to="/fund-your-startup">Explore Funding</Link></Button></div>
          <h2 className="text-2xl mb-6">Tell Us About Your Startup</h2>
          <EmailForm fields={contactFields} subject={title} intro="Startup partnership enquiry" submitLabel="Submit Enquiry" />
          <p className="mt-6 text-sm text-muted-foreground">Support and funding are subject to business assessment, eligibility and partner approval.</p>
        </>}
      </section>
    </main>
    <SiteFooter />
  </div>;
}