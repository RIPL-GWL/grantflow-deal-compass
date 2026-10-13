import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { fetchMyRoles } from "@/lib/admin";
import { followupState, logActivity, canSeeAll, fetchDeals, fetchPeople, inr, isManager, PIPELINE_LABELS, PIPELINES, STAGE_LABELS, STAGES, type Deal } from "@/lib/crm";

export const Route = createFileRoute("/_authenticated/admin/crm")({
  head: () => ({ meta: [{ title: "Sales Pipeline — RIPL Admin" }, { name: "robots", content: "noindex" }] }),
  component: CrmPage,
});

const input = "w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground";

function CrmPage() {
  const qc = useQueryClient();
  const { user } = Route.useRouteContext();
  const { data: roles = [] } = useQuery({ queryKey: ["my-roles"], queryFn: fetchMyRoles });
  const { data: deals = [] } = useQuery({ queryKey: ["crm-deals"], queryFn: fetchDeals });
  const { data: people = {} } = useQuery({ queryKey: ["crm-people"], queryFn: fetchPeople });
  const [pipeline, setPipeline] = useState("");
  const [owner, setOwner] = useState("");
  const [adding, setAdding] = useState(false);
  const manager = isManager(roles);

  const shown = deals.filter((d) => (!pipeline || d.pipeline === pipeline) && (!owner || d.owner_id === owner));
  const owners = [...new Set(deals.map((d) => d.owner_id))];

  const [dragId, setDragId] = useState<string | null>(null);
  async function move(d: Deal, stage: string) {
    if (d.stage === stage) return;
    const { error } = await supabase.from("crm_deals").update({ stage }).eq("id", d.id);
    if (error) { toast.error(error.message); return; }
    await logActivity(d.id, "stage", `Stage: ${STAGE_LABELS[d.stage]} → ${STAGE_LABELS[stage]}`);
    qc.invalidateQueries({ queryKey: ["crm-deals"] });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="mr-auto">
          <h1 className="text-2xl font-semibold text-foreground">Sales Pipeline</h1>
          <p className="text-sm text-muted-foreground">Drag cards between columns to change stage · {canSeeAll(roles) ? "All team deals" : "Your deals"} · Open value {inr(shown.filter((d) => !["won", "lost"].includes(d.stage)).reduce((s, d) => s + Number(d.value), 0))}</p>
        </div>
        <select className={input + " w-auto"} value={pipeline} onChange={(e) => setPipeline(e.target.value)} aria-label="Pipeline">
          <option value="">All pipelines</option>{PIPELINES.map((p) => <option key={p} value={p}>{PIPELINE_LABELS[p]}</option>)}
        </select>
        {canSeeAll(roles) && <select className={input + " w-auto"} value={owner} onChange={(e) => setOwner(e.target.value)} aria-label="Salesperson">
          <option value="">Everyone</option>{owners.map((o) => <option key={o} value={o}>{people[o] ?? "Unknown"}</option>)}
        </select>}
        {!roles.includes("viewer") || manager ? <Button onClick={() => setAdding((v) => !v)}>{adding ? "Close" : "New deal"}</Button> : null}
      </div>
      {adding && <NewDeal userId={user.id} manager={manager} people={people} onDone={() => { setAdding(false); qc.invalidateQueries({ queryKey: ["crm-deals"] }); }} />}
      <div className="grid gap-3 overflow-x-auto md:grid-cols-3 xl:grid-cols-6">
        {STAGES.map((s) => {
          const col = shown.filter((d) => d.stage === s);
          return (
            <section key={s} className="min-w-52 rounded-lg border bg-muted/40 p-2" onDragOver={(e) => e.preventDefault()} onDrop={() => { const d = deals.find((x) => x.id === dragId); setDragId(null); if (d) void move(d, s); }}>
              <h2 className="flex justify-between px-1 pb-2 text-sm font-semibold text-foreground"><span>{STAGE_LABELS[s]} ({col.length})</span><span className="text-muted-foreground">{inr(col.reduce((a, d) => a + Number(d.value), 0))}</span></h2>
              <div className="space-y-2">
                {col.map((d) => (
                  <article key={d.id} draggable onDragStart={() => setDragId(d.id)} className="cursor-grab rounded-md border bg-card p-2 text-sm active:cursor-grabbing">
                    <Link to="/admin/deals/$id" params={{ id: d.id }} className="font-medium text-foreground hover:text-primary">{d.title}</Link>
                    <p className="text-muted-foreground">{d.company || d.contact_name || PIPELINE_LABELS[d.pipeline]}</p>
                    <p className="font-semibold text-foreground">{inr(Number(d.value))}</p>
                    {followupState(d.next_followup_at) && <p className={`text-xs ${followupState(d.next_followup_at) === "overdue" ? "text-destructive" : "text-primary"}`}>Follow-up: {new Date(d.next_followup_at!).toLocaleDateString("en-IN")}</p>}
                    {canSeeAll(roles) && <p className="text-xs text-muted-foreground">{people[d.owner_id] ?? ""}</p>}
                    <select className="mt-1 w-full rounded border bg-background px-1 py-1 text-xs text-foreground" value={d.stage} onChange={(e) => move(d, e.target.value)} aria-label="Move stage">
                      {STAGES.map((x) => <option key={x} value={x}>{STAGE_LABELS[x]}</option>)}
                    </select>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function NewDeal({ userId, manager, people, onDone }: { userId: string; manager: boolean; people: Record<string, string>; onDone: () => void }) {
  const [f, setF] = useState({ title: "", company: "", contact_name: "", phone: "", email: "", value: "", pipeline: "general", expected_close: "", owner_id: userId });
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (f.title.trim().length < 2) { toast.error("Add a deal name."); return; }
    const { error } = await supabase.from("crm_deals").insert({ ...f, title: f.title.trim(), value: Number(f.value) || 0, expected_close: f.expected_close || null });
    if (error) { toast.error(error.message); return; }
    toast.success("Deal added");
    onDone();
  }
  return (
    <form onSubmit={submit} className="grid gap-3 rounded-lg border bg-card p-4 sm:grid-cols-3">
      <input className={input} placeholder="Deal name *" maxLength={200} value={f.title} onChange={set("title")} />
      <input className={input} placeholder="Company" maxLength={200} value={f.company} onChange={set("company")} />
      <input className={input} placeholder="Contact person" maxLength={120} value={f.contact_name} onChange={set("contact_name")} />
      <input className={input} placeholder="Phone" maxLength={20} value={f.phone} onChange={set("phone")} />
      <input className={input} placeholder="Email" type="email" maxLength={200} value={f.email} onChange={set("email")} />
      <input className={input} placeholder="Value (₹)" type="number" min={0} value={f.value} onChange={set("value")} />
      <select className={input} value={f.pipeline} onChange={set("pipeline")}>{PIPELINES.map((p) => <option key={p} value={p}>{PIPELINE_LABELS[p]}</option>)}</select>
      <label className="text-xs text-muted-foreground">Expected close<input className={input} type="date" value={f.expected_close} onChange={set("expected_close")} /></label>
      {manager && <label className="text-xs text-muted-foreground">Assigned to<select className={input} value={f.owner_id} onChange={set("owner_id")}>{Object.entries(people).map(([id, n]) => <option key={id} value={id}>{n}</option>)}</select></label>}
      <div className="sm:col-span-3"><Button type="submit">Save deal</Button></div>
    </form>
  );
}
