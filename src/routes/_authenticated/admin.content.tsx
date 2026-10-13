import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { services as baseServices } from "@/frontend/features/our-services/content";
import { countries as baseCountries } from "@/frontend/features/global-presence/content";
import {
  defaultFaq, defaultPricing, fetchSiteContent, resetSiteContent, saveSiteContent,
  type CountryEdit, type PricingEdit, type ServiceEdit, type SiteContent, type SiteContentKey,
} from "@/lib/site-content";
import type { FaqGroup } from "@/lib/knowledge/business-facts";

export const Route = createFileRoute("/_authenticated/admin/content")({
  head: () => ({ meta: [{ title: "Website Content — RIPL Admin" }, { name: "robots", content: "noindex" }] }),
  component: ContentPage,
});

const defaults: { [K in SiteContentKey]: () => SiteContent[K] } = {
  services: () => baseServices.map(({ id, title, tagline, text, points }) => ({ id, title, tagline, text, points: [...points] })),
  countries: () => baseCountries.map(({ slug, name, flag, note }) => ({ slug, name, flag, note })),
  faq: () => structuredClone(defaultFaq),
  pricing: () => structuredClone(defaultPricing),
};

const TABS: { key: SiteContentKey; label: string }[] = [
  { key: "services", label: "Services" },
  { key: "countries", label: "Countries" },
  { key: "faq", label: "FAQ" },
  { key: "pricing", label: "Pricing" },
];

const field = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground";

function ContentPage() {
  const [tab, setTab] = useState<SiteContentKey>("services");
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Website content</h1>
        <p className="text-sm text-muted-foreground">Edit services, countries, FAQ and pricing shown on the public site. Until you save, the site shows its built-in content.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <Button key={t.key} size="sm" variant={tab === t.key ? "default" : "outline"} onClick={() => setTab(t.key)}>{t.label}</Button>
        ))}
      </div>
      <Editor key={tab} k={tab} />
    </div>
  );
}

