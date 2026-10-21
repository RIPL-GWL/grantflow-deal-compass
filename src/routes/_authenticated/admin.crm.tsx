import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { fetchMyRoles } from "@/lib/admin";
import { DndContext, PointerSensor, TouchSensor, useDraggable, useDroppable, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { followupState, logActivity, canSeeAll, fetchDeals, fetchPeople, fetchPipelines, fetchTeam, inr, isManager, PIPELINE_LABELS, STAGE_LABELS, STAGES, type Deal } from "@/lib/crm";

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
  const { data: pipelineRows = [] } = useQuery({ queryKey: ["crm-pipelines"], queryFn: fetchPipelines });
  const { data: team = [] } = useQuery({ queryKey: ["crm-team"], queryFn: fetchTeam });
  const [pipeline, setPipeline] = useState("");
  const [owner, setOwner] = useState("");
  const [adding, setAdding] = useState(false);
  const manager = isManager(roles);
  const leads = team.some((t) => t.team_leader_id === user.id || t.manager_id === user.id);
  const canAssign = manager || leads;
  const assignable: Record<string, string> = manager ? people : Object.fromEntries(Object.entries(people).filter(([id]) => id === user.id || team.some((t) => t.user_id === id && (t.team_leader_id === user.id || t.manager_id === user.id))));
  const pipelines = pipelineRows.filter((p) => p.is_active);
  const labels: Record<string, string> = { ...PIPELINE_LABELS, ...Object.fromEntries(pipelineRows.map((p) => [p.key, p.name])) };

  const shown = deals.filter((d) => (!pipeline || d.pipeline === pipeline) && (!owner || d.owner_id === owner));
  const owners = [...new Set(deals.map((d) => d.owner_id))];
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }), useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 6 } }));

  async function move(d: Deal, stage: string) {
    if (d.stage === stage) return;
    qc.setQueryData<Deal[]>(["crm-deals"], (old) => old?.map((x) => (x.id === d.id ? { ...x, stage } : x)));
    const { error } = await supabase.from("crm_deals").update({ stage }).eq("id", d.id);
    if (error) { toast.error(error.message); qc.invalidateQueries({ queryKey: ["crm-deals"] }); return; }
    await logActivity(d.id, "stage", `Stage: ${STAGE_LABELS[d.stage]} → ${STAGE_LABELS[stage]}`);
    qc.invalidateQueries({ queryKey: ["crm-deals"] });
  }
  async function assign(d: Deal, owner_id: string) {
    if (d.owner_id === owner_id) return;
    const { error } = await supabase.from("crm_deals").update({ owner_id }).eq("id", d.id);
    if (error) { toast.error(error.message); return; }
    await logActivity(d.id, "note", `Assigned to ${people[owner_id] ?? "team member"}`);
    toast.success("Deal assigned");
    qc.invalidateQueries({ queryKey: ["crm-deals"] });
  }
  function onDragEnd(e: DragEndEvent) {
    const d = deals.find((x) => x.id === e.active.id);
    if (d && e.over) void move(d, String(e.over.id));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="mr-auto">
          <h1 className="text-2xl font-semibold text-foreground">Sales Pipeline</h1>
          <p className="text-sm text-muted-foreground">Drag cards between columns to change stage · {canSeeAll(roles) ? "All team deals" : leads ? "You and your team" : "Your deals"} · Open value {inr(shown.filter((d) => !["won", "lost"].includes(d.stage)).reduce((s, d) => s + Number(d.value), 0))}</p>
        </div>
        <select className={input + " w-auto"} value={pipeline} onChange={(e) => setPipeline(e.target.value)} aria-label="Pipeline">
          <option value="">All pipelines</option>{pipelines.map((p) => <option key={p.key} value={p.key}>{p.name}</option>)}
        </select>
        {(canSeeAll(roles) || leads) && <select className={input + " w-auto"} value={owner} onChange={(e) => setOwner(e.target.value)} aria-label="Salesperson">
          <option value="">Everyone</option>{owners.map((o) => <option key={o} value={o}>{people[o] ?? "Unknown"}</option>)}
        </select>}
        {!roles.includes("viewer") || manager ? <Button onClick={() => setAdding((v) => !v)}>{adding ? "Close" : "New deal"}</Button> : null}
      </div>
      {adding && <NewDeal userId={user.id} canAssign={canAssign} people={assignable} pipelines={pipelines.map((p) => ({ key: p.key, name: p.name }))} defaultPipeline={pipeline || pipelines[0]?.key || "general"} onDone={() => { setAdding(false); qc.invalidateQueries({ queryKey: ["crm-deals"] }); }} />}
      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {STAGES.map((s) => (
            <Column key={s} stage={s} deals={shown.filter((d) => d.stage === s)}>
              {(d) => (
                <DealCard key={d.id} deal={d}>
                  <Link to="/admin/deals/$id" params={{ id: d.id }} className="font-medium text-foreground hover:text-primary" onPointerDown={(e) => e.stopPropagation()}>{d.title}</Link>
                  <p className="text-muted-foreground">{d.company || d.contact_name || labels[d.pipeline]}</p>
                  <p className="font-semibold text-foreground">{inr(Number(d.value))}</p>
                  <span className="inline-block rounded bg-muted px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">{labels[d.pipeline] ?? d.pipeline}</span>
                  {followupState(d.next_followup_at) && <p className={`text-xs ${followupState(d.next_followup_at) === "overdue" ? "text-destructive" : "text-primary"}`}>Follow-up: {new Date(d.next_followup_at!).toLocaleDateString("en-IN")}</p>}
                  {canAssign ? (
                    <select className="mt-1 w-full rounded border bg-background px-1 py-1 text-xs text-foreground" value={d.owner_id} onPointerDown={(e) => e.stopPropagation()} onChange={(e) => assign(d, e.target.value)} aria-label="Assign to">
                      {!assignable[d.owner_id] && <option value={d.owner_id}>{people[d.owner_id] ?? "Unknown"}</option>}
                      {Object.entries(assignable).map(([id, n]) => <option key={id} value={id}>{n}</option>)}
                    </select>
                  ) : canSeeAll(roles) && <p className="text-xs text-muted-foreground">{people[d.owner_id] ?? ""}</p>}
                  <select className="mt-1 w-full rounded border bg-background px-1 py-1 text-xs text-foreground" value={d.stage} onPointerDown={(e) => e.stopPropagation()} onChange={(e) => move(d, e.target.value)} aria-label="Move stage">
                    {STAGES.map((x) => <option key={x} value={x}>{STAGE_LABELS[x]}</option>)}
                  </select>
                </DealCard>
              )}
            </Column>
          ))}
        </div>
      </DndContext>
    </div>
  );
}

