import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ROLE_LABELS, type AppRole } from "@/lib/admin";
import { createStaffUser } from "@/lib/users.functions";

export const Route = createFileRoute("/_authenticated/admin/users")({
  head: () => ({ meta: [{ title: "Users & Roles — RIPL Admin" }, { name: "robots", content: "noindex" }] }),
  component: UsersPage,
});

const ALL_ROLES = Object.keys(ROLE_LABELS) as AppRole[];
const field = "rounded-md border border-input bg-background p-2 text-sm text-foreground";

function UsersPage() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected">("pending");
  const { data, isLoading } = useQuery({
    queryKey: ["users-roles"],
    queryFn: async () => {
      const [p, r] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("user_roles").select("*"),
      ]);
      return { profiles: p.data ?? [], roles: r.data ?? [] };
    },
  });
  const refresh = () => qc.invalidateQueries({ queryKey: ["users-roles"] });

  async function add(userId: string, role: AppRole) {
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
    if (error) { toast.error(error.message); return; }
    refresh();
  }
  async function remove(id: string) {
    const { error } = await supabase.from("user_roles").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    refresh();
  }
  async function approve(userId: string, role: AppRole) {
    const { error } = await supabase.from("profiles").update({ approval_status: "approved" }).eq("id", userId);
    if (error) { toast.error(error.message); return; }
    const { error: e2 } = await supabase.from("user_roles").insert({ user_id: userId, role });
    if (e2 && !/duplicate/i.test(e2.message)) { toast.error(e2.message); return; }
    toast.success("Approved");
    refresh();
  }
  async function reject(userId: string) {
    if (!confirm("Reject this sign-up? They will have no access.")) return;
    const { error } = await supabase.from("profiles").update({ approval_status: "rejected" }).eq("id", userId);
    if (error) { toast.error(error.message); return; }
    await supabase.from("user_roles").delete().eq("user_id", userId);
    toast.success("Rejected");
    refresh();
  }

  const counts = { pending: 0, approved: 0, rejected: 0 };
  data?.profiles.forEach((p) => { counts[p.approval_status as keyof typeof counts]++; });
  const list = data?.profiles.filter((p) => p.approval_status === filter) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Users & Roles</h1>
        <p className="text-sm text-muted-foreground">New sign-ups wait here until you approve them. You can also create accounts directly.</p>
      </div>

      <CreateUser onDone={refresh} />

      <div className="flex flex-wrap gap-2">
        {(["pending", "approved", "rejected"] as const).map((f) => (
          <Button key={f} size="sm" variant={filter === f ? "default" : "outline"} onClick={() => setFilter(f)}>
            {f === "pending" ? "Waiting for approval" : f === "approved" ? "Approved" : "Rejected"} ({counts[f]})
          </Button>
        ))}
      </div>

      {isLoading && <p>Loading…</p>}
      {!isLoading && list.length === 0 && <p className="text-sm text-muted-foreground">No users here.</p>}
      <div className="space-y-2">
        {list.map((p) => {
          const mine = data!.roles.filter((r) => r.user_id === p.id);
          return (
            <div key={p.id} className="flex flex-wrap items-center gap-3 rounded-lg border bg-card p-3">
              <div className="min-w-48">
                <div className="font-medium text-foreground">{p.full_name || "—"}</div>
                <div className="text-xs text-muted-foreground">{p.email} · joined {new Date(p.created_at).toLocaleDateString("en-IN")}</div>
              </div>
              {filter === "pending" ? (
                <ApproveControls onApprove={(r) => approve(p.id, r)} onReject={() => reject(p.id)} />
              ) : filter === "rejected" ? (
                <ApproveControls onApprove={(r) => approve(p.id, r)} label="Approve instead" />
              ) : (
                <>
                  <div className="flex flex-1 flex-wrap gap-1">
                    {mine.length === 0 && <span className="text-xs text-muted-foreground">No role (no access)</span>}
                    {mine.map((r) => (
                      <Badge key={r.id} variant="secondary" className="gap-1">
                        {ROLE_LABELS[r.role]}
                        <button aria-label="Remove role" onClick={() => remove(r.id)}>×</button>
                      </Badge>
                    ))}
                  </div>
                  <select value="" onChange={(e) => e.target.value && add(p.id, e.target.value as AppRole)} className={field}>
                    <option value="">+ Add role</option>
                    {ALL_ROLES.filter((r) => !mine.some((m) => m.role === r)).map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                  </select>
                  <Button size="sm" variant="ghost" onClick={() => reject(p.id)}>Block</Button>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ApproveControls({ onApprove, onReject, label = "Approve" }: { onApprove: (r: AppRole) => void; onReject?: () => void; label?: string }) {
  const [role, setRole] = useState<AppRole>("sales_executive");
  return (
    <div className="ml-auto flex flex-wrap items-center gap-2">
      <select value={role} onChange={(e) => setRole(e.target.value as AppRole)} className={field}>
        {ALL_ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
      </select>
      <Button size="sm" onClick={() => onApprove(role)}>{label}</Button>
      {onReject && <Button size="sm" variant="outline" onClick={onReject}>Reject</Button>}
    </div>
  );
}

function CreateUser({ onDone }: { onDone: () => void }) {
  const create = useServerFn(createStaffUser);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [f, setF] = useState({ fullName: "", email: "", password: "", role: "sales_executive" as AppRole });
  if (!open) return <Button onClick={() => setOpen(true)}>+ Create user</Button>;
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (f.password.length < 8) { toast.error("Password must be at least 8 characters."); return; }
    setBusy(true);
    try {
      await create({ data: { fullName: f.fullName, email: f.email, password: f.password, roles: [f.role] } });
      toast.success(`Account created for ${f.email}. Share the password with them securely.`);
      setF({ fullName: "", email: "", password: "", role: "sales_executive" });
      setOpen(false);
      onDone();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create user");
    } finally { setBusy(false); }
  }
  return (
    <form onSubmit={submit} className="grid gap-3 rounded-lg border bg-card p-4 md:grid-cols-5">
      <input required placeholder="Full name" className={field} value={f.fullName} onChange={(e) => setF({ ...f, fullName: e.target.value })} />
      <input required type="email" placeholder="Email" className={field} value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
      <input required type="text" placeholder="Password (min 8)" className={field} value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
      <select className={field} value={f.role} onChange={(e) => setF({ ...f, role: e.target.value as AppRole })}>
        {ALL_ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
      </select>
      <div className="flex gap-2">
        <Button type="submit" disabled={busy}>{busy ? "Creating…" : "Create"}</Button>
        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
      </div>
    </form>
  );
}
