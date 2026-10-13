import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { fetchPeople } from "@/lib/crm";

export const Route = createFileRoute("/_authenticated/admin/routing")({
  head: () => ({ meta: [{ title: "Enquiry Routing — RIPL Admin" }, { name: "robots", content: "noindex" }] }),
  component: RoutingPage,
});

const input = "w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground";
const LEAD_TYPES = ["manufacturer", "retailer", "distributor", "funding", "global", "general", "contact"] as const;

type Assignment = { id: string; user_id: string; lead_types: string[]; states: string[]; priority: number };

async function fetchAssignments(): Promise<Assignment[]> {
  const { data, error } = await supabase.from("staff_assignments").select("*").order("priority", { ascending: false });
  if (error) throw error;
  return data;
}

function RoutingPage() {
  const qc = useQueryClient();
  const { data: rules = [] } = useQuery({ queryKey: ["assignments"], queryFn: fetchAssignments });
  const { data: people = {} } = useQuery({ queryKey: ["crm-people"], queryFn: fetchPeople });
  const [adding, setAdding] = useState(false);

  async function remove(a: Assignment) {
    const { error } = await supabase.from("staff_assignments").delete().eq("id", a.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Rule removed");
    qc.invalidateQueries({ queryKey: ["assignments"] });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="mr-auto">
          <h1 className="text-2xl font-semibold text-foreground">Enquiry Routing</h1>
          <p className="text-sm text-muted-foreground">New enquiries are auto-assigned to staff by enquiry type and state. Empty type/state means "matches everything". Higher priority wins.</p>
        </div>
        <Button onClick={() => setAdding((v) => !v)}>{adding ? "Close" : "New rule"}</Button>
      </div>
      {adding && <NewRule people={people} onDone={() => { setAdding(false); qc.invalidateQueries({ queryKey: ["assignments"] }); }} />}
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-muted/60 text-xs uppercase text-muted-foreground">
            <tr><th className="p-3">Staff member</th><th className="p-3">Enquiry types</th><th className="p-3">States</th><th className="p-3">Priority</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {rules.map((a) => (
              <tr key={a.id} className="border-t">
                <td className="p-3 font-medium text-foreground">{people[a.user_id] ?? "Unknown"}</td>
                <td className="p-3 text-muted-foreground">{a.lead_types.length ? a.lead_types.join(", ") : "All types"}</td>
                <td className="p-3 text-muted-foreground">{a.states.length ? a.states.join(", ") : "All states"}</td>
                <td className="p-3">{a.priority}</td>
                <td className="p-3 text-right"><Button size="sm" variant="outline" onClick={() => remove(a)}>Delete</Button></td>
              </tr>
            ))}
            {!rules.length && <tr><td className="p-6 text-center text-muted-foreground" colSpan={5}>No routing rules yet — enquiries stay unassigned until you add one.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function NewRule({ people, onDone }: { people: Record<string, string>; onDone: () => void }) {
  const [userId, setUserId] = useState("");
  const [types, setTypes] = useState<string[]>([]);
  const [states, setStates] = useState("");
  const [priority, setPriority] = useState("0");

  function toggleType(t: string) {
    setTypes((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
  }
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) { toast.error("Pick a staff member."); return; }
    const { error } = await supabase.from("staff_assignments").insert({
      user_id: userId,
      lead_types: types,
      states: states.split(",").map((s) => s.trim()).filter(Boolean),
      priority: Number(priority) || 0,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Rule added");
    onDone();
  }
  return (
    <form onSubmit={submit} className="space-y-3 rounded-lg border bg-card p-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="text-xs text-muted-foreground">Staff member
          <select className={input} value={userId} onChange={(e) => setUserId(e.target.value)}>
            <option value="">Select…</option>
            {Object.entries(people).map(([id, n]) => <option key={id} value={id}>{n}</option>)}
          </select>
        </label>
        <label className="text-xs text-muted-foreground">States (comma separated, e.g. Bihar, UP)
          <input className={input} maxLength={300} value={states} onChange={(e) => setStates(e.target.value)} placeholder="All states" />
        </label>
        <label className="text-xs text-muted-foreground">Priority (higher wins)
          <input className={input} type="number" value={priority} onChange={(e) => setPriority(e.target.value)} />
        </label>
      </div>
      <fieldset className="flex flex-wrap gap-3 text-sm text-foreground">
        <legend className="text-xs text-muted-foreground">Enquiry types (none ticked = all)</legend>
        {LEAD_TYPES.map((t) => (
          <label key={t} className="flex items-center gap-1.5">
            <input type="checkbox" checked={types.includes(t)} onChange={() => toggleType(t)} /> {t}
          </label>
        ))}
      </fieldset>
      <Button type="submit">Save rule</Button>
    </form>
  );
}
