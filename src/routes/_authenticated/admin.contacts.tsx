import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { fetchMyRoles } from "@/lib/admin";
import { fetchContacts, fetchDeals, inr, isManager, STAGE_LABELS, type Contact } from "@/lib/crm";

export const Route = createFileRoute("/_authenticated/admin/contacts")({
  head: () => ({ meta: [{ title: "Contacts & Companies — RIPL Admin" }, { name: "robots", content: "noindex" }] }),
  component: ContactsPage,
});

const input = "w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground";
const FIELDS = [["name", "Name *"], ["company", "Company"], ["designation", "Designation"], ["phone", "Phone"], ["email", "Email"], ["city", "City"], ["gstin", "GSTIN"], ["address", "Address"]] as const;
type Form = Record<(typeof FIELDS)[number][0] | "notes", string>;
const empty: Form = { name: "", company: "", designation: "", phone: "", email: "", city: "", gstin: "", address: "", notes: "" };

function ContactsPage() {
  const qc = useQueryClient();
  const { data: roles = [] } = useQuery({ queryKey: ["my-roles"], queryFn: fetchMyRoles });
  const { data: contacts = [], isLoading } = useQuery({ queryKey: ["crm-contacts"], queryFn: fetchContacts });
  const { data: deals = [] } = useQuery({ queryKey: ["crm-deals"], queryFn: fetchDeals });
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Contact | "new" | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const refresh = () => qc.invalidateQueries({ queryKey: ["crm-contacts"] });

  const term = q.trim().toLowerCase();
  const list = contacts.filter((c) => !term || [c.name, c.company, c.phone, c.email, c.city].join(" ").toLowerCase().includes(term));

  async function remove(c: Contact) {
    if (!confirm(`Delete ${c.name}? Their deals stay, just unlinked.`)) return;
    const { error } = await supabase.from("crm_contacts").delete().eq("id", c.id);
    if (error) { toast.error(error.message); return; }
    refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="mr-auto">
          <h1 className="text-2xl font-semibold text-foreground">Contacts & Companies</h1>
          <p className="text-sm text-muted-foreground">{contacts.length} customers. Click one to see their deals and history.</p>
        </div>
        <input className={input + " w-64"} placeholder="Search name, company, phone…" value={q} onChange={(e) => setQ(e.target.value)} />
        <Button onClick={() => setEditing("new")}>+ Add contact</Button>
      </div>
      {editing && <ContactForm initial={editing === "new" ? null : editing} onDone={() => { setEditing(null); refresh(); }} onCancel={() => setEditing(null)} />}
      {isLoading && <p>Loading…</p>}
      {!isLoading && list.length === 0 && <p className="text-sm text-muted-foreground">No contacts yet.</p>}
      <div className="space-y-2">
        {list.map((c) => {
          const theirs = deals.filter((d) => d.contact_id === c.id);
          const won = theirs.filter((d) => d.stage === "won").reduce((s, d) => s + Number(d.value), 0);
          return (
            <div key={c.id} className="rounded-lg border bg-card p-3">
              <button className="flex w-full flex-wrap items-center gap-3 text-left" onClick={() => setOpenId(openId === c.id ? null : c.id)}>
                <span className="min-w-48"><span className="block font-medium text-foreground">{c.name}</span><span className="text-xs text-muted-foreground">{[c.designation, c.company].filter(Boolean).join(", ")}</span></span>
                <span className="text-sm text-muted-foreground">{c.phone} {c.email && `· ${c.email}`} {c.city && `· ${c.city}`}</span>
                <span className="ml-auto text-sm text-muted-foreground">{theirs.length} deals · won {inr(won)}</span>
              </button>
              {openId === c.id && (
                <div className="mt-3 space-y-2 border-t pt-3 text-sm">
                  {c.gstin && <p className="text-muted-foreground">GSTIN: {c.gstin}</p>}
                  {c.address && <p className="text-muted-foreground">{c.address}</p>}
                  {c.notes && <p className="whitespace-pre-wrap text-foreground">{c.notes}</p>}
                  {theirs.length === 0 ? <p className="text-muted-foreground">No deals linked. Link one from a deal page.</p> : (
                    <ul className="space-y-1">{theirs.map((d) => <li key={d.id}><Link to="/admin/deals/$id" params={{ id: d.id }} className="text-primary">{d.title}</Link> <span className="text-muted-foreground">· {STAGE_LABELS[d.stage]} · {inr(Number(d.value))}</span></li>)}</ul>
                  )}
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setEditing(c)}>Edit</Button>
                    {isManager(roles) && <Button size="sm" variant="ghost" onClick={() => remove(c)}>Delete</Button>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ContactForm({ initial, onDone, onCancel }: { initial: Contact | null; onDone: () => void; onCancel: () => void }) {
  const [f, setF] = useState<Form>(initial ? Object.fromEntries(Object.keys(empty).map((k) => [k, String(initial[k as keyof Contact] ?? "")])) as Form : empty);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!f.name.trim()) { toast.error("Name is required."); return; }
    const row = Object.fromEntries(Object.entries(f).map(([k, v]) => [k, v.trim() || null])) as Record<string, string | null>;
    const payload = { ...row, name: f.name.trim() };
    const { error } = initial ? await supabase.from("crm_contacts").update(payload).eq("id", initial.id) : await supabase.from("crm_contacts").insert(payload);
    if (error) { toast.error(error.message); return; }
    toast.success("Saved");
    onDone();
  }
  return (
    <form onSubmit={submit} className="grid gap-3 rounded-lg border bg-card p-4 sm:grid-cols-4">
      {FIELDS.map(([k, l]) => <input key={k} className={input} placeholder={l} maxLength={200} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} />)}
      <textarea className={input + " sm:col-span-4"} rows={2} placeholder="Notes" maxLength={4000} value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} />
      <div className="flex gap-2 sm:col-span-4"><Button type="submit">Save contact</Button><Button type="button" variant="outline" onClick={onCancel}>Cancel</Button></div>
    </form>
  );
}
