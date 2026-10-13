import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { fetchMyRoles } from "@/lib/admin";

export const Route = createFileRoute("/_authenticated/admin/stores")({
  head: () => ({ meta: [{ title: "Stores — RIPL Admin" }, { name: "robots", content: "noindex" }] }),
  component: StoresPage,
});

const input = "w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground";

type StoreRow = {
  id: string; name: string; state: string; area: string | null; district: string | null;
  address: string | null; phone: string | null; store_type: string; is_active: boolean;
};

async function fetchStores(): Promise<StoreRow[]> {
  const { data, error } = await supabase.from("stores").select("*").order("state").order("district").order("name");
  if (error) throw error;
  return data;
}

function StoresPage() {
  const qc = useQueryClient();
  const { data: roles = [] } = useQuery({ queryKey: ["my-roles"], queryFn: fetchMyRoles });
  const { data: stores = [] } = useQuery({ queryKey: ["admin-stores"], queryFn: fetchStores });
  const [adding, setAdding] = useState(false);
  const [filter, setFilter] = useState("");
  const canEdit = roles.some((r) => ["super_admin", "admin", "store_manager"].includes(r));

  const shown = stores.filter((s) => !filter || [s.name, s.state, s.district ?? "", s.area ?? ""].join(" ").toLowerCase().includes(filter.toLowerCase()));

  async function toggleActive(s: StoreRow) {
    const { error } = await supabase.from("stores").update({ is_active: !s.is_active }).eq("id", s.id);
    if (error) { toast.error(error.message); return; }
    qc.invalidateQueries({ queryKey: ["admin-stores"] });
  }
  async function remove(s: StoreRow) {
    const { error } = await supabase.from("stores").delete().eq("id", s.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Store removed");
    qc.invalidateQueries({ queryKey: ["admin-stores"] });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="mr-auto">
          <h1 className="text-2xl font-semibold text-foreground">Stores</h1>
          <p className="text-sm text-muted-foreground">{stores.length} stores · {stores.filter((s) => s.is_active).length} active (shown on the public store list)</p>
        </div>
        <input className={input + " w-auto"} placeholder="Search name / state / district" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Search stores" />
        {canEdit && <Button onClick={() => setAdding((v) => !v)}>{adding ? "Close" : "New store"}</Button>}
      </div>
      {adding && <NewStore onDone={() => { setAdding(false); qc.invalidateQueries({ queryKey: ["admin-stores"] }); }} />}
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-muted/60 text-xs uppercase text-muted-foreground">
            <tr><th className="p-3">Name</th><th className="p-3">State</th><th className="p-3">Area</th><th className="p-3">District</th><th className="p-3">Phone</th><th className="p-3">Status</th>{canEdit && <th className="p-3"></th>}</tr>
          </thead>
          <tbody>
            {shown.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="p-3 font-medium text-foreground">{s.name}</td>
                <td className="p-3">{s.state}</td>
                <td className="p-3 text-muted-foreground">{s.area || "—"}</td>
                <td className="p-3 text-muted-foreground">{s.district || "—"}</td>
                <td className="p-3 text-muted-foreground">{s.phone || "—"}</td>
                <td className="p-3">{s.is_active ? <span className="text-primary">Active</span> : <span className="text-muted-foreground">Hidden</span>}</td>
                {canEdit && <td className="p-3 text-right">
                  <Button size="sm" variant="outline" onClick={() => toggleActive(s)}>{s.is_active ? "Hide" : "Show"}</Button>{" "}
                  <Button size="sm" variant="outline" onClick={() => remove(s)}>Delete</Button>
                </td>}
              </tr>
            ))}
            {!shown.length && <tr><td className="p-6 text-center text-muted-foreground" colSpan={7}>No stores yet. Add the first store above.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function NewStore({ onDone }: { onDone: () => void }) {
  const [f, setF] = useState({ name: "", state: "", area: "", district: "", address: "", phone: "", store_type: "retail" });
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (f.name.trim().length < 2 || !f.state.trim()) { toast.error("Name and state are required."); return; }
    const { error } = await supabase.from("stores").insert({ ...f, name: f.name.trim(), state: f.state.trim() });
    if (error) { toast.error(error.message); return; }
    toast.success("Store added");
    onDone();
  }
  return (
    <form onSubmit={submit} className="grid gap-3 rounded-lg border bg-card p-4 sm:grid-cols-3">
      <input className={input} placeholder="Store name *" maxLength={120} value={f.name} onChange={set("name")} />
      <input className={input} placeholder="State *" maxLength={60} value={f.state} onChange={set("state")} />
      <input className={input} placeholder="Area" maxLength={60} value={f.area} onChange={set("area")} />
      <input className={input} placeholder="District" maxLength={60} value={f.district} onChange={set("district")} />
      <input className={input} placeholder="Address" maxLength={200} value={f.address} onChange={set("address")} />
      <input className={input} placeholder="Phone" maxLength={20} value={f.phone} onChange={set("phone")} />
      <div className="sm:col-span-3"><Button type="submit">Save store</Button></div>
    </form>
  );
}
