import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LEAD_STATUSES, STATUS_LABELS } from "@/lib/admin";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({ meta: [
    { title: "Enquiries — RIPL Administration" },
    { name: "description", content: "Manage RIPL business enquiries and funding applications." },
    { property: "og:title", content: "Enquiries — RIPL Administration" },
    { property: "og:description", content: "RIPL enquiry management for authorised staff." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Enquiries,
});

const TYPES = ["all", "manufacturer", "retailer", "distributor", "funding", "global", "general", "contact"];

function Enquiries() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const { data = [], isLoading } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(1000);
      if (error) throw error;
      return data;
    },
  });

  const rows = useMemo(
    () =>
      data.filter(
        (l) =>
          (type === "all" || l.lead_type === type) &&
          (status === "all" || l.status === status) &&
          (!q || `${l.name} ${l.email} ${l.phone} ${l.company ?? ""}`.toLowerCase().includes(q.toLowerCase())),
      ),
    [data, q, type, status],
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    data.forEach((l) => (c[l.status] = (c[l.status] ?? 0) + 1));
    return c;
  }, [data]);

  function exportCsv() {
    const head = ["created_at", "lead_type", "status", "name", "company", "phone", "email", "source_page", "message"];
    const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [head.join(","), ...rows.map((r) => head.map((h) => esc((r as Record<string, unknown>)[h])).join(","))].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "enquiries.csv";
    a.click();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Enquiries</h1>
          <p className="text-sm text-muted-foreground">{data.length} total · {counts["new"] ?? 0} new</p>
        </div>
        <Button variant="outline" onClick={exportCsv}>Export CSV</Button>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {LEAD_STATUSES.map((s) => (
          <button key={s} onClick={() => setStatus(status === s ? "all" : s)} className={`rounded-md border p-3 text-left ${status === s ? "border-primary bg-accent" : "bg-card"}`}>
            <div className="text-xs text-muted-foreground">{STATUS_LABELS[s]}</div>
            <div className="text-lg font-semibold text-foreground">{counts[s] ?? 0}</div>
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <Input placeholder="Search name, phone, email…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" />
        <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-md border bg-background px-3 text-sm text-foreground">
          {TYPES.map((t) => <option key={t} value={t}>{t === "all" ? "All types" : t}</option>)}
        </select>
      </div>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead><TableHead>Name</TableHead><TableHead>Type</TableHead><TableHead>Phone</TableHead><TableHead>Status</TableHead><TableHead>Owner</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={6}>Loading…</TableCell></TableRow>}
            {!isLoading && rows.length === 0 && <TableRow><TableCell colSpan={6} className="text-muted-foreground">No enquiries yet.</TableCell></TableRow>}
            {rows.map((l) => (
              <TableRow key={l.id}>
                <TableCell className="whitespace-nowrap text-xs">{new Date(l.created_at).toLocaleString("en-IN")}</TableCell>
                <TableCell><Link to="/admin/leads/$id" params={{ id: l.id }} className="font-medium text-primary underline-offset-2 hover:underline">{l.name}</Link><div className="text-xs text-muted-foreground">{l.company}</div></TableCell>
                <TableCell><Badge variant="secondary">{l.lead_type}</Badge></TableCell>
                <TableCell>{l.phone}</TableCell>
                <TableCell><Badge>{STATUS_LABELS[l.status] ?? l.status}</Badge></TableCell>
                <TableCell className="text-xs text-muted-foreground">{l.assigned_to ? "Assigned" : "Unassigned"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
