import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChevronDown, ChevronRight, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { fetchMyRoles } from "@/lib/admin";

export const Route = createFileRoute("/_authenticated/admin/store-network")({
  head: () => ({ meta: [{ title: "Store Network — RIPL Admin" }, { name: "robots", content: "noindex" }] }),
  component: StoreNetworkPage,
});

type Row = { id: string; state: string; area: string; district: string; stores: number; is_visible: boolean; sort_order: number };

async function fetchAll(): Promise<Row[]> {
  const { data, error } = await supabase.from("store_network").select("id,state,area,district,stores,is_visible,sort_order").order("sort_order").limit(5000);
  if (error) throw error;
  return data as Row[];
}

function StoreNetworkPage() {
  const qc = useQueryClient();
  const { data: roles = [] } = useQuery({ queryKey: ["my-roles"], queryFn: fetchMyRoles });
  const { data: rows = [], isLoading } = useQuery({ queryKey: ["admin-store-network"], queryFn: fetchAll });
  const [open, setOpen] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const canEdit = roles.some((r) => ["super_admin", "admin", "store_manager"].includes(r));

  const states = useMemo(() => {
    const m = new Map<string, Row[]>();
    for (const r of rows) m.set(r.state, [...(m.get(r.state) ?? []), r]);
    return [...m.entries()].map(([state, list]) => ({
      state, list,
      total: list.reduce((t, r) => t + r.stores, 0),
      publicTotal: list.filter((r) => r.is_visible).reduce((t, r) => t + r.stores, 0),
      visible: list.some((r) => r.is_visible),
    })).sort((a, b) => b.total - a.total);
  }, [rows]);

  const publicStores = rows.filter((r) => r.is_visible).reduce((t, r) => t + r.stores, 0);
  const publicDistricts = rows.filter((r) => r.is_visible && r.stores > 0).length;
  const refresh = () => { qc.invalidateQueries({ queryKey: ["admin-store-network"] }); qc.invalidateQueries({ queryKey: ["public-store-network"] }); };

  async function setVisible(ids: string[], is_visible: boolean) {
    const { error } = await supabase.from("store_network").update({ is_visible, updated_at: new Date().toISOString() }).in("id", ids);
    if (error) return toast.error(error.message);
    refresh();
  }
  async function saveCount(r: Row) {
    const n = Math.max(0, Math.floor(Number(drafts[r.id])));
    if (!Number.isFinite(n)) return toast.error("Enter a valid number");
    const { error } = await supabase.from("store_network").update({ stores: n, updated_at: new Date().toISOString() }).eq("id", r.id);
    if (error) return toast.error(error.message);
    setDrafts(({ [r.id]: _, ...rest }) => rest);
    toast.success(`${r.district}: ${n} stores saved`);
    refresh();
  }

  const q = filter.toLowerCase();
  const shown = states.filter((s) => !q || s.state.toLowerCase().includes(q) || s.list.some((r) => `${r.district} ${r.area}`.toLowerCase().includes(q)));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl">Store Network</h1>
          <p className="text-sm text-muted-foreground">Change store numbers and choose which states and districts appear on the website. Districts with 0 stores never show publicly.</p>
        </div>
        <div className="flex gap-6 text-right">
          <div><p className="text-xs uppercase text-muted-foreground">Website stores</p><p className="font-display text-2xl">{publicStores.toLocaleString("en-IN")}</p></div>
          <div><p className="text-xs uppercase text-muted-foreground">Website districts</p><p className="font-display text-2xl">{publicDistricts}</p></div>
        </div>
      </div>
      <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Search state, area or district" className="w-full max-w-sm rounded-md border bg-background px-3 py-2 text-sm text-foreground" />
      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
      <div className="divide-y rounded-lg border bg-card">
        {shown.map((s) => {
          const isOpen = open === s.state || (!!q && !s.state.toLowerCase().includes(q));
          const list = q && !s.state.toLowerCase().includes(q) ? s.list.filter((r) => `${r.district} ${r.area}`.toLowerCase().includes(q)) : s.list;
          return (
            <div key={s.state}>
              <div className="flex flex-wrap items-center gap-3 p-3">
                <button type="button" onClick={() => setOpen(isOpen ? null : s.state)} className="flex min-w-0 flex-1 items-center gap-2 text-left font-medium">
                  {isOpen ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}{s.state}
                  <span className="text-xs text-muted-foreground">{s.list.length} districts · {s.total.toLocaleString("en-IN")} stores</span>
                </button>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">{s.visible ? <Eye className="size-3" /> : <EyeOff className="size-3" />}{s.visible ? `On website (${s.publicTotal.toLocaleString("en-IN")})` : "Hidden"}</span>
                {canEdit && <Button size="sm" variant="outline" onClick={() => setVisible(s.list.map((r) => r.id), !s.visible)}>{s.visible ? "Hide state" : "Show state"}</Button>}
              </div>
              {isOpen && (
                <div className="overflow-x-auto border-t">
                  <table className="w-full min-w-[560px] text-sm">
                    <thead className="bg-secondary text-xs uppercase text-muted-foreground"><tr><th className="p-2 text-left">Area</th><th className="p-2 text-left">District</th><th className="p-2 text-left">Stores</th><th className="p-2 text-left">On website</th></tr></thead>
                    <tbody>
                      {list.map((r) => {
                        const d = drafts[r.id];
                        return (
                          <tr key={r.id} className="border-t">
                            <td className="p-2 text-muted-foreground">{r.area}</td>
                            <td className="p-2">{r.district}</td>
                            <td className="p-2">
                              <div className="flex items-center gap-2">
                                <input type="number" min={0} disabled={!canEdit} aria-label={`Stores in ${r.district}`} value={d ?? String(r.stores)} onChange={(e) => setDrafts({ ...drafts, [r.id]: e.target.value })} onKeyDown={(e) => { if (e.key === "Enter" && d !== undefined) saveCount(r); }} className="w-24 rounded-md border bg-background px-2 py-1 text-foreground" />
                                {d !== undefined && Number(d) !== r.stores && <Button size="sm" onClick={() => saveCount(r)}>Save</Button>}
                              </div>
                            </td>
                            <td className="p-2"><Switch checked={r.is_visible} disabled={!canEdit} onCheckedChange={(v) => setVisible([r.id], v)} aria-label={`Show ${r.district} on website`} />{r.is_visible && r.stores === 0 && <span className="ml-2 text-xs text-muted-foreground">(0 stores — not shown)</span>}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
