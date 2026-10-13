import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SimpleMarkdown } from "@/frontend/components/simple-markdown";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { fetchPeople, inr } from "@/lib/crm";
import { INTEREST_LABELS, registrationTotal, STAGE_LABELS_PROG } from "@/frontend/features/funding-programme/rules";

export const Route = createFileRoute("/_authenticated/admin/programme")({
  head: () => ({ meta: [{ title: "Funding Programme Applications — RIPL Admin" }, { name: "robots", content: "noindex" }] }),
  component: ProgrammeAdmin,
});

const STATUSES = ["new", "contacted", "registered", "rejected"];
const PAYMENTS = ["pending", "partial", "paid", "refunded"];
const sel = "rounded-md border bg-background px-2 py-1 text-sm text-foreground";

function ProgrammeAdmin() {
  const qc = useQueryClient();
  const [open, setOpen] = useState<string | null>(null);
  const { data: rows = [], error } = useQuery({
    queryKey: ["programme-apps"],
    queryFn: async () => { const r = await supabase.from("programme_applications").select("*").order("created_at", { ascending: false }); if (r.error) throw r.error; return r.data; },
  });
  const { data: team = [] } = useQuery({
    queryKey: ["programme-team"],
    queryFn: async () => (await supabase.from("user_roles").select("user_id").eq("role", "programme_manager")).data?.map((r) => r.user_id) ?? [],
  });
  const { data: people = {} } = useQuery({ queryKey: ["crm-people"], queryFn: fetchPeople });

  async function update(id: string, patch: Database["public"]["Tables"]["programme_applications"]["Update"]) {
    const { error } = await supabase.from("programme_applications").update(patch).eq("id", id);
    if (error) { toast.error(error.message); return; }
    qc.invalidateQueries({ queryKey: ["programme-apps"] });
  }

  if (error) return <p className="text-sm text-muted-foreground">Ye section sirf Funding Programme team aur Admin ke liye hai.</p>;
  const collected = rows.reduce((s, r) => s + Number(r.amount_paid), 0);

  return (
    <div className="space-y-4">
      <div><h1 className="text-2xl font-semibold text-foreground">Funding Programme Applications</h1>
        <p className="text-sm text-muted-foreground">{rows.length} applications · {rows.filter((r) => r.status === "registered").length} registered · {inr(collected)} collected</p></div>
      <div className="overflow-x-auto rounded-lg border bg-card">
        <table className="w-full text-sm">
          <thead className="text-left text-muted-foreground"><tr><th className="p-2">Startup / Founder</th><th>Stage</th><th>Need</th><th>Status</th><th>Payment</th><th>Paid (₹)</th><th>Assigned</th><th></th></tr></thead>
          <tbody>{rows.map((r) => (<>
            <tr key={r.id} className="border-t text-foreground">
              <td className="p-2"><strong>{r.startup_name}</strong><br /><span className="text-muted-foreground">{r.founder_name} · {r.phone} · {r.email}</span></td>
              <td>{STAGE_LABELS_PROG[r.stage as keyof typeof STAGE_LABELS_PROG]}<br /><span className="text-muted-foreground">{INTEREST_LABELS[r.funding_interest as keyof typeof INTEREST_LABELS]}</span></td>
              <td>{inr(Number(r.funding_need))}</td>
              <td><select aria-label="Status" className={sel} value={r.status} onChange={(e) => update(r.id, { status: e.target.value })}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></td>
              <td><select aria-label="Payment" className={sel} value={r.payment_status} onChange={(e) => update(r.id, { payment_status: e.target.value })}>{PAYMENTS.map((s) => <option key={s}>{s}</option>)}</select><br /><span className="text-xs text-muted-foreground">Due {inr(registrationTotal(r.participants))}</span></td>
              <td><input aria-label="Amount paid" type="number" min={0} className={`${sel} w-24`} defaultValue={Number(r.amount_paid)} onBlur={(e) => Number(e.target.value) !== Number(r.amount_paid) && update(r.id, { amount_paid: Number(e.target.value) || 0 })} /></td>
              <td><select aria-label="Assigned to" className={sel} value={r.assigned_to ?? ""} onChange={(e) => update(r.id, { assigned_to: e.target.value || null })}><option value="">—</option>{team.map((u) => <option key={u} value={u}>{people[u] ?? u.slice(0, 8)}</option>)}</select></td>
              <td><Button size="sm" variant="outline" onClick={() => setOpen(open === r.id ? null : r.id)}>{open === r.id ? "Hide" : "Details"}</Button></td>
            </tr>
            {open === r.id && <tr key={`${r.id}-d`} className="bg-muted/40"><td colSpan={8} className="space-y-2 p-3 text-foreground">
              <p><strong>Idea:</strong> {r.idea}</p>
              <p className="text-muted-foreground">{r.city ?? ""} · {r.participants} participant(s) · {new Date(r.created_at).toLocaleString("en-IN")}</p>
              {r.ai_recommendation && <div className="prose prose-sm max-w-none rounded border bg-background p-3"><SimpleMarkdown text={r.ai_recommendation} /></div>}
              <textarea aria-label="Team notes" className="w-full rounded-md border bg-background p-2 text-sm" rows={2} defaultValue={r.notes ?? ""} placeholder="Team notes (call, payment reference…)" onBlur={(e) => e.target.value !== (r.notes ?? "") && update(r.id, { notes: e.target.value })} />
            </td></tr>}
          </>))}</tbody>
        </table>
        {!rows.length && <p className="p-4 text-sm text-muted-foreground">Abhi koi application nahi aayi.</p>}
      </div>
    </div>
  );
}
