import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { fetchMyRoles } from "@/lib/admin";
import { inr, STAGE_LABELS, PIPELINE_LABELS } from "@/lib/crm";

export const Route = createFileRoute("/_authenticated/partner")({
  head: () => ({ meta: [{ title: "Partner Portal — Rishishwar Industry" }, { name: "robots", content: "noindex" }] }),
  component: PartnerPortal,
});

type DealRow = { id: string; title: string; stage: string; pipeline: string; value: number; updated_at: string };
type DocRow = { id: string; deal_id: string; name: string; file_path: string; created_at: string };
type Note = { id: string; title: string; body: string; published_at: string };

function PartnerPortal() {
  const { user } = Route.useRouteContext();
  const { data: roles = [] } = useQuery({ queryKey: ["my-roles"], queryFn: fetchMyRoles });
  const { data: deals = [] } = useQuery({
    queryKey: ["partner-deals"],
    queryFn: async (): Promise<DealRow[]> => {
      const { data, error } = await supabase.from("crm_deals").select("id, title, stage, pipeline, value, updated_at").eq("partner_id", user.id).order("updated_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const { data: docs = [] } = useQuery({
    queryKey: ["partner-docs", deals.map((d) => d.id).join(",")],
    enabled: deals.length > 0,
    queryFn: async (): Promise<DocRow[]> => {
      const { data, error } = await supabase.from("crm_documents").select("id, deal_id, name, file_path, created_at").in("deal_id", deals.map((d) => d.id));
      if (error) throw error;
      return data;
    },
  });
  const { data: notes = [] } = useQuery({
    queryKey: ["announcements"],
    queryFn: async (): Promise<Note[]> => {
      const { data, error } = await supabase.from("announcements").select("id, title, body, published_at").order("published_at", { ascending: false }).limit(20);
      if (error) throw error;
      return data;
    },
  });

  async function openDoc(d: DocRow) {
    const { data, error } = await supabase.storage.from("crm-documents").createSignedUrl(d.file_path, 300);
    if (error || !data) return;
    window.open(data.signedUrl, "_blank", "noopener");
  }

  if (!roles.includes("partner") && !roles.length) return null;
  if (!roles.includes("partner")) {
    return <div className="mx-auto max-w-3xl px-4 py-16 text-center"><h1 className="text-xl font-semibold text-foreground">Partner access needed</h1><p className="mt-2 text-sm text-muted-foreground">This portal is for retail partners. Please ask the RIPL team to enable partner access on your account.</p></div>;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10">
      <header>
        <h1 className="text-2xl font-semibold text-foreground">Partner Portal</h1>
        <p className="text-sm text-muted-foreground">Welcome{user.email ? `, ${user.email}` : ""}. Track your work with Rishishwar Industry here.</p>
      </header>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Your deals & status</h2>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-muted/60 text-xs uppercase text-muted-foreground"><tr><th className="p-3">Deal</th><th className="p-3">Type</th><th className="p-3">Value</th><th className="p-3">Status</th><th className="p-3">Last update</th></tr></thead>
            <tbody>
              {deals.map((d) => (
                <tr key={d.id} className="border-t">
                  <td className="p-3 font-medium text-foreground">{d.title}</td>
                  <td className="p-3 text-muted-foreground">{PIPELINE_LABELS[d.pipeline] ?? d.pipeline}</td>
                  <td className="p-3">{inr(Number(d.value))}</td>
                  <td className="p-3"><span className="rounded-full bg-secondary px-2 py-0.5 text-xs">{STAGE_LABELS[d.stage] ?? d.stage}</span></td>
                  <td className="p-3 text-muted-foreground">{new Date(d.updated_at).toLocaleDateString("en-IN")}</td>
                </tr>
              ))}
              {!deals.length && <tr><td className="p-6 text-center text-muted-foreground" colSpan={5}>No deals linked to your account yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Documents</h2>
        {docs.length ? (
          <ul className="space-y-2">
            {docs.map((d) => (
              <li key={d.id} className="flex items-center justify-between rounded-lg border bg-card p-3 text-sm">
                <span className="text-foreground">{d.name}</span>
                <Button size="sm" variant="outline" onClick={() => openDoc(d)}>View</Button>
              </li>
            ))}
          </ul>
        ) : <p className="text-sm text-muted-foreground">No documents shared yet.</p>}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Schemes & updates</h2>
        {notes.length ? (
          <ul className="space-y-3">
            {notes.map((n) => (
              <li key={n.id} className="rounded-lg border bg-card p-4">
                <p className="font-medium text-foreground">{n.title}</p>
                <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{n.body}</p>
                <p className="mt-2 text-xs text-muted-foreground">{new Date(n.published_at).toLocaleDateString("en-IN")}</p>
              </li>
            ))}
          </ul>
        ) : <p className="text-sm text-muted-foreground">No announcements yet.</p>}
      </section>
    </div>
  );
}
