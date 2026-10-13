import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { fetchMyRoles } from "@/lib/admin";
import { inr, monthStart, STAGE_LABELS, type Deal, type Target } from "@/lib/crm";

export const Route = createFileRoute("/_authenticated/portal")({
  head: () => ({ meta: [{ title: "Employee Portal — Rishishwar Industry" }, { name: "robots", content: "noindex" }] }),
  component: EmployeePortal,
});

type Employee = { employee_id: string; full_name: string; designation: string; department: string; work_location: string; date_of_joining: string | null; official_email: string | null };
type Note = { id: string; title: string; body: string; published_at: string };

function EmployeePortal() {
  const { user } = Route.useRouteContext();
  const { data: roles = [] } = useQuery({ queryKey: ["my-roles"], queryFn: fetchMyRoles });
  const { data: employee } = useQuery({
    queryKey: ["my-employee"],
    queryFn: async (): Promise<Employee | null> => {
      const { data } = await supabase.from("employees").select("employee_id, full_name, designation, department, work_location, date_of_joining, official_email").eq("user_id", user.id).maybeSingle();
      return data;
    },
  });
  const { data: deals = [] } = useQuery({
    queryKey: ["my-deals"],
    queryFn: async (): Promise<Deal[]> => {
      const { data, error } = await supabase.from("crm_deals").select("*").eq("owner_id", user.id).order("updated_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const { data: targets = [] } = useQuery({
    queryKey: ["my-targets"],
    queryFn: async (): Promise<Target[]> => {
      const { data, error } = await supabase.from("crm_targets").select("*").eq("user_id", user.id).order("month", { ascending: false }).limit(6);
      if (error) throw error;
      return data;
    },
  });
  const { data: notes = [] } = useQuery({
    queryKey: ["announcements"],
    queryFn: async (): Promise<Note[]> => {
      const { data, error } = await supabase.from("announcements").select("id, title, body, published_at").order("published_at", { ascending: false }).limit(10);
      if (error) throw error;
      return data;
    },
  });

  const thisMonth = monthStart();
  const target = targets.find((t) => t.month === thisMonth);
  const achieved = deals.filter((d) => d.stage === "won" && d.closed_at && d.closed_at >= thisMonth).reduce((s, d) => s + Number(d.value), 0);
  const open = deals.filter((d) => !["won", "lost"].includes(d.stage));

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10">
      <header>
        <h1 className="text-2xl font-semibold text-foreground">Employee Portal</h1>
        <p className="text-sm text-muted-foreground">Your ID card, targets and work in one place.</p>
      </header>

      <section className="rounded-lg border bg-card p-5">
        <h2 className="mb-3 text-lg font-semibold text-foreground">My ID card</h2>
        {employee ? (
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div><dt className="text-xs uppercase text-muted-foreground">Name</dt><dd className="font-medium text-foreground">{employee.full_name}</dd></div>
            <div><dt className="text-xs uppercase text-muted-foreground">Employee ID</dt><dd className="font-medium text-foreground">{employee.employee_id}</dd></div>
            <div><dt className="text-xs uppercase text-muted-foreground">Designation</dt><dd className="text-foreground">{employee.designation}</dd></div>
            <div><dt className="text-xs uppercase text-muted-foreground">Department</dt><dd className="text-foreground">{employee.department}</dd></div>
            <div><dt className="text-xs uppercase text-muted-foreground">Work location</dt><dd className="text-foreground">{employee.work_location}</dd></div>
            <div><dt className="text-xs uppercase text-muted-foreground">Joined</dt><dd className="text-foreground">{employee.date_of_joining ? new Date(employee.date_of_joining).toLocaleDateString("en-IN") : "—"}</dd></div>
          </dl>
        ) : (
          <p className="text-sm text-muted-foreground">Your account is not linked to an employee record yet. Please ask HR to link it.</p>
        )}
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border bg-card p-4"><p className="text-xs uppercase text-muted-foreground">This month's target</p><p className="mt-1 text-2xl font-semibold text-foreground">{target ? inr(Number(target.target_value)) : "—"}</p></div>
        <div className="rounded-lg border bg-card p-4"><p className="text-xs uppercase text-muted-foreground">Won this month</p><p className="mt-1 text-2xl font-semibold text-foreground">{inr(achieved)}</p></div>
        <div className="rounded-lg border bg-card p-4"><p className="text-xs uppercase text-muted-foreground">Open deals</p><p className="mt-1 text-2xl font-semibold text-foreground">{open.length}</p></div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">My deals</h2>
          {roles.length > 0 && <Link to="/admin/crm" className="text-sm text-primary">Open full pipeline →</Link>}
        </div>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-muted/60 text-xs uppercase text-muted-foreground"><tr><th className="p-3">Deal</th><th className="p-3">Value</th><th className="p-3">Stage</th><th className="p-3">Updated</th></tr></thead>
            <tbody>
              {deals.slice(0, 10).map((d) => (
                <tr key={d.id} className="border-t">
                  <td className="p-3 font-medium text-foreground">{d.title}</td>
                  <td className="p-3">{inr(Number(d.value))}</td>
                  <td className="p-3"><span className="rounded-full bg-secondary px-2 py-0.5 text-xs">{STAGE_LABELS[d.stage] ?? d.stage}</span></td>
                  <td className="p-3 text-muted-foreground">{new Date(d.updated_at).toLocaleDateString("en-IN")}</td>
                </tr>
              ))}
              {!deals.length && <tr><td className="p-6 text-center text-muted-foreground" colSpan={4}>No deals assigned to you yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Announcements</h2>
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
