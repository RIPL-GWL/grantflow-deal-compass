import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { fetchMyRoles } from "@/lib/admin";
import { canSeeAll, fetchDeals, fetchPeople, fetchTeam, inr, monthStart } from "@/lib/crm";
import { visibleMembers } from "@/lib/target-gauge";
import { TargetGauge } from "@/components/admin/target-gauge";

export const Route = createFileRoute("/_authenticated/admin/dashboard")({
  head: () => ({ meta: [{ title: "Target Dashboard — RIPL Admin" }, { name: "robots", content: "noindex" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = Route.useRouteContext();
  const [month, setMonth] = useState(monthStart().slice(0, 7));
  const { data: roles = [] } = useQuery({ queryKey: ["my-roles"], queryFn: fetchMyRoles });
  const { data: people = {} } = useQuery({ queryKey: ["crm-people"], queryFn: fetchPeople });
  const { data: deals = [] } = useQuery({ queryKey: ["crm-deals"], queryFn: fetchDeals });
  const { data: team = [] } = useQuery({ queryKey: ["crm-team"], queryFn: fetchTeam });
  const { data: targets = [] } = useQuery({
    queryKey: ["crm-targets", month],
    queryFn: async () => { const { data, error } = await supabase.from("crm_targets").select("*").eq("month", `${month}-01`); if (error) throw error; return data; },
  });

  const targetOf = (uid: string) => Number(targets.find((t) => t.user_id === uid)?.target_value ?? 0);
  const wonOf = (uid: string) => deals.filter((d) => d.owner_id === uid && d.stage === "won" && d.closed_at?.startsWith(month)).reduce((s, d) => s + Number(d.value), 0);

  const everyone = [...new Set([...targets.map((t) => t.user_id), ...team.map((t) => t.user_id)])];
  const members = visibleMembers(user.id, team, everyone, canSeeAll(roles)).filter((id) => targetOf(id) > 0 || wonOf(id) > 0);
  const sum = (ids: string[], f: (id: string) => number) => ids.reduce((s, id) => s + f(id), 0);

  const leaders = [...new Set(team.filter((t) => t.team_leader_id && members.includes(t.user_id)).map((t) => t.team_leader_id as string))];
  const teamOf = (leader: string) => [leader, ...team.filter((t) => t.team_leader_id === leader).map((t) => t.user_id)].filter((id) => members.includes(id));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-3">
        <div className="mr-auto">
          <h1 className="text-2xl font-semibold text-foreground">Target Dashboard</h1>
          <p className="text-sm text-muted-foreground">Won deal value vs. monthly target — you see yourself and the people you lead or manage.</p>
        </div>
        <input type="month" className="rounded-md border bg-background px-3 py-2 text-sm text-foreground" value={month} onChange={(e) => e.target.value && setMonth(e.target.value)} aria-label="Month" />
      </div>

      {members.length === 0 ? (
        <p className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">No targets set for this month yet. Set them on the Targets page.</p>
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-[auto_1fr] md:items-center">
            <TargetGauge size="lg" label={members.length > 1 ? "Overall" : "My target"} sub={`${inr(sum(members, wonOf))} of ${inr(sum(members, targetOf))}`} achieved={sum(members, wonOf)} target={sum(members, targetOf)} />
            {leaders.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {leaders.map((l) => { const ids = teamOf(l); return (
                  <TargetGauge key={l} label={`Team: ${people[l] ?? "Leader"}`} sub={`${ids.length} people · ${inr(sum(ids, wonOf))} of ${inr(sum(ids, targetOf))}`} achieved={sum(ids, wonOf)} target={sum(ids, targetOf)} />
                ); })}
              </div>
            )}
          </section>
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Each employee</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {members.map((id) => (
                <TargetGauge key={id} label={people[id] ?? "Unknown"} sub={`${inr(wonOf(id))} of ${inr(targetOf(id))}`} achieved={wonOf(id)} target={targetOf(id)} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
