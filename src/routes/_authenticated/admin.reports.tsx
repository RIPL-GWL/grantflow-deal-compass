import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { fetchMyRoles } from "@/lib/admin";
import { conversionSummary, stageFunnel } from "@/lib/crm-report";
import { canSeeAll, fetchDeals, fetchPeople, inr, monthStart, PIPELINE_LABELS, PIPELINES, STAGE_LABELS, STAGES } from "@/lib/crm";

export const Route = createFileRoute("/_authenticated/admin/reports")({
  head: () => ({ meta: [{ title: "Sales Reports — RIPL Admin" }, { name: "robots", content: "noindex" }] }),
  component: ReportsPage,
});

function ReportsPage() {
  const [month, setMonth] = useState(monthStart().slice(0, 7));
  const { data: roles = [] } = useQuery({ queryKey: ["my-roles"], queryFn: fetchMyRoles });
  const { data: deals = [] } = useQuery({ queryKey: ["crm-deals"], queryFn: fetchDeals });
  const { data: people = {} } = useQuery({ queryKey: ["crm-people"], queryFn: fetchPeople });
  const { data: targets = [] } = useQuery({
    queryKey: ["crm-targets", month],
    queryFn: async () => (await supabase.from("crm_targets").select("*").eq("month", `${month}-01`)).data ?? [],
  });
  const sum = (l: typeof deals) => l.reduce((s, d) => s + Number(d.value), 0);
  const open = deals.filter((d) => !["won", "lost"].includes(d.stage));
  const wonM = deals.filter((d) => d.stage === "won" && d.closed_at?.startsWith(month));
  const lostM = deals.filter((d) => d.stage === "lost" && d.closed_at?.startsWith(month));
  const winRate = wonM.length + lostM.length ? Math.round((wonM.length / (wonM.length + lostM.length)) * 100) : 0;
  const owners = [...new Set([...deals.map((d) => d.owner_id), ...targets.map((t) => t.user_id)])];

  const reps = owners.map((o) => {
    const mine = deals.filter((d) => d.owner_id === o);
    const won = mine.filter((d) => d.stage === "won" && d.closed_at?.startsWith(month));
    const lost = mine.filter((d) => d.stage === "lost" && d.closed_at?.startsWith(month));
    const target = Number(targets.find((t) => t.user_id === o)?.target_value ?? 0);
    const overdue = mine.filter((d) => !["won", "lost"].includes(d.stage) && d.expected_close && d.expected_close < new Date().toISOString().slice(0, 10)).length;
    return { id: o, name: people[o] ?? "Unknown", open: mine.filter((d) => !["won", "lost"].includes(d.stage)).length, openValue: sum(mine.filter((d) => !["won", "lost"].includes(d.stage))), won: sum(won), target, winRate: won.length + lost.length ? Math.round((won.length / (won.length + lost.length)) * 100) : 0, overdue };
  });

  function exportCsv() {
    const rows = [["Deal", "Company", "Pipeline", "Stage", "Value", "Owner", "Expected close", "Closed", "Created"], ...deals.map((d) => [d.title, d.company ?? "", PIPELINE_LABELS[d.pipeline], STAGE_LABELS[d.stage], d.value, people[d.owner_id] ?? "", d.expected_close ?? "", d.closed_at?.slice(0, 10) ?? "", d.created_at.slice(0, 10)])];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `deals-${month}.csv`;
    a.click();
  }

  const Card = ({ label, value }: { label: string; value: string }) => <div className="rounded-lg border bg-card p-4"><p className="text-xs text-muted-foreground">{label}</p><p className="text-2xl font-semibold text-foreground">{value}</p></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-3">
        <div className="mr-auto"><h1 className="text-2xl font-semibold text-foreground">Sales Reports</h1><p className="text-sm text-muted-foreground">{canSeeAll(roles) ? "Whole sales team" : "Your own deals"}</p></div>
        <input type="month" className="rounded-md border bg-background px-3 py-2 text-sm text-foreground" value={month} onChange={(e) => e.target.value && setMonth(e.target.value)} aria-label="Month" />
        <Button variant="outline" onClick={exportCsv}>Download CSV</Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Card label="Open pipeline" value={`${inr(sum(open))} · ${open.length}`} />
        <Card label="Won this month" value={`${inr(sum(wonM))} · ${wonM.length}`} />
        <Card label="Lost this month" value={String(lostM.length)} />
        <Card label="Win rate this month" value={`${winRate}%`} />
      </div>
      <StageReport deals={deals} />
      <div className="grid gap-4 md:grid-cols-2">
        <Breakdown title="By stage" rows={STAGES.map((s) => [STAGE_LABELS[s] ?? s, deals.filter((d) => d.stage === s)])} sum={sum} />
        <Breakdown title="By pipeline" rows={PIPELINES.map((p) => [PIPELINE_LABELS[p] ?? p, deals.filter((d) => d.pipeline === p)])} sum={sum} />
      </div>
      {canSeeAll(roles) && (
        <section className="rounded-lg border bg-card p-4">
          <h2 className="mb-3 text-lg font-semibold text-foreground">Manager view — team performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-muted-foreground"><tr><th className="py-2">Salesperson</th><th>Open deals</th><th>Open value</th><th>Won (month)</th><th>Target</th><th>Achieved</th><th>Win rate</th><th>Overdue</th></tr></thead>
              <tbody>{reps.map((r) => (
                <tr key={r.id} className="border-t text-foreground"><td className="py-2 font-medium">{r.name}</td><td>{r.open}</td><td>{inr(r.openValue)}</td><td>{inr(r.won)}</td><td>{r.target ? inr(r.target) : "—"}</td><td>{r.target ? `${Math.round((r.won / r.target) * 100)}%` : "—"}</td><td>{r.winRate}%</td><td className={r.overdue ? "text-destructive" : ""}>{r.overdue}</td></tr>
              ))}</tbody>
            </table>
            {!reps.length && <p className="py-3 text-sm text-muted-foreground">No deals yet.</p>}
          </div>
        </section>
      )}
    </div>
  );
}

