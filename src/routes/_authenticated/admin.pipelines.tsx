import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { fetchMyRoles } from "@/lib/admin";
import { fetchPeople, fetchPipelines, fetchTeam, isManager, type Pipeline } from "@/lib/crm";

export const Route = createFileRoute("/_authenticated/admin/pipelines")({
  head: () => ({ meta: [{ title: "Manage Pipelines & Teams — RIPL Admin" }, { name: "robots", content: "noindex" }] }),
  component: PipelinesPage,
});

const input = "rounded-md border bg-background px-3 py-2 text-sm text-foreground";
const slug = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function PipelinesPage() {
  const qc = useQueryClient();
  const { data: roles = [] } = useQuery({ queryKey: ["my-roles"], queryFn: fetchMyRoles });
  const { data: people = {} } = useQuery({ queryKey: ["crm-people"], queryFn: fetchPeople });
  const { data: pipelines = [] } = useQuery({ queryKey: ["crm-pipelines"], queryFn: fetchPipelines });
  const { data: team = [] } = useQuery({ queryKey: ["crm-team"], queryFn: fetchTeam });
  const canEdit = isManager(roles);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  async function run(p: PromiseLike<{ error: { message: string } | null }>, key: string, ok?: string) {
    const { error } = await p;
    if (error) { toast.error(error.message); return; }
    if (ok) toast.success(ok);
    qc.invalidateQueries({ queryKey: [key] });
  }

  async function create() {
    const key = slug(name);
    if (!key) return;
    if (pipelines.some((p) => p.key === key)) { toast.error("A pipeline with this name already exists"); return; }
    await run(supabase.from("crm_pipelines").insert({ key, name: name.trim(), description: desc.trim() || null, members: [], sort_order: pipelines.length * 10 + 10, is_active: true }), "crm-pipelines", "Pipeline created");
    setName(""); setDesc("");
  }

  const update = (p: Pipeline, patch: Partial<Pipeline>) => run(supabase.from("crm_pipelines").update(patch).eq("key", p.key), "crm-pipelines");
  const setLink = (user_id: string, patch: { team_leader_id?: string | null; manager_id?: string | null }) => {
    const cur = team.find((t) => t.user_id === user_id);
    return run(supabase.from("sales_team_members").upsert({ user_id, team_leader_id: cur?.team_leader_id ?? null, manager_id: cur?.manager_id ?? null, ...patch }, { onConflict: "user_id" }), "crm-team", "Team updated");
  };
  const ppl = Object.entries(people);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Manage Pipelines & Teams</h1>
        <p className="text-sm text-muted-foreground">Create pipelines, choose who works in each, and set every employee's team leader and manager.</p>
      </div>

      {canEdit && (
        <form className="flex flex-wrap gap-2 rounded-lg border bg-card p-4" onSubmit={(e) => { e.preventDefault(); create(); }}>
          <input className={input} placeholder="New pipeline name" value={name} onChange={(e) => setName(e.target.value)} aria-label="Pipeline name" />
          <input className={input + " min-w-56 flex-1"} placeholder="Description (optional)" value={desc} onChange={(e) => setDesc(e.target.value)} aria-label="Description" />
          <Button type="submit" disabled={!slug(name)}>Create pipeline</Button>
        </form>
      )}

      <section className="grid gap-4 lg:grid-cols-2">
        {pipelines.map((p) => (
          <div key={p.key} className="rounded-lg border bg-card p-4">
            <div className="mb-3 flex items-start gap-3">
              <div className="mr-auto">
                <h2 className="font-semibold text-foreground">{p.name}</h2>
                {p.description && <p className="text-xs text-muted-foreground">{p.description}</p>}
              </div>
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                {p.is_active ? "Active" : "Off"}
                <Switch checked={p.is_active} disabled={!canEdit} onCheckedChange={(v) => update(p, { is_active: v })} aria-label={`${p.name} active`} />
              </label>
            </div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Members ({p.members.length})</p>
            <div className="flex flex-wrap gap-2">
              {ppl.map(([id, n]) => {
                const on = p.members.includes(id);
                return (
                  <button key={id} type="button" disabled={!canEdit}
                    onClick={() => update(p, { members: on ? p.members.filter((m) => m !== id) : [...p.members, id] })}
                    className={`rounded-full border px-3 py-1 text-xs transition ${on ? "border-primary bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:text-foreground"}`}>
                    {n}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-lg border bg-card">
        <div className="border-b p-4">
          <h2 className="font-semibold text-foreground">Team structure</h2>
          <p className="text-xs text-muted-foreground">Team leaders see their team's targets; managers see everyone under them.</p>
        </div>
        {ppl.map(([id, n]) => {
          const link = team.find((t) => t.user_id === id);
          const others = ppl.filter(([o]) => o !== id);
          return (
            <div key={id} className="flex flex-wrap items-center gap-3 border-b p-3 text-sm last:border-0">
              <span className="w-48 font-medium text-foreground">{n}</span>
              <label className="flex items-center gap-2 text-muted-foreground">Team leader
                <select className={input} disabled={!canEdit} value={link?.team_leader_id ?? ""} onChange={(e) => setLink(id, { team_leader_id: e.target.value || null })}>
                  <option value="">None</option>{others.map(([o, on]) => <option key={o} value={o}>{on}</option>)}
                </select>
              </label>
              <label className="flex items-center gap-2 text-muted-foreground">Manager
                <select className={input} disabled={!canEdit} value={link?.manager_id ?? ""} onChange={(e) => setLink(id, { manager_id: e.target.value || null })}>
                  <option value="">None</option>{others.map(([o, on]) => <option key={o} value={o}>{on}</option>)}
                </select>
              </label>
            </div>
          );
        })}
      </section>
    </div>
  );
}
