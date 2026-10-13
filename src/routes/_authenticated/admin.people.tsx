import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { investors } from "@/frontend/features/investors/data";
import { mentors, team } from "@/frontend/features/people/data";

export const Route = createFileRoute("/_authenticated/admin/people")({
  head: () => ({ meta: [{ title: "Investors, Mentors & Team — RIPL Admin" }, { name: "robots", content: "noindex" }] }),
  component: PeoplePage,
});

type Kind = "investor" | "mentor" | "team";
type Field = { key: string; label: string; list?: boolean; long?: boolean; num?: boolean };
const FIELDS: Record<Kind, Field[]> = {
  investor: [{ key: "name", label: "Name" }, { key: "type", label: "Investor type" }, { key: "sectors", label: "Sectors", list: true }, { key: "regions", label: "Regions", list: true }, { key: "stages", label: "Stages", list: true }, { key: "portrait", label: "Photo no. (0-5)", num: true }],
  mentor: [{ key: "name", label: "Name" }, { key: "title", label: "Title" }, { key: "focus", label: "Focus areas", list: true }, { key: "regions", label: "Regions", list: true }, { key: "bio", label: "Bio", long: true }, { key: "quote", label: "Quote", long: true }, { key: "years", label: "Years experience" }, { key: "portrait", label: "Photo no. (0-5)", num: true }],
  team: [{ key: "name", label: "Name" }, { key: "employeeId", label: "Employee ID (shown publicly)" }, { key: "designation", label: "Designation" }, { key: "department", label: "Department" }, { key: "team", label: "Team" }, { key: "location", label: "Work location" }, { key: "skills", label: "Skills", list: true }, { key: "responsibilities", label: "Responsibilities", list: true, long: true }, { key: "portrait", label: "Photo no. (0-5)", num: true }],
};
const DEFAULTS: Record<Kind, { slug: string }[]> = { investor: investors, mentor: mentors, team };
const LABEL: Record<Kind, string> = { investor: "Investors", mentor: "Mentors", team: "Team" };
type Row = { id: string; slug: string; data: Record<string, unknown>; sort_order: number; is_published: boolean };
const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);