function Breakdown({ title, rows, sum }: { title: string; rows: [string, { value: number }[]][]; sum: (l: never[]) => number }) {
  const max = Math.max(1, ...rows.map(([, l]) => sum(l as never[])));
  return (
    <section className="rounded-lg border bg-card p-4">
      <h2 className="mb-3 font-semibold text-foreground">{title}</h2>
      <ul className="space-y-2 text-sm">{rows.map(([label, l]) => (
        <li key={label}><div className="flex justify-between text-foreground"><span>{label} ({l.length})</span><span>{inr(sum(l as never[]))}</span></div><div className="h-2 rounded bg-muted"><div className="h-2 rounded bg-primary" style={{ width: `${(sum(l as never[]) / max) * 100}%` }} /></div></li>
      ))}</ul>
    </section>
  );
}

function StageReport({ deals }: { deals: { stage: string; value: number }[] }) {
  const c = conversionSummary(deals);
  const f = stageFunnel(deals);
  return (
    <section className="space-y-3 rounded-lg border bg-card p-4">
      <h2 className="text-lg font-semibold text-foreground">Stage-wise report (all time)</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        <div><p className="text-xs text-muted-foreground">Conversion rate (won ÷ closed)</p><p className="text-2xl font-semibold text-foreground">{c.conversionRate}%</p></div>
        <div><p className="text-xs text-muted-foreground">Jeeti hui rakam</p><p className="text-2xl font-semibold text-foreground">{inr(c.wonAmount)} · {c.wonCount}</p></div>
        <div><p className="text-xs text-muted-foreground">Lost deals</p><p className="text-2xl font-semibold text-foreground">{c.lostCount}</p></div>
      </div>
      <div className="overflow-x-auto"><table className="w-full text-sm">
        <thead className="text-left text-muted-foreground"><tr><th className="py-2">Stage</th><th>Deals at stage</th><th>Value</th><th>Reached this stage</th><th>% of all deals</th></tr></thead>
        <tbody>{f.map((r) => <tr key={r.stage} className="border-t text-foreground"><td className="py-2">{STAGE_LABELS[r.stage]}</td><td>{r.count}</td><td>{inr(r.value)}</td><td>{r.reached}</td><td>{r.reachedPct}%</td></tr>)}</tbody>
      </table></div>
    </section>
  );
}
