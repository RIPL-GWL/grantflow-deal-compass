import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { fetchMyRoles } from "@/lib/admin";
import { fetchDeals, fetchPeople, inr, isManager, monthStart } from "@/lib/crm";

export const Route = createFileRoute("/_authenticated/admin/targets")({
  head: () => ({ meta: [{ title: "Sales Targets — RIPL Admin" }, { name: "robots", content: "noindex" }] }),
  component: TargetsPage,
});

const input = "rounded-md border bg-background px-3 py-2 text-sm text-foreground";

function TargetsPage() {
  const qc = useQueryClient();
  const [month, setMonth] = useState(monthStart().slice(0, 7));
  const { data: roles = [] } = useQuery({ queryKey: ["my-roles"], queryFn: fetchMyRoles });
  const { data: people = {} } = useQuery({ queryKey: ["crm-people"], queryFn: fetchPeople });
  const { data: deals = [] } = useQuery({ queryKey: ["crm-deals"], queryFn: fetchDeals });
  const { data: targets = [] } = useQuery({
    queryKey: ["crm-targets", month],
    queryFn: async () => { const { data, error } = await supabase.from("crm_targets").select("*").eq("month", `${month}-01`); if (error) throw error; return data; },
  });
  const manager = isManager(roles);
  const [newUser, setNewUser] = useState("");
  const [newValue, setNewValue] = useState("");

  const wonFor = (uid: string) => deals.filter((d) => d.owner_id === uid && d.stage === "won" && d.closed_at?.startsWith(month)).reduce((s, d) => s + Number(d.value), 0);

  async function saveTarget(user_id: string, value: number) {
    const { error } = await supabase.from("crm_targets").upsert({ user_id, month: `${month}-01`, target_value: value }, { onConflict: "user_id,month" });
    if (error) { toast.error(error.message); return; }
    qc.invalidateQueries({ queryKey: ["crm-targets", month] });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="mr-auto"><h1 className="text-2xl font-semibold text-foreground">Sales Targets</h1><p className="text-sm text-muted-foreground">Monthly target vs. won deal value.</p></div>
        <input type="month" className={input} value={month} onChange={(e) => e.target.value && setMonth(e.target.value)} aria-label="Month" />
      </div>
      {manager && (
        <form className="flex flex-wrap gap-2 rounded-lg border bg-card p-4" onSubmit={(e) => { e.preventDefault(); if (newUser && Number(newValue) >= 0) { saveTarget(newUser, Number(newValue)); setNewValue(""); } }}>
          <select className={input} value={newUser} onChange={(e) => setNewUser(e.target.value)} aria-label="Salesperson"><option value="">Choose salesperson</option>{Object.entries(people).map(([id, n]) => <option key={id} value={id}>{n}</option>)}</select>
          <input className={input} type="number" min={0} placeholder="Target (₹)" value={newValue} onChange={(e) => setNewValue(e.target.value)} />
          <Button type="submit" disabled={!newUser || !newValue}>Set target</Button>
        </form>
      )}
      <div className="rounded-lg border bg-card">
        {targets.length === 0 ? <p className="p-4 text-sm text-muted-foreground">No targets set for this month.</p> : targets.map((t) => {
          const won = wonFor(t.user_id); const pct = t.target_value > 0 ? Math.min(100, Math.round((won / Number(t.target_value)) * 100)) : 0;
          return (
            <div key={t.id} className="flex flex-wrap items-center gap-3 border-b p-3 text-sm last:border-0">
              <span className="w-48 font-medium text-foreground">{people[t.user_id] ?? "Unknown"}</span>
              <div className="h-2 min-w-32 flex-1 rounded bg-muted"><div className="h-2 rounded bg-primary" style={{ width: `${pct}%` }} /></div>
              <span className="text-muted-foreground">{inr(won)} of {inr(Number(t.target_value))} ({pct}%)</span>
              {manager && <Button size="sm" variant="ghost" onClick={async () => { await supabase.from("crm_targets").delete().eq("id", t.id); qc.invalidateQueries({ queryKey: ["crm-targets", month] }); }}>Remove</Button>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
