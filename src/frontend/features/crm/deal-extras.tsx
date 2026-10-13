import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  ACTIVITY_KINDS, ACTIVITY_LABELS, fetchContacts, followupState, inr, logActivity, QUOTE_STATUS_LABELS, quoteTotals, type Deal,
} from "@/lib/crm";

const input = "mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground";
const toLocal = (iso: string | null) => (iso ? new Date(new Date(iso).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : "");

/** Linked customer + next follow-up for a deal. */
export function DealFollowup({ deal }: { deal: Deal }) {
  const qc = useQueryClient();
  const { data: contacts = [] } = useQuery({ queryKey: ["crm-contacts"], queryFn: fetchContacts });
  const [contactId, setContactId] = useState(deal.contact_id ?? "");
  const [at, setAt] = useState(toLocal(deal.next_followup_at));
  const [note, setNote] = useState(deal.followup_note ?? "");
  const state = followupState(deal.next_followup_at);

  async function save(clear = false) {
    const next = clear || !at ? null : new Date(at).toISOString();
    const { error } = await supabase.from("crm_deals").update({ contact_id: contactId || null, next_followup_at: next, followup_note: clear ? null : note || null }).eq("id", deal.id);
    if (error) { toast.error(error.message); return; }
    if (next) await logActivity(deal.id, "note", `Follow-up set for ${new Date(next).toLocaleString("en-IN")}${note ? `: ${note}` : ""}`);
    if (clear) { setAt(""); setNote(""); }
    toast.success(clear ? "Follow-up marked done" : "Saved");
    ["crm-deal", "crm-deals", "crm-activities", "crm-followups"].forEach((k) => qc.invalidateQueries({ queryKey: [k] }));
  }

  return (
    <section className="grid gap-3 rounded-lg border bg-card p-4 sm:grid-cols-3">
      <h2 className="text-lg font-semibold text-foreground sm:col-span-3">Customer & follow-up
        {state && <span className={`ml-2 rounded px-2 py-0.5 text-xs ${state === "overdue" ? "bg-destructive text-destructive-foreground" : "bg-secondary text-secondary-foreground"}`}>{state === "overdue" ? "Overdue" : state === "today" ? "Due today" : "Scheduled"}</span>}
      </h2>
      <label className="text-xs text-muted-foreground">Customer / company
        <select className={input} value={contactId} onChange={(e) => setContactId(e.target.value)}>
          <option value="">— Not linked —</option>
          {contacts.map((c) => <option key={c.id} value={c.id}>{c.name}{c.company ? ` · ${c.company}` : ""}</option>)}
        </select>
        <Link to="/admin/contacts" className="mt-1 inline-block text-primary">Manage contacts</Link>
      </label>
      <label className="text-xs text-muted-foreground">Next follow-up<input type="datetime-local" className={input} value={at} onChange={(e) => setAt(e.target.value)} /></label>
      <label className="text-xs text-muted-foreground">What to do<input className={input} maxLength={300} placeholder="e.g. Call about pricing" value={note} onChange={(e) => setNote(e.target.value)} /></label>
      <div className="flex gap-2 sm:col-span-3">
        <Button onClick={() => save()}>Save</Button>
        {deal.next_followup_at && <Button variant="outline" onClick={() => save(true)}>Mark follow-up done</Button>}
      </div>
    </section>
  );
}

/** Calls, meetings, WhatsApp, emails and notes on a deal. */
export function DealTimeline({ dealId, people }: { dealId: string; people: Record<string, string> }) {
  const qc = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ["crm-activities", dealId],
    queryFn: async () => { const { data, error } = await supabase.from("crm_deal_activities").select("*").eq("deal_id", dealId).order("created_at", { ascending: false }); if (error) throw error; return data; },
  });
  const [kind, setKind] = useState<string>("call");
  const [body, setBody] = useState("");
  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    const { error } = await logActivity(dealId, kind, body.trim());
    if (error) { toast.error(error.message); return; }
    setBody("");
    qc.invalidateQueries({ queryKey: ["crm-activities", dealId] });
  }
  return (
    <section className="rounded-lg border bg-card p-4">
      <h2 className="mb-3 text-lg font-semibold text-foreground">Activity timeline</h2>
      <form onSubmit={add} className="mb-4 flex flex-wrap gap-2">
        <select className="rounded-md border bg-background px-2 py-2 text-sm text-foreground" value={kind} onChange={(e) => setKind(e.target.value)} aria-label="Activity type">
          {ACTIVITY_KINDS.map((k) => <option key={k} value={k}>{ACTIVITY_LABELS[k]}</option>)}
        </select>
        <input className="min-w-60 flex-1 rounded-md border bg-background px-3 py-2 text-sm text-foreground" maxLength={4000} placeholder="What happened? e.g. Spoke to owner, wants samples" value={body} onChange={(e) => setBody(e.target.value)} />
        <Button type="submit">Log</Button>
      </form>
      {data.length === 0 ? <p className="text-sm text-muted-foreground">No activity yet.</p> : (
        <ol className="space-y-3 border-l pl-4">
          {data.map((a) => (
            <li key={a.id} className="text-sm">
              <p className="text-xs text-muted-foreground"><span className="font-semibold text-primary">{ACTIVITY_LABELS[a.kind] ?? a.kind}</span> · {people[a.user_id] ?? ""} · {new Date(a.created_at).toLocaleString("en-IN")}</p>
              <p className="whitespace-pre-wrap text-foreground">{a.body}</p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

/** Quotations for a deal; each opens an editor with print / PDF. */
export function DealQuotes({ deal }: { deal: Deal }) {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { data = [] } = useQuery({
    queryKey: ["crm-quotes", deal.id],
    queryFn: async () => { const { data, error } = await supabase.from("crm_quotes").select("*").eq("deal_id", deal.id).order("created_at", { ascending: false }); if (error) throw error; return data; },
  });
  async function create() {
    const valid = new Date(Date.now() + 15 * 864e5).toISOString().slice(0, 10);
    const { data: q, error } = await supabase.from("crm_quotes").insert({
      deal_id: deal.id, valid_until: valid,
      items: [{ description: deal.title, qty: 1, rate: Number(deal.value) || 0 }],
      terms: "Prices in INR. GST as applicable. Payment terms as agreed. Valid until the date shown.",
    }).select("id, number").single();
    if (error) { toast.error(error.message); return; }
    await logActivity(deal.id, "quote", `Quotation ${q.number} created`);
    qc.invalidateQueries({ queryKey: ["crm-quotes", deal.id] });
    qc.invalidateQueries({ queryKey: ["crm-activities", deal.id] });
    navigate({ to: "/admin/quotes/$id", params: { id: q.id } });
  }
  return (
    <section className="rounded-lg border bg-card p-4">
      <div className="mb-3 flex items-center gap-3">
        <h2 className="mr-auto text-lg font-semibold text-foreground">Quotations</h2>
        <Button onClick={create}>New quotation</Button>
      </div>
      {data.length === 0 ? <p className="text-sm text-muted-foreground">No quotations yet.</p> : (
        <ul className="divide-y text-sm">
          {data.map((q) => (
            <li key={q.id} className="flex items-center gap-3 py-2">
              <Link to="/admin/quotes/$id" params={{ id: q.id }} className="mr-auto text-primary">{q.number}</Link>
              <span className="text-muted-foreground">{QUOTE_STATUS_LABELS[q.status]}</span>
              <span className="font-semibold text-foreground">{inr(quoteTotals(q).total)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
