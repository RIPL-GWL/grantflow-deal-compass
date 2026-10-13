import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { fetchMyRoles } from "@/lib/admin";
import { DealFollowup, DealQuotes, DealTimeline } from "@/frontend/features/crm/deal-extras";
import { AiFollowup } from "@/frontend/features/crm/ai-followup";
import { fetchPeople, logActivity, inr, isManager, PIPELINE_LABELS, PIPELINES, STAGE_LABELS, STAGES, type Deal } from "@/lib/crm";

export const Route = createFileRoute("/_authenticated/admin/deals/$id")({
  head: () => ({ meta: [{ title: "Deal — RIPL Admin" }, { name: "robots", content: "noindex" }] }),
  component: DealPage,
});

const input = "mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground";

function DealPage() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { data: roles = [] } = useQuery({ queryKey: ["my-roles"], queryFn: fetchMyRoles });
  const { data: people = {} } = useQuery({ queryKey: ["crm-people"], queryFn: fetchPeople });
  const deal = useQuery({
    queryKey: ["crm-deal", id],
    queryFn: async () => { const { data, error } = await supabase.from("crm_deals").select("*").eq("id", id).maybeSingle(); if (error) throw error; return data; },
  });
  const docs = useQuery({
    queryKey: ["crm-docs", id],
    queryFn: async () => { const { data, error } = await supabase.from("crm_documents").select("*").eq("deal_id", id).order("created_at", { ascending: false }); if (error) throw error; return data; },
  });
  const [f, setF] = useState<Deal | null>(null);
  const [uploading, setUploading] = useState(false);
  useEffect(() => { if (deal.data) setF(deal.data); }, [deal.data]);
  const manager = isManager(roles);

  if (deal.isLoading) return null;
  if (!deal.data || !f) return <p className="text-muted-foreground">Deal not found or you don't have access. <Link to="/admin/crm" className="text-primary">Back to pipeline</Link></p>;

  const set = (k: keyof Deal) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value } as Deal);
  async function save() {
    if (!f) return;
    const { error } = await supabase.from("crm_deals").update({
      title: f.title, company: f.company, contact_name: f.contact_name, phone: f.phone, email: f.email, value: Number(f.value) || 0,
      pipeline: f.pipeline, stage: f.stage, expected_close: f.expected_close || null, notes: f.notes, ...(manager ? { owner_id: f.owner_id } : {}),
    }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    if (deal.data && f.stage !== deal.data.stage) await logActivity(id, "stage", `Stage: ${STAGE_LABELS[deal.data.stage]} → ${STAGE_LABELS[f.stage]}`);
    toast.success("Saved");
    qc.invalidateQueries({ queryKey: ["crm-activities", id] });
    qc.invalidateQueries({ queryKey: ["crm-deal", id] });
    qc.invalidateQueries({ queryKey: ["crm-deals"] });
  }
  async function remove() {
    if (!confirm("Delete this deal and its documents?")) return;
    const paths = (docs.data ?? []).map((d) => d.file_path);
    if (paths.length) await supabase.storage.from("crm-documents").remove(paths);
    const { error } = await supabase.from("crm_deals").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    qc.invalidateQueries({ queryKey: ["crm-deals"] });
    navigate({ to: "/admin/crm" });
  }
  async function upload(file: File) {
    if (file.size > 20 * 1024 * 1024) { toast.error("File must be under 20 MB."); return; }
    setUploading(true);
    const path = `${id}/${crypto.randomUUID()}-${file.name.replace(/[^\w.-]+/g, "_").slice(-100)}`;
    const up = await supabase.storage.from("crm-documents").upload(path, file);
    const ins = up.error ? up : await supabase.from("crm_documents").insert({ deal_id: id, name: file.name.slice(0, 200), file_path: path, size_bytes: file.size });
    setUploading(false);
    if (ins.error) { toast.error(ins.error.message); return; }
    qc.invalidateQueries({ queryKey: ["crm-docs", id] });
  }
  async function open(path: string) {
    const { data, error } = await supabase.storage.from("crm-documents").createSignedUrl(path, 120);
    if (error || !data) { toast.error("Couldn't open file."); return; }
    window.open(data.signedUrl, "_blank", "noopener");
  }
  async function delDoc(docId: string, path: string) {
    await supabase.storage.from("crm-documents").remove([path]);
    const { error } = await supabase.from("crm_documents").delete().eq("id", docId);
    if (error) { toast.error(error.message); return; }
    qc.invalidateQueries({ queryKey: ["crm-docs", id] });
  }

  return (
    <div className="space-y-6">
      <Link to="/admin/crm" className="text-sm text-primary">← Back to pipeline</Link>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="mr-auto text-2xl font-semibold text-foreground">{deal.data.title} · {inr(Number(deal.data.value))}</h1>
        {manager && <Button variant="outline" onClick={remove}>Delete deal</Button>}
      </div>
      <div className="grid gap-3 rounded-lg border bg-card p-4 sm:grid-cols-3">
        {([["title", "Deal name"], ["company", "Company"], ["contact_name", "Contact person"], ["phone", "Phone"], ["email", "Email"], ["value", "Value (₹)"]] as const).map(([k, l]) => (
          <label key={k} className="text-xs text-muted-foreground">{l}<input className={input} value={String(f[k] ?? "")} type={k === "value" ? "number" : "text"} onChange={set(k)} /></label>
        ))}
        <label className="text-xs text-muted-foreground">Pipeline<select className={input} value={f.pipeline} onChange={set("pipeline")}>{PIPELINES.map((p) => <option key={p} value={p}>{PIPELINE_LABELS[p]}</option>)}</select></label>
        <label className="text-xs text-muted-foreground">Stage<select className={input} value={f.stage} onChange={set("stage")}>{STAGES.map((s) => <option key={s} value={s}>{STAGE_LABELS[s]}</option>)}</select></label>
        <label className="text-xs text-muted-foreground">Expected close<input className={input} type="date" value={f.expected_close ?? ""} onChange={set("expected_close")} /></label>
        <label className="text-xs text-muted-foreground">Assigned to
          <select className={input} value={f.owner_id} disabled={!manager} onChange={set("owner_id")}>{Object.entries(people).map(([pid, n]) => <option key={pid} value={pid}>{n}</option>)}</select>
        </label>
        <label className="text-xs text-muted-foreground sm:col-span-3">Notes<textarea className={input} rows={4} maxLength={4000} value={f.notes ?? ""} onChange={set("notes")} /></label>
        <div className="sm:col-span-3"><Button onClick={save}>Save changes</Button></div>
      </div>
      <DealFollowup key={deal.data.updated_at} deal={deal.data} />
      <AiFollowup dealId={id} />
      <DealTimeline dealId={id} people={people} />
      <DealQuotes deal={deal.data} />
      <section className="rounded-lg border bg-card p-4">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <h2 className="mr-auto text-lg font-semibold text-foreground">Customer documents</h2>
          <label className="cursor-pointer rounded-md border px-3 py-2 text-sm text-foreground">{uploading ? "Uploading..." : "Upload file"}
            <input type="file" className="sr-only" disabled={uploading} onChange={(e) => { const file = e.target.files?.[0]; if (file) upload(file); e.target.value = ""; }} />
          </label>
        </div>
        {(docs.data ?? []).length === 0 ? <p className="text-sm text-muted-foreground">No documents yet. Upload quotations, agreements, KYC or invoices here.</p> : (
          <ul className="divide-y text-sm">
            {docs.data!.map((d) => (
              <li key={d.id} className="flex items-center gap-3 py-2">
                <button className="mr-auto text-left text-primary" onClick={() => open(d.file_path)}>{d.name}</button>
                <span className="text-muted-foreground">{d.size_bytes ? `${Math.ceil(d.size_bytes / 1024)} KB` : ""} · {new Date(d.created_at).toLocaleDateString("en-IN")}</span>
                <Button size="sm" variant="ghost" onClick={() => delDoc(d.id, d.file_path)}>Remove</Button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
