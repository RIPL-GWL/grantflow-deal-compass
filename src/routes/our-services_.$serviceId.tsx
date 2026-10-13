import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/frontend/components/site-chrome";
import { services, howWeWork } from "@/frontend/features/our-services/content";
import retailImgPointerSrcAsset from "@/assets/svc-retail-network.webp.asset.json";
const retailImgPointerSrc = retailImgPointerSrcAsset.url;
const retailImgPointer = { url: retailImgPointerSrc };
const retailImg = retailImgPointer.url;
import adsImgPointerSrcAsset from "@/assets/svc-shop-advertising.webp.asset.json";
const adsImgPointerSrc = adsImgPointerSrcAsset.url;
const adsImgPointer = { url: adsImgPointerSrc };
const adsImg = adsImgPointer.url;
import distImgPointerSrcAsset from "@/assets/svc-distributor-dealer.webp.asset.json";
const distImgPointerSrc = distImgPointerSrcAsset.url;
const distImgPointer = { url: distImgPointerSrc };
const distImg = distImgPointer.url;
import domesticImgPointerSrcAsset from "@/assets/svc-domestic-expansion.webp.asset.json";
const domesticImgPointerSrc = domesticImgPointerSrcAsset.url;
const domesticImgPointer = { url: domesticImgPointerSrc };
const domesticImg = domesticImgPointer.url;
import exportImgPointerSrcAsset from "@/assets/svc-import-export.webp.asset.json";
const exportImgPointerSrc = exportImgPointerSrcAsset.url;
const exportImgPointer = { url: exportImgPointerSrc };
const exportImg = exportImgPointer.url;
import fundingImgPointerSrcAsset from "@/assets/svc-funding-support.webp.asset.json";
const fundingImgPointerSrc = fundingImgPointerSrcAsset.url;
const fundingImgPointer = { url: fundingImgPointerSrc };
const fundingImg = fundingImgPointer.url;
import partnerImgPointerSrcAsset from "@/assets/svc-partnerships.webp.asset.json";
const partnerImgPointerSrc = partnerImgPointerSrcAsset.url;
const partnerImgPointer = { url: partnerImgPointerSrc };
const partnerImg = partnerImgPointer.url;

const images: Record<string, string> = {
  "retail-network": retailImg,
  "shop-advertising": adsImg,
  "distributor-dealer": distImg,
  "domestic-expansion": domesticImg,
  "import-export": exportImg,
  "funding-support": fundingImg,
  partnerships: partnerImg,
};

const extraLinks: Record<string, { to: string; label: string }> = {
  "shop-advertising": { to: "/advertise-your-product", label: "Explore Advertising" },
  "funding-support": { to: "/fund-your-business", label: "Funding Details" },
  partnerships: { to: "/retailer-partner", label: "Retailer Program" },
};

