import { Link } from "@tanstack/react-router";
import {
  ArrowLeft, ArrowRight, Boxes, Car, CheckCircle2, Cog, Factory, FlaskConical, Gem, GraduationCap, Handshake,
  HeartPulse, Leaf, Mountain, Pill, ShieldCheck, Shirt, ShoppingBag, Sprout, Stethoscope, Store, TrendingUp,
  Truck, Users, Wine, Globe2, Milk, Building2,
} from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import heroAssetSrc from "@/frontend/assets/australia-market/hero.webp";
const heroAsset = { url: heroAssetSrc };
import indiaExportsImgSrcAsset from "@/assets/au-india-exports.webp.asset.json";
const indiaExportsImgSrc = indiaExportsImgSrcAsset.url;
const indiaExportsImg = { url: indiaExportsImgSrc };
import auExportsImgSrcAsset from "@/assets/au-australia-exports.webp.asset.json";
const auExportsImgSrc = auExportsImgSrcAsset.url;
const auExportsImg = { url: auExportsImgSrc };
import portImgSrcAsset from "@/assets/au-port.webp.asset.json";
const portImgSrc = portImgSrcAsset.url;
const portImg = { url: portImgSrc };

const presence = [
  { icon: Boxes, t: "Import & Export Opportunities" },
  { icon: Store, t: "Retail & Distribution Partnerships" },
  { icon: ShoppingBag, t: "FMCG & Consumer Goods" },
  { icon: HeartPulse, t: "Healthcare & Wellness Products" },
  { icon: Cog, t: "Industrial & Engineering Supplies" },
  { icon: Handshake, t: "Long-Term Business Collaboration" },
];
const indiaToAu = [
  { icon: ShoppingBag, t: "FMCG & Household Products", s: "Dishwash, Cleaners, Personal Care" },
  { icon: Shirt, t: "Textiles & Garments" },
  { icon: Pill, t: "Pharmaceuticals & Healthcare Products" },
  { icon: Cog, t: "Engineering Goods & Machinery" },
  { icon: Leaf, t: "Food Products", s: "Spices, Tea, Rice, Processed Foods" },
  { icon: FlaskConical, t: "Chemicals & Industrial Products" },
  { icon: Car, t: "Auto Components" },
  { icon: Sprout, t: "Agricultural Products", s: "Organic & Processed" },
];
const auToIndia = [
  { icon: Mountain, t: "Coal & Mineral Resources" },
  { icon: Gem, t: "Metals", s: "Gold, Copper, Aluminium, Iron Ore" },
  { icon: Sprout, t: "Agricultural Products", s: "Wool, Pulses, Lentils" },
  { icon: Milk, t: "Dairy Products" },
  { icon: Wine, t: "Wine & Beverages" },
  { icon: GraduationCap, t: "Education Services" },
  { icon: Cog, t: "Advanced Technology & Machinery" },
  { icon: Stethoscope, t: "Healthcare & Medical Devices" },
];
const strengths = [
  { icon: ShieldCheck, t: "High Quality Indian Products", s: "Trusted & Certified Supply" },
  { icon: TrendingUp, t: "Growing Demand in Australia", s: "Expanding Market Opportunities" },
  { icon: Truck, t: "Reliable Supply Chain", s: "On-Time & Efficient Delivery" },
  { icon: Leaf, t: "Sustainable Business Growth", s: "Long-Term Partnerships" },
];
const advantages = ["Large & Growing Market", "Strong Demand for Indian FMCG", "Stable Trade Relations (ECTA in force since 29 Dec 2022)", "Opportunities in Retail & Distribution", "Focus on Sustainable & Eco-Friendly Products"];
const stats = [
  { icon: Globe2, t: "Global Presence", s: "8 Countries" },
  { icon: Users, t: "7000+", s: "RETAIL PARTNERS" },
  { icon: Factory, t: "Supporting", s: "Small Manufacturers & SHGs" },
  { icon: Building2, t: "Expanding", s: "Business Opportunities" },
];