function Column({ stage, deals, children }: { stage: string; deals: Deal[]; children: (d: Deal) => React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });
  return (
    <section ref={setNodeRef} className={`w-64 shrink-0 rounded-lg border bg-muted/40 p-2 transition-colors ${isOver ? "crm-drop-active bg-primary/5" : ""}`}>
      <h2 className="flex justify-between px-1 pb-2 text-sm font-semibold text-foreground"><span>{STAGE_LABELS[stage]} ({deals.length})</span><span className="text-muted-foreground">{inr(deals.reduce((a, d) => a + Number(d.value), 0))}</span></h2>
      <div className="min-h-24 space-y-2">{deals.map(children)}</div>
    </section>
  );
}

function DealCard({ deal, children }: { deal: Deal; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: deal.id });
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 50 } : undefined;
  return (
    <article ref={setNodeRef} style={style} {...listeners} {...attributes} className={`cursor-grab touch-none space-y-0.5 rounded-md border bg-card p-2 text-sm shadow-sm active:cursor-grabbing ${isDragging ? "opacity-80 shadow-lg ring-2 ring-primary" : ""}`}>
      {children}
    </article>
  );
}

function NewDeal({ userId, canAssign, people, pipelines, defaultPipeline, onDone }: { userId: string; canAssign: boolean; people: Record<string, string>; pipelines: { key: string; name: string }[]; defaultPipeline: string; onDone: () => void }) {
  const [f, setF] = useState({ title: "", company: "", contact_name: "", phone: "", email: "", value: "", pipeline: defaultPipeline, expected_close: "", owner_id: userId });
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
      <select className={input} value={f.pipeline} onChange={set("pipeline")}>{pipelines.map((p) => <option key={p.key} value={p.key}>{p.name}</option>)}</select>
      <label className="text-xs text-muted-foreground">Expected close<input className={input} type="date" value={f.expected_close} onChange={set("expected_close")} /></label>
      {canAssign && <label className="text-xs text-muted-foreground">Assigned to<select className={input} value={f.owner_id} onChange={set("owner_id")}>{Object.entries(people).map(([id, n]) => <option key={id} value={id}>{n}</option>)}</select></label>}
      <div className="sm:col-span-3"><Button type="submit">Save deal</Button></div>
    </form>
  );
}
