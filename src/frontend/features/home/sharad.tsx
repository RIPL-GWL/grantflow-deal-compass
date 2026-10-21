import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Building2, Globe, Handshake, Store } from "lucide-react";
import hero from "@/assets/sharad-hero.webp";
import products from "@/assets/sharad-products.webp";
import guide from "@/assets/sharad-guide.webp";
import growth from "@/assets/sharad-growth.webp";
import commitment from "@/assets/sharad-commitment.webp";
import { Button } from "@/frontend/components/ui/button";
import { RetailNetworkIndicator, type NetworkSelection } from "@/frontend/components/retail-network-indicator";
import { useRetailNetwork, networkFigures } from "@/frontend/data/retail-network";
import { services, steps } from "./content";
import { ServiceGuide } from "./service-guide";

export function SharadHome() {
  const [selection, setSelection] = useState<NetworkSelection>({ state: "", area: "", district: "" });
  const [showGuide, setShowGuide] = useState(false);
  const retailNetwork = useRetailNetwork();
  const { storeFigure: totalStoreFigure, districtFigure } = networkFigures(retailNetwork);
  const count = retailNetwork.filter((row) => (!selection.state || row.state === selection.state) && (!selection.area || row.area === selection.area) && (!selection.district || row.district === selection.district)).reduce((sum, row) => sum + row.stores, 0);
  return <div className="navratri-home sharad-home">
    <section className="festival-hero">
      <img src={hero} alt="Full moon over a river with a silver bowl of kheer, diyas and jasmine on a terrace for Sharad Purnima" className="festival-backdrop" width={1536} height={640} fetchPriority="high"/>
      <div className="page-shell festival-hero-inner"><div className="festival-hero-copy">
        <p className="festival-eyebrow">॥ शरद पूर्णिमा की शुभकामनाएँ ॥</p>
        <h1><span>We Build Markets.</span><br/>You Grow Your Sales.</h1>
        <p className="festival-intro"><strong>Rishishwar Industry</strong> connects FMCG manufacturers with retail networks, distributors and international opportunities.</p>
        <div className="festival-actions"><Button asChild variant="festival" size="lg"><Link to="/manufacturers">For Manufacturers <ArrowRight/></Link></Button><Button asChild variant="festivalOutline" size="lg"><Link to="/our-services">Explore Services <ArrowRight/></Link></Button></div>
        <div className="festival-greeting"><span>Happy Sharad Purnima</span><p>May the full moon's light bring prosperity,<br/>clarity and complete growth to your business.</p></div>
      </div></div>
    </section>
    <section className="festival-stats"><dl className="page-shell">{[[Store,totalStoreFigure,"Retail Stores"],[Building2,districtFigure,"Districts Covered"],[Globe,"8","Countries"],[Handshake,"End-to-End","Support"]].map(([Icon,value,label]) => { const StatIcon = Icon as typeof Store; return <div key={String(label)}><StatIcon/><div><dt>{String(value)}</dt><dd>{String(label)}</dd></div></div>; })}</dl></section>
    <div className="festival-network"><img src={products} alt="" className="festival-backdrop" loading="lazy" width={1536} height={768}/><RetailNetworkIndicator selection={selection} onChange={setSelection} count={count}/></div>
    <section className="festival-capabilities"><img src={products} alt="Moonlit kirana store with FMCG products, jasmine and diyas" className="festival-backdrop" loading="lazy" width={1536} height={768}/><div className="page-shell relative"><div className="festival-capabilities-copy"><h2>Complete market access<br/>for ambitious FMCG brands.</h2><p>Like the full moon, we bring complete reach — the right network, partnerships and support for every market.</p></div><div className="festival-services">{services.map(({icon:Icon,title,text,to}) => <Link key={title} to={to} className="festival-service"><span className="festival-icon"><Icon/></span><h3>{title}</h3><p>{text}</p></Link>)}</div></div></section>
    <section className="festival-guide"><img src={guide} alt="Friendly AI business assistant under the full moon" className="festival-backdrop" loading="lazy" width={1536} height={640}/><div className="page-shell relative"><h2>AI Business Guide</h2><p>Not sure which service fits your next move?<br/>Our AI Business Guide can help you find the right solution<br/>based on your business goals.</p><Button variant="festivalCream" size="lg" onClick={() => setShowGuide((value) => !value)} aria-expanded={showGuide} aria-controls="festival-guide-form">{showGuide ? "Close Business Guide" : "Try AI Business Guide"} <ArrowRight/></Button></div></section>
    {showGuide && <div id="festival-guide-form"><ServiceGuide/></div>}
    <section className="festival-process"><div className="page-shell"><h2>The Rishishwar Industry Standard</h2><p>A simple and transparent process to take your brand from <br/>manufacturing to larger markets.</p><ol>{steps.map(({icon:Icon,title,text},index) => <li key={title}><span className="festival-icon"><Icon/></span><h3>{title}</h3><p>{text}</p>{index < steps.length - 1 && <ArrowRight className="festival-step-arrow"/>}</li>)}</ol></div></section>
    <section className="festival-growth"><img src={growth} alt="Warehouse and delivery trucks under the full moon" className="festival-backdrop" loading="lazy" width={1536} height={640}/><div className="page-shell relative"><h2>Built for Long-Term Growth</h2><p>Trusted by manufacturers and partners to create stronger brands,<br/>wider reach and sustainable growth.</p><Button asChild variant="festival" size="lg"><Link to="/our-services">Our Services <ArrowRight/></Link></Button></div></section>
    <section className="festival-commitment"><img src={commitment} alt="Business partners shaking hands on a moonlit terrace" className="festival-backdrop" loading="lazy" width={1536} height={640}/><div className="page-shell relative"><h2>Your Growth. Our Commitment.</h2><p>Let's work together to build stronger brands, reach more markets <br/>and create new opportunities.</p><Button asChild variant="festivalCream" size="lg"><Link to="/partner-with-us">Get Started Today <ArrowRight/></Link></Button></div></section>
  </div>;
}