export const Route = createFileRoute("/our-services_/$serviceId")({
  loader: ({ params }) => {
    const service = services.find((s) => s.id === params.serviceId);
    if (!service) throw notFound();
    return { id: service.id };
  },
  head: ({ loaderData }) => {
    const s = loaderData && services.find((x) => x.id === loaderData.id);
    if (!s) return { meta: [{ title: "Service not found — Rishishwar Industry" }, { name: "robots", content: "noindex" }] };
    const title = `${s.title} — Rishishwar Industry`;
    return {
      meta: [
        { title },
        { name: "description", content: s.text.slice(0, 158) },
        { property: "og:title", content: title },
        { property: "og:description", content: s.tagline },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: ServiceNotFound,
  component: ServicePage,
});

function ServiceNotFound() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 pb-24 pt-32 text-center">
        <h1 className="text-3xl">Service not found</h1>
        <Link to="/our-services" className="mt-6 inline-block text-primary">View all services</Link>
      </main>
      <SiteFooter />
    </div>
  );
}

function ServicePage() {
  const { id } = Route.useLoaderData();
  const index = services.findIndex((s) => s.id === id);
  const s = services[index]!;
  const Icon = s.icon;
  const others = services.filter((x) => x.id !== id);
  const extra = extraLinks[id];

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="lux-page">
        <section className="relative min-h-[78vh] overflow-hidden">
          <img src={images[id]} alt={s.title} width={1600} height={912} className="absolute inset-0 h-full w-full object-cover" />
          <div className="lux-hero-shade absolute inset-0" />
          <div className="relative mx-auto flex min-h-[78vh] max-w-7xl flex-col justify-center px-6 pb-16 pt-32">
            <Link to="/our-services" className="lux-gold mb-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em]">
              <ArrowLeft className="size-4" aria-hidden="true" /> All Services
            </Link>
            <p className="lux-gold text-xs uppercase tracking-[0.35em]">Service {String(index + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}</p>
            <h1 className="mt-5 max-w-3xl text-5xl leading-[1.05] sm:text-7xl">{s.title}</h1>
            <div className="lux-rule mt-8 w-40" />
            <p className="lux-gold mt-6 text-xl italic" style={{ fontFamily: '"Cormorant Garamond", serif' }}>{s.tagline}</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/contact" className="lux-btn">Enquire Now <ArrowRight className="size-4" aria-hidden="true" /></Link>
              {extra && <Link to={extra.to} className="lux-btn lux-btn-ghost">{extra.label}</Link>}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-14 px-6 py-24 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <span className="lux-card inline-flex size-16 items-center justify-center rounded-full">
              <Icon className="lux-gold size-7" aria-hidden="true" />
            </span>
            <h2 className="mt-8 text-4xl sm:text-5xl">The <span className="lux-gold italic">Experience</span></h2>
            <p className="lux-muted mt-6 text-lg leading-relaxed">{s.text}</p>
          </div>
          <ul className="space-y-4">
            {s.points.map((p, i) => (
              <li key={p} className="lux-card flex gap-6 p-6">
                <span className="lux-gold text-3xl" style={{ fontFamily: '"Cormorant Garamond", serif' }}>{String(i + 1).padStart(2, "0")}</span>
                <span className="self-center leading-relaxed">{p}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="lux-rule mx-auto max-w-5xl" />

        <section className="mx-auto max-w-7xl px-6 py-24">
          <p className="lux-gold text-center text-xs uppercase tracking-[0.35em]">Our Process</p>
          <h2 className="mt-4 text-center text-4xl sm:text-5xl">How We Work</h2>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {howWeWork.map(({ icon: StepIcon, step, title, text }) => (
              <div key={step} className="lux-card p-7">
                <div className="flex items-center justify-between">
                  <StepIcon className="lux-gold size-6" aria-hidden="true" />
                  <span className="lux-gold text-2xl" style={{ fontFamily: '"Cormorant Garamond", serif' }}>{step}</span>
                </div>
                <h3 className="mt-6 text-2xl">{title}</h3>
                <p className="lux-muted mt-3 text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-24">
          <h2 className="text-3xl sm:text-4xl">Explore Other <span className="lux-gold italic">Services</span></h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((o) => (
              <Link key={o.id} to="/our-services/$serviceId" params={{ serviceId: o.id }} className="lux-card group block overflow-hidden">
                <img src={images[o.id]} alt={o.title} loading="lazy" width={1600} height={912} className="aspect-[16/9] w-full object-cover opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-100" />
                <div className="p-6">
                  <h3 className="text-2xl">{o.title}</h3>
                  <p className="lux-muted mt-2 text-sm">{o.tagline}</p>
                  <span className="lux-gold mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em]">Discover <ArrowRight className="size-3.5" aria-hidden="true" /></span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="lux-card mx-6 mb-24 px-6 py-16 text-center sm:mx-auto sm:max-w-5xl">
          <h2 className="text-4xl sm:text-5xl">Ready to Begin?</h2>
          <p className="lux-muted mx-auto mt-4 max-w-xl">Share your requirement and our team will get back to you with the right route for your brand.</p>
          <Link to="/contact" className="lux-btn mt-8">Get in Touch <ArrowRight className="size-4" aria-hidden="true" /></Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
