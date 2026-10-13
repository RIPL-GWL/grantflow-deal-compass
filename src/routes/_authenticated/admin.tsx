import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { fetchMyRoles, ROLE_LABELS } from "@/lib/admin";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin Panel — Rishishwar Industry" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const { data: roles = [], isLoading } = useQuery({ queryKey: ["my-roles"], queryFn: fetchMyRoles });
  const isSuper = roles.includes("super_admin");
  const { data: status } = useQuery({
    queryKey: ["my-approval", user.id],
    queryFn: async () => (await supabase.from("profiles").select("approval_status").eq("id", user.id).maybeSingle()).data?.approval_status ?? "pending",
  });

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-3">
          <Link to="/admin" className="font-semibold text-foreground">RIPL Admin</Link>
          <nav className="flex gap-3 text-sm">
            <Link to="/admin" activeOptions={{ exact: true }} className="text-muted-foreground [&.active]:text-primary">Enquiries</Link>
            <Link to="/admin/crm" className="text-muted-foreground [&.active]:text-primary">Pipeline</Link>
            <Link to="/admin/followups" className="text-muted-foreground [&.active]:text-primary">Follow-ups</Link>
            <Link to="/admin/contacts" className="text-muted-foreground [&.active]:text-primary">Contacts</Link>
            <Link to="/admin/targets" className="text-muted-foreground [&.active]:text-primary">Targets</Link>
            <Link to="/admin/stores" className="text-muted-foreground [&.active]:text-primary">Stores</Link>
            {roles.some((r) => ["super_admin", "admin", "lead_manager"].includes(r)) && <Link to="/admin/routing" className="text-muted-foreground [&.active]:text-primary">Routing</Link>}
            <Link to="/admin/reports" className="text-muted-foreground [&.active]:text-primary">Reports</Link>
            {roles.some((r) => ["super_admin", "admin", "content_editor", "hr_manager"].includes(r)) && <Link to="/admin/people" className="text-muted-foreground [&.active]:text-primary">Investors, Mentors & Team</Link>}
            {roles.some((r) => ["super_admin", "admin", "content_editor"].includes(r)) && <Link to="/admin/content" className="text-muted-foreground [&.active]:text-primary">Website Content</Link>}
            {isSuper && <Link to="/admin/users" className="text-muted-foreground [&.active]:text-primary">Users & Roles</Link>}
            <Link to="/" className="text-muted-foreground">View site</Link>
          </nav>
          <div className="ml-auto flex items-center gap-3 text-sm text-muted-foreground">
            <span>{user.email}{roles.length ? ` · ${roles.map((r) => ROLE_LABELS[r]).join(", ")}` : ""}</span>
            <Button size="sm" variant="outline" onClick={signOut}>Sign out</Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">
        {isLoading ? null : roles.length === 0 ? (
          <div className="rounded-lg border bg-card p-8 text-center">
            <h1 className="text-xl font-semibold text-foreground">{status === "rejected" ? "Access not approved" : "Waiting for approval"}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{status === "rejected" ? "The Super Admin has not approved this account. Contact your manager if this is a mistake." : "Your account is created. The Super Admin will review your sign-up and give you access."}</p>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
}