function Editor<K extends SiteContentKey>({ k }: { k: K }) {
  const qc = useQueryClient();
  const { data: saved, isLoading } = useQuery({ queryKey: ["site-content", k], queryFn: () => fetchSiteContent(k) });
  const [value, setValue] = useState<SiteContent[K] | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (!isLoading) setValue(saved ?? defaults[k]()); }, [isLoading, saved, k]);
  if (!value) return <p className="text-sm text-muted-foreground">Loading…</p>;

  async function run(fn: () => Promise<void>, msg: string) {
    setBusy(true);
    try { await fn(); await qc.invalidateQueries({ queryKey: ["site-content", k] }); toast.success(msg); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Could not save. Check that you have Admin or Content Editor role."); }
    finally { setBusy(false); }
  }

  return (
    <div className="space-y-4">
      {k === "services" && <ServicesForm value={value as ServiceEdit[]} onChange={(v) => setValue(v as SiteContent[K])} />}
      {k === "countries" && <CountriesForm value={value as CountryEdit[]} onChange={(v) => setValue(v as SiteContent[K])} />}
      {k === "faq" && <FaqForm value={value as FaqGroup[]} onChange={(v) => setValue(v as SiteContent[K])} />}
      {k === "pricing" && <PricingForm value={value as PricingEdit} onChange={(v) => setValue(v as SiteContent[K])} />}
      <div className="sticky bottom-0 flex gap-2 border-t bg-background py-3">
        <Button disabled={busy} onClick={() => run(() => saveSiteContent(k, value), "Saved — live on the site")}>Save changes</Button>
        <Button disabled={busy || !saved} variant="outline" onClick={() => { if (confirm("Restore the built-in content?")) void run(async () => { await resetSiteContent(k); setValue(defaults[k]()); }, "Restored built-in content"); }}>Restore original</Button>
        {saved && <span className="self-center text-xs text-muted-foreground">Showing your saved edit</span>}
      </div>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2 rounded-lg border bg-card p-4">{children}</div>;
}
function L({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block space-y-1 text-xs font-medium text-muted-foreground">{label}{children}</label>;
}

function ServicesForm({ value, onChange }: { value: ServiceEdit[]; onChange: (v: ServiceEdit[]) => void }) {
  const set = (i: number, p: Partial<ServiceEdit>) => onChange(value.map((s, j) => (j === i ? { ...s, ...p } : s)));
  return <>{value.map((s, i) => (
    <Card key={s.id}>
      <div className="flex items-center justify-between"><strong className="text-foreground">{s.title || s.id}</strong>
        <label className="text-sm text-muted-foreground"><input type="checkbox" checked={!!s.hidden} onChange={(e) => set(i, { hidden: e.target.checked })} /> Hide</label></div>
      <L label="Title"><input className={field} value={s.title} onChange={(e) => set(i, { title: e.target.value })} /></L>
      <L label="Tagline"><input className={field} value={s.tagline} onChange={(e) => set(i, { tagline: e.target.value })} /></L>
      <L label="Description"><textarea rows={3} className={field} value={s.text} onChange={(e) => set(i, { text: e.target.value })} /></L>
      <L label="Key points (one per line)"><textarea rows={4} className={field} value={s.points.join("\n")} onChange={(e) => set(i, { points: e.target.value.split("\n") })} /></L>
    </Card>
  ))}</>;
}

function CountriesForm({ value, onChange }: { value: CountryEdit[]; onChange: (v: CountryEdit[]) => void }) {
  const set = (i: number, p: Partial<CountryEdit>) => onChange(value.map((s, j) => (j === i ? { ...s, ...p } : s)));
  return <div className="grid gap-4 md:grid-cols-2">{value.map((c, i) => (
    <Card key={c.slug}>
      <div className="flex items-center justify-between"><strong className="text-foreground">{c.flag} {c.name}</strong>
        <label className="text-sm text-muted-foreground"><input type="checkbox" checked={!!c.hidden} onChange={(e) => set(i, { hidden: e.target.checked })} /> Hide</label></div>
      <L label="Name"><input className={field} value={c.name} onChange={(e) => set(i, { name: e.target.value })} /></L>
      <L label="Flag"><input className={field} value={c.flag} onChange={(e) => set(i, { flag: e.target.value })} /></L>
      <L label="Short note"><input className={field} value={c.note} onChange={(e) => set(i, { note: e.target.value })} /></L>
    </Card>
  ))}</div>;
}

function FaqForm({ value, onChange }: { value: FaqGroup[]; onChange: (v: FaqGroup[]) => void }) {
  const setG = (i: number, g: FaqGroup) => onChange(value.map((x, j) => (j === i ? g : x)));
  return <>
    <p className="text-xs text-muted-foreground">Edits apply to the Hindi FAQ. Other languages keep their automatic translation of the original FAQ.</p>
    {value.map((g, i) => (
      <Card key={i}>
        <div className="flex gap-2"><input className={field} value={g.title} onChange={(e) => setG(i, { ...g, title: e.target.value })} />
          <Button size="sm" variant="outline" onClick={() => confirm("Delete this whole section?") && onChange(value.filter((_, j) => j !== i))}>Delete section</Button></div>
        {g.items.map((it, n) => (
          <div key={n} className="space-y-1 border-t pt-2">
            <input className={field} placeholder="Question" value={it.q} onChange={(e) => setG(i, { ...g, items: g.items.map((x, m) => (m === n ? { ...x, q: e.target.value } : x)) })} />
            <textarea rows={2} className={field} placeholder="Answer" value={it.a} onChange={(e) => setG(i, { ...g, items: g.items.map((x, m) => (m === n ? { ...x, a: e.target.value } : x)) })} />
            <Button size="sm" variant="ghost" onClick={() => setG(i, { ...g, items: g.items.filter((_, m) => m !== n) })}>Remove question</Button>
          </div>
        ))}
        <Button size="sm" variant="outline" onClick={() => setG(i, { ...g, items: [...g.items, { q: "", a: "" }] })}>+ Add question</Button>
      </Card>
    ))}
    <Button variant="outline" onClick={() => onChange([...value, { title: "New section", items: [] }])}>+ Add section</Button>
  </>;
}

function PricingForm({ value, onChange }: { value: PricingEdit; onChange: (v: PricingEdit) => void }) {
  const num = (s: string) => Math.max(0, Number(s) || 0);
  return <div className="grid gap-4 md:grid-cols-2">
    <Card>
      <strong className="text-foreground">Store rent (₹ per sq.ft. by location class)</strong>
      {Object.entries(value.rentRates).map(([k, v]) => (
        <L key={k} label={`Class ${k}`}><input type="number" className={field} value={v} onChange={(e) => onChange({ ...value, rentRates: { ...value.rentRates, [k]: num(e.target.value) } })} /></L>
      ))}
      <L label="Monthly rent cap (₹)"><input type="number" className={field} value={value.rentCap} onChange={(e) => onChange({ ...value, rentCap: num(e.target.value) })} /></L>
    </Card>
    <Card>
      <strong className="text-foreground">Rental plans (₹ per month)</strong>
      {(["local", "next", "domestic"] as const).map((p) => (
        <L key={p} label={p}><input type="number" className={field} value={value.planRates[p]} onChange={(e) => onChange({ ...value, planRates: { ...value.planRates, [p]: num(e.target.value) } })} /></L>
      ))}
      <p className="text-xs text-muted-foreground">Used by the store income calculator. Written prices inside FAQ answers must be updated in the FAQ tab.</p>
    </Card>
  </div>;
}