function ExportCard({ title, items, img, alt }: { title: string; items: { icon: typeof Cog; t: string; s?: string }[]; img: string; alt: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h2 className="flex items-center gap-2 text-lg font-bold uppercase tracking-wide text-foreground">{title} <ArrowRight className="size-5 text-primary" /></h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_180px]">
        <ul className="space-y-3">
          {items.map(({ icon: Icon, t, s }) => (
            <li key={t} className="flex items-center gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-full border border-border bg-secondary text-primary"><Icon className="size-4" /></span>
              <span className="text-sm text-foreground">{t}{s && <span className="block text-xs text-muted-foreground">({s})</span>}</span>
            </li>
          ))}
        </ul>
        <img src={img} alt={alt} loading="lazy" width={768} height={1024} className="hidden h-full w-full rounded-xl object-cover sm:block" />
      </div>
    </div>
  );
}

export function AustraliaMarketPage() {
  return (
    <>
      <section className="relative">
        <img src={heroAsset.url} alt="Australia — From India to Australia, Sydney Opera House and Harbour Bridge" fetchPriority="high" width={1983} height={793} className="block h-auto w-full" />
        <Link to="/global-presence" className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-card/90 px-3 py-1.5 text-sm font-semibold text-foreground shadow">
          <ArrowLeft className="size-4" /> Global Presence
        </Link>
      </section>

      <section className="page-shell py-10">
        <div className="rounded-2xl bg-ink p-6 text-ink-foreground sm:p-8">
          <p className="royal-label">Our presence in</p>
          <h1 className="mt-1 text-3xl font-bold tracking-wide">AUSTRALIA</h1>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {presence.map(({ icon: Icon, t }) => (
              <li key={t} className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-ink-foreground/10 text-primary"><Icon className="size-5" /></span>
                <span className="text-sm">{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <ExportCard title="India exports to Australia" items={indiaToAu} img={indiaExportsImg.url} alt="Indian spices, textiles, care products, medicines, machinery and rice" />
          <ExportCard title="Australia exports to India" items={auToIndia} img={auExportsImg.url} alt="Coal, metals, wool, cheese, wine, education and medical devices" />
        </div>

        <div className="mt-8 grid gap-4 rounded-2xl border border-border bg-card p-6 sm:grid-cols-2 lg:grid-cols-4">
          {strengths.map(({ icon: Icon, t, s }) => (
            <div key={t} className="flex items-center gap-3">
              <Icon className="size-9 shrink-0 text-primary" />
              <div><h3 className="text-sm font-bold uppercase text-foreground">{t}</h3><p className="text-xs text-muted-foreground">{s}</p></div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid overflow-hidden rounded-2xl bg-ink text-ink-foreground lg:grid-cols-[1.3fr_1fr]">
          <div className="relative min-h-[260px]">
            <img src={portImg.url} alt="Cargo ship sailing past the Sydney skyline at sunset" loading="lazy" width={1536} height={864} className="absolute inset-0 size-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-ink/80 to-transparent" />
            <h2 className="relative max-w-xs p-8 pt-24 text-2xl font-extrabold uppercase leading-tight">Connecting India & Australia for a brighter tomorrow</h2>
          </div>
          <div className="p-8">
            <h2 className="text-xl font-bold uppercase">Key Advantages</h2>
            <ul className="mt-5 space-y-3">
              {advantages.map((a) => <li key={a} className="flex items-start gap-3 text-sm"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />{a}</li>)}
            </ul>
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ icon: Icon, t, s }) => (
            <div key={s} className="flex items-center gap-3">
              <Icon className="size-10 shrink-0 text-primary" />
              <div className="text-sm font-bold uppercase text-foreground">{t}<span className="block font-medium text-muted-foreground">{s}</span></div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-5 rounded-2xl border border-border bg-secondary p-8 md:flex-row md:items-center">
          <div>
            <h2 className="text-xl font-bold uppercase tracking-widest text-foreground">Partner with us</h2>
            <p className="mt-1 text-sm text-muted-foreground">Explore Trade, Distribution & Business Opportunities in Australia.</p>
          </div>
          <Button asChild size="lg"><Link to="/contact">Enquire Now <ArrowRight /></Link></Button>
          <p className="text-sm text-muted-foreground">Let's Build a Stronger, Healthier & Sustainable Future Together.</p>
        </div>
      </section>
    </>
  );
}