function PeoplePage() {
  const [kind, setKind] = useState<Kind>("investor");
  const [editing, setEditing] = useState<Partial<Row> | null>(null);
  const qc = useQueryClient();
  const key = ["directory", kind];
  const { data: rows = [], isLoading } = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await supabase.from("directory_profiles").select("*").eq("kind", kind).order("sort_order").order("created_at");
      if (error) throw error;
      return data as unknown as Row[];
    },
  });
  const refresh = () => qc.invalidateQueries({ queryKey: key });

  async function importDefaults(): Promise<void> {
    const { error } = await supabase.from("directory_profiles").insert(DEFAULTS[kind].map(({ slug, ...d }, i) => ({ kind, slug, data: d as unknown as Json, sort_order: i })));
    if (error) { toast.error(error.message); return; }
    toast.success("Current profiles copied in. You can edit them now.");
    refresh();
  }
  async function save(r: Partial<Row>) {
    const slug = slugify(r.slug || String(r.data?.["name"] ?? ""));
    if (!String(r.data?.["name"] ?? "").trim() || slug.length < 2) { toast.error("Name is required."); return; }
    const payload = { kind, slug, data: r.data as Json, sort_order: r.sort_order ?? rows.length, is_published: r.is_published ?? true };
    const { error } = r.id ? await supabase.from("directory_profiles").update(payload).eq("id", r.id) : await supabase.from("directory_profiles").insert(payload);
    if (error) { toast.error(error.message.includes("duplicate") ? "That web address is already used." : error.message); return; }
    toast.success("Saved");
    setEditing(null);
    refresh();
  }
  async function remove(id: string) {
    if (!confirm("Delete this profile?")) return;
    const { error } = await supabase.from("directory_profiles").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    refresh();
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Investors, Mentors & Team</h1>
        <p className="text-sm text-muted-foreground">Changes appear on the public pages right away. Hidden profiles stay off the site.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {(Object.keys(LABEL) as Kind[]).map((k) => <Button key={k} size="sm" variant={k === kind ? "default" : "outline"} onClick={() => { setKind(k); setEditing(null); }}>{LABEL[k]}</Button>)}
        <Button size="sm" variant="secondary" className="ml-auto" onClick={() => setEditing({ data: {}, is_published: true })}>Add profile</Button>
      </div>
      {isLoading ? null : rows.length === 0 && (
        <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
          The site is currently showing the built-in {LABEL[kind].toLowerCase()} profiles. Copy them here to start editing.
          <div className="mt-3"><Button size="sm" onClick={importDefaults}>Copy current profiles</Button></div>
        </div>
      )}
      {editing && <Editor key={`${kind}-${editing.id ?? "new"}`} kind={kind} row={editing} onCancel={() => setEditing(null)} onSave={save} />}
      <div className="divide-y rounded-lg border bg-card">
        {rows.map((r) => (
          <div key={r.id} className="flex flex-wrap items-center gap-3 p-3 text-sm">
            <div className="min-w-0 flex-1">
              <p className="font-medium text-foreground">{String(r.data["name"] ?? r.slug)} {!r.is_published && <span className="text-muted-foreground">(hidden)</span>}</p>
              <p className="text-muted-foreground">{String(r.data["type"] ?? r.data["title"] ?? r.data["designation"] ?? "")}</p>
            </div>
            <Button size="sm" variant="outline" onClick={() => save({ ...r, is_published: !r.is_published })}>{r.is_published ? "Hide" : "Show"}</Button>
            <Button size="sm" variant="outline" onClick={() => setEditing(r)}>Edit</Button>
            <Button size="sm" variant="ghost" onClick={() => remove(r.id)}>Delete</Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Editor({ kind, row, onCancel, onSave }: { kind: Kind; row: Partial<Row>; onCancel: () => void; onSave: (r: Partial<Row>) => void }) {
  const [data, setData] = useState<Record<string, unknown>>(row.data ?? {});
  const [slug, setSlug] = useState(row.slug ?? "");
  const [order, setOrder] = useState(row.sort_order ?? 0);
  const cls = "mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground";
  return (
    <form className="grid gap-3 rounded-lg border bg-card p-4 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); onSave({ ...row, slug, sort_order: order, data }); }}>
      {FIELDS[kind].map((f) => {
        const v = data[f.key];
        const text = Array.isArray(v) ? v.join(f.long ? "\n" : ", ") : v == null ? "" : String(v);
        const set = (s: string) => setData({ ...data, [f.key]: f.list ? s.split(f.long ? "\n" : ",").map((x) => x.trim()).filter(Boolean) : f.num ? Math.max(0, Math.min(5, Number(s) || 0)) : s });
        return (
          <label key={f.key} className={`text-sm text-muted-foreground ${f.long ? "sm:col-span-2" : ""}`}>
            {f.label}{f.list && <span> ({f.long ? "one per line" : "comma separated"})</span>}
            {f.long ? <textarea className={cls} rows={3} maxLength={2000} defaultValue={text} onBlur={(e) => set(e.target.value)} /> : <input className={cls} maxLength={300} type={f.num ? "number" : "text"} defaultValue={text} onBlur={(e) => set(e.target.value)} />}
          </label>
        );
      })}
      <label className="text-sm text-muted-foreground">Web address (leave blank to use the name)<input className={cls} value={slug} onChange={(e) => setSlug(e.target.value)} /></label>
      <label className="text-sm text-muted-foreground">Display order<input className={cls} type="number" value={order} onChange={(e) => setOrder(Number(e.target.value) || 0)} /></label>
      <div className="flex gap-2 sm:col-span-2"><Button type="submit">Save</Button><Button type="button" variant="outline" onClick={onCancel}>Cancel</Button></div>
    </form>
  );
}
