import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { inr, logActivity, QUOTE_STATUS_LABELS, quoteTotals, type Quote, type QuoteItem } from "@/lib/crm";

export const Route = createFileRoute("/_authenticated/admin/quotes/$id")({
  head: () => ({ meta: [{ title: "Quotation — RIPL Admin" }, { name: "robots", content: "noindex" }] }),
  component: QuotePage,
});

const input = "w-full rounded-md border bg-background px-2 py-1.5 text-sm text-foreground";

function QuotePage() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["crm-quote", id],
    queryFn: async () => {
      const { data: q, error } = await supabase.from("crm_quotes").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      if (!q) return null;
      const { data: deal } = await supabase.from("crm_deals").select("*").eq("id", q.deal_id).maybeSingle();
      const { data: contact } = deal?.contact_id ? await supabase.from("crm_contacts").select("*").eq("id", deal.contact_id).maybeSingle() : { data: null };
      return { q, deal, contact };
    },
  });
  const [q, setQ] = useState<Quote | null>(null);
  useEffect(() => { if (data?.q) setQ(data.q); }, [data]);

  if (isLoading) return null;
  if (!data || !q) return <p className="text-muted-foreground">Quotation not found. <Link to="/admin/crm" className="text-primary">Back</Link></p>;
  const t = quoteTotals(q);
  const items = t.items;
  const setItems = (next: QuoteItem[]) => setQ({ ...q, items: next as never });
  const deal = data.deal, c = data.contact;

  async function save() {
    if (!q) return;
    const { error } = await supabase.from("crm_quotes").update({
      items: items.filter((i) => i.description.trim()) as never, gst_percent: Number(q.gst_percent), discount: Number(q.discount) || 0,
      valid_until: q.valid_until || null, terms: q.terms, status: q.status,
    }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    if (data?.q && q.status !== data.q.status) await logActivity(q.deal_id, "quote", `Quotation ${q.number} marked ${QUOTE_STATUS_LABELS[q.status]}`);
    toast.success("Saved");
    qc.invalidateQueries({ queryKey: ["crm-quote", id] });
    qc.invalidateQueries({ queryKey: ["crm-quotes", q.deal_id] });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 print:hidden">
        <Link to="/admin/deals/$id" params={{ id: q.deal_id }} className="mr-auto text-sm text-primary">← Back to deal</Link>
        <select className={input + " w-auto"} value={q.status} onChange={(e) => setQ({ ...q, status: e.target.value })} aria-label="Status">
          {Object.entries(QUOTE_STATUS_LABELS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
        </select>
        <Button onClick={save}>Save</Button>
        <Button variant="outline" onClick={() => window.print()}>Download PDF / Print</Button>
      </div>
      <p className="text-xs text-muted-foreground print:hidden">Tip: in the print window choose "Save as PDF". Save first so the PDF matches.</p>

      <article className="quote-sheet mx-auto max-w-3xl space-y-6 rounded-lg border bg-card p-8 text-foreground print:max-w-none print:border-0 print:p-0">
        <header className="flex flex-wrap justify-between gap-4 border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold">Rishishwar Industry Pvt. Ltd.</h1>
            <p className="text-sm text-muted-foreground">Gwalior, Madhya Pradesh · rishishwarindustry.in</p>
          </div>
          <div className="text-right text-sm">
            <p className="text-lg font-semibold text-primary">QUOTATION</p>
            <p>{q.number}</p>
            <p>Date: {new Date(q.created_at).toLocaleDateString("en-IN")}</p>
            <p className="flex items-center justify-end gap-1">Valid until: <input type="date" className="w-36 rounded border bg-background px-1 text-sm print:border-0" value={q.valid_until ?? ""} onChange={(e) => setQ({ ...q, valid_until: e.target.value })} /></p>
          </div>
        </header>
        <section className="text-sm">
          <p className="font-semibold">To:</p>
          <p>{c?.name ?? deal?.contact_name ?? "—"}{c?.designation ? `, ${c.designation}` : ""}</p>
          <p>{c?.company ?? deal?.company ?? ""}</p>
          {c?.address && <p>{c.address}</p>}
          <p>{[c?.phone ?? deal?.phone, c?.email ?? deal?.email].filter(Boolean).join(" · ")}</p>
          {c?.gstin && <p>GSTIN: {c.gstin}</p>}
          <p className="mt-2 text-muted-foreground">Subject: {deal?.title}</p>
        </section>
        <table className="w-full text-sm">
          <thead><tr className="border-b text-left"><th className="py-2">#</th><th>Description</th><th className="w-20 text-right">Qty</th><th className="w-28 text-right">Rate (₹)</th><th className="w-28 text-right">Amount</th><th className="w-8 print:hidden" /></tr></thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={i} className="border-b align-top">
                <td className="py-2">{i + 1}</td>
                <td><input className={input + " print:border-0 print:p-0"} value={it.description} onChange={(e) => setItems(items.map((x, j) => (j === i ? { ...x, description: e.target.value } : x)))} /></td>
                <td><input type="number" min={0} className={input + " text-right print:border-0 print:p-0"} value={it.qty} onChange={(e) => setItems(items.map((x, j) => (j === i ? { ...x, qty: Number(e.target.value) } : x)))} /></td>
                <td><input type="number" min={0} className={input + " text-right print:border-0 print:p-0"} value={it.rate} onChange={(e) => setItems(items.map((x, j) => (j === i ? { ...x, rate: Number(e.target.value) } : x)))} /></td>
                <td className="py-2 text-right">{inr((Number(it.qty) || 0) * (Number(it.rate) || 0))}</td>
                <td className="print:hidden"><button aria-label="Remove line" className="px-2 text-muted-foreground" onClick={() => setItems(items.filter((_, j) => j !== i))}>×</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <Button size="sm" variant="outline" className="print:hidden" onClick={() => setItems([...items, { description: "", qty: 1, rate: 0 }])}>+ Add line</Button>
        <div className="ml-auto w-72 space-y-1 text-sm">
          <p className="flex justify-between"><span>Subtotal</span><span>{inr(t.subtotal)}</span></p>
          <p className="flex items-center justify-between gap-2"><span>Discount (₹)</span><input type="number" min={0} className={input + " w-28 text-right print:border-0"} value={q.discount} onChange={(e) => setQ({ ...q, discount: Number(e.target.value) })} /></p>
          <p className="flex items-center justify-between gap-2"><span>GST %</span><select className={input + " w-28 text-right print:border-0"} value={String(q.gst_percent)} onChange={(e) => setQ({ ...q, gst_percent: Number(e.target.value) })}>{[0, 5, 12, 18, 28].map((g) => <option key={g} value={g}>{g}%</option>)}</select></p>
          <p className="flex justify-between"><span>GST amount</span><span>{inr(t.gst)}</span></p>
          <p className="flex justify-between border-t pt-1 text-base font-bold"><span>Total</span><span>₹{t.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span></p>
        </div>
        <section className="text-sm">
          <p className="font-semibold">Terms & conditions</p>
          <textarea className={input + " print:hidden"} rows={3} value={q.terms ?? ""} onChange={(e) => setQ({ ...q, terms: e.target.value })} />
          <p className="hidden whitespace-pre-wrap print:block">{q.terms}</p>
        </section>
        <footer className="pt-8 text-right text-sm"><p>For Rishishwar Industry Pvt. Ltd.</p><p className="mt-10 text-muted-foreground">Authorised signatory</p></footer>
      </article>
    </div>
  );
}
