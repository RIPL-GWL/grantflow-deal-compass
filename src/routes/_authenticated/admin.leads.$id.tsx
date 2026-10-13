import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LEAD_STATUSES, STATUS_LABELS } from "@/lib/admin";

export const Route = createFileRoute("/_authenticated/admin/leads/$id")({
  head: () => ({ meta: [
    { title: "Enquiry Details — RIPL Administration" },
    { name: "description", content: "Review an RIPL enquiry and its follow-up activity." },
    { property: "og:title", content: "Enquiry Details — RIPL Administration" },
    { property: "og:description", content: "Private RIPL enquiry details and follow-up activity." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: LeadDetail,
});

const KINDS = ["note", "call", "whatsapp", "email", "meeting", "visit"];

function LeadDetail() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [body, setBody] = useState("");
  const [kind, setKind] = useState("note");
  const [converting, setConverting] = useState(false);
  const deal = useQuery({
    queryKey: ["lead-deal", id],
    queryFn: async () => {
      const { data } = await supabase.from("crm_deals").select("id").eq("lead_id", id).limit(1).maybeSingle();
      return data;
    },
  });

  const lead = useQuery({
    queryKey: ["lead", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("leads").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
  const staff = useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("id,email,full_name");
      return data ?? [];
    },
  });
  const acts = useQuery({
    queryKey: ["activities", id],
    queryFn: async () => {
      const { data } = await supabase.from("lead_activities").select("*").eq("lead_id", id).order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  async function update(patch: { status?: string; assigned_to?: string | null }) {
    const { error } = await supabase.from("leads").update({ ...patch, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    const label = patch.status ? `Status → ${STATUS_LABELS[patch.status]}` : "Owner changed";
    await supabase.from("lead_activities").insert({ lead_id: id, kind: "system", body: label });
    toast.success("Saved");
    qc.invalidateQueries({ queryKey: ["lead", id] });
    qc.invalidateQueries({ queryKey: ["activities", id] });
    qc.invalidateQueries({ queryKey: ["leads"] });
  }

  async function addActivity() {
    if (!body.trim()) return;
    const { error } = await supabase.from("lead_activities").insert({ lead_id: id, kind, body: body.trim() });
    if (error) { toast.error(error.message); return; }
    setBody("");
    qc.invalidateQueries({ queryKey: ["activities", id] });
  }

  async function convertToDeal() {
    const src = lead.data;
    if (!src) return;
    setConverting(true);
    const pipelines = ["manufacturer", "retailer", "distributor", "funding", "global"];
    const { data: userData } = await supabase.auth.getUser();
    const ownerId = src.assigned_to ?? userData.user?.id;
    if (!ownerId) { setConverting(false); toast.error("Please sign in again."); return; }
    const { data: created, error } = await supabase.from("crm_deals").insert({
      title: `${src.company || src.name} — ${src.lead_type}`.slice(0, 200),
      company: src.company, contact_name: src.name, phone: src.phone, email: src.email,
      pipeline: pipelines.includes(src.lead_type) ? src.lead_type : "general",
      owner_id: ownerId,
      lead_id: src.id, notes: src.message,
    }).select("id").single();
    setConverting(false);
    if (error) { toast.error(error.message); return; }
    await supabase.from("lead_activities").insert({ lead_id: id, kind: "system", body: "Converted to deal" });
    if (src.status === "new") await update({ status: "qualified" });
    toast.success("Deal created");
    navigate({ to: "/admin/deals/$id", params: { id: created.id } });
  }

  const l = lead.data;
  if (lead.isLoading) return <p className="text-muted-foreground">Loading…</p>;
  if (!l) return <p className="text-muted-foreground">Enquiry not found or not visible to you.</p>;
  const name = (uid: string) => staff.data?.find((s) => s.id === uid)?.full_name || staff.data?.find((s) => s.id === uid)?.email || "Team member";

  return (
    <div className="space-y-4">
      <Link to="/admin" className="text-sm text-muted-foreground">← All enquiries</Link>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>{l.name} <span className="text-sm font-normal text-muted-foreground">· {l.lead_type}</span></CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><b>Phone:</b> <a className="text-primary" href={`tel:${l.phone}`}>{l.phone}</a></p>
            <p><b>Email:</b> <a className="text-primary" href={`mailto:${l.email}`}>{l.email}</a></p>
            {l.company && <p><b>Company:</b> {l.company}</p>}
            {l.source_page && <p><b>From page:</b> {l.source_page}</p>}
            <p><b>Received:</b> {new Date(l.created_at).toLocaleString("en-IN")}</p>
            {l.message && <p className="whitespace-pre-wrap rounded-md bg-muted p-3">{l.message}</p>}
            {l.details && typeof l.details === "object" && Object.keys(l.details).length > 0 && (
              <dl className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                {Object.entries(l.details as Record<string, unknown>).map(([k, v]) => (
                  <div key={k}><dt className="text-xs text-muted-foreground">{k}</dt><dd>{String(v)}</dd></div>
                ))}
              </dl>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Work on it</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <label className="block">Status
              <select className="mt-1 w-full rounded-md border bg-background p-2 text-foreground" value={l.status} onChange={(e) => update({ status: e.target.value })}>
                {LEAD_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
              </select>
            </label>
            <label className="block">Owner
              <select className="mt-1 w-full rounded-md border bg-background p-2 text-foreground" value={l.assigned_to ?? ""} onChange={(e) => update({ assigned_to: e.target.value || null })}>
                <option value="">Unassigned</option>
                {staff.data?.map((s) => <option key={s.id} value={s.id}>{s.full_name || s.email}</option>)}
              </select>
            </label>
            {deal.data ? (
              <Link to="/admin/deals/$id" params={{ id: deal.data.id }} className="block text-primary">Open linked deal →</Link>
            ) : (
              <Button className="w-full" onClick={convertToDeal} disabled={converting}>
                {converting ? "Creating deal…" : "Convert to deal"}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Activity</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row">
            <select value={kind} onChange={(e) => setKind(e.target.value)} className="rounded-md border bg-background p-2 text-sm text-foreground">
              {KINDS.map((k) => <option key={k}>{k}</option>)}
            </select>
            <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="What happened? Next step?" />
            <Button onClick={addActivity}>Add</Button>
          </div>
          <ul className="space-y-2">
            {acts.data?.map((a) => (
              <li key={a.id} className="rounded-md border p-3 text-sm">
                <div className="text-xs text-muted-foreground">{a.kind} · {name(a.user_id)} · {new Date(a.created_at).toLocaleString("en-IN")}</div>
                <div className="whitespace-pre-wrap">{a.body}</div>
              </li>
            ))}
            {acts.data?.length === 0 && <li className="text-sm text-muted-foreground">No activity yet.</li>}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
