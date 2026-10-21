import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { BarChart3, CalendarClock, Contact, ExternalLink, FileText, Inbox, KanbanSquare, LogOut, Rocket, Route as Route_, ShieldCheck, Store, Target, Users, type LucideIcon } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const queryClient = useQueryClient();
  const { data: roles = [], isLoading } = useQuery({ queryKey: ["my-roles"], queryFn: fetchMyRoles });
  const isSuper = roles.includes("super_admin");
  const { data: status } = useQuery({
    queryKey: ["my-approval", user.id],
    queryFn: async () => (await supabase.from("profiles").select("approval_status").eq("id", user.id).maybeSingle()).data?.approval_status ?? "pending",
  });

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const has = (list: string[]) => roles.some((r) => list.includes(r));
  const groups: { label: string; items: { to: string; label: string; icon: LucideIcon; exact?: boolean; show?: boolean }[] }[] = [
    { label: "Sales", items: [
      { to: "/admin", label: "Enquiries", icon: Inbox, exact: true },
      { to: "/admin/crm", label: "Pipeline", icon: KanbanSquare },
      { to: "/admin/followups", label: "Follow-ups", icon: CalendarClock },
      { to: "/admin/contacts", label: "Contacts", icon: Contact },
      { to: "/admin/targets", label: "Targets", icon: Target },
      { to: "/admin/stores", label: "Stores", icon: Store },
      { to: "/admin/routing", label: "Routing", icon: Route_, show: has(["super_admin", "admin", "lead_manager"]) },
      { to: "/admin/reports", label: "Reports", icon: BarChart3 },
    ] },
    { label: "Programme & Content", items: [
      { to: "/admin/programme", label: "Funding Programme", icon: Rocket, show: has(["super_admin", "admin", "programme_manager"]) },
      { to: "/admin/people", label: "Investors, Mentors & Team", icon: Users, show: has(["super_admin", "admin", "content_editor", "hr_manager"]) },
      { to: "/admin/content", label: "Website Content", icon: FileText, show: has(["super_admin", "admin", "content_editor"]) },
    ] },
    { label: "Administration", items: [
      { to: "/admin/users", label: "Users & Roles", icon: ShieldCheck, show: isSuper },
    ] },
  ];

  return (
    <SidebarProvider>
      <div className="admin-shell flex min-h-screen w-full bg-background">
        <Sidebar collapsible="icon" className="border-r border-sidebar-border">
          <SidebarHeader className="border-b border-sidebar-border">
            <Link to="/admin" className="flex items-center gap-3 px-1 py-2">
              <span className="admin-brand-mark grid h-9 w-9 shrink-0 place-items-center rounded-md font-display text-sm font-bold">RI</span>
              <span className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
                <span className="font-display text-sm font-semibold text-sidebar-accent-foreground">RIPL Admin</span>
                <span className="text-xs text-sidebar-foreground/70">Control centre</span>
              </span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            {groups.map((g) => {
              const items = g.items.filter((i) => i.show !== false);
              if (!items.length) return null;
              return (
                <SidebarGroup key={g.label}>
                  <SidebarGroupLabel className="text-[11px] uppercase tracking-widest text-sidebar-primary/80">{g.label}</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {items.map((item) => {
                        const active = item.exact ? pathname === item.to || pathname === item.to + "/" : pathname.startsWith(item.to);
                        return (
                          <SidebarMenuItem key={item.to}>
                            <SidebarMenuButton asChild isActive={active} tooltip={item.label} className="data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-primary data-[active=true]:shadow-[inset_3px_0_0_var(--sidebar-primary)]">
                              <Link to={item.to}>
                                <item.icon className="h-4 w-4" />
                                <span>{item.label}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              );
            })}
          </SidebarContent>
          <SidebarFooter className="border-t border-sidebar-border">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="View site"><Link to="/"><ExternalLink className="h-4 w-4" /><span>View site</span></Link></SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Sign out" onClick={signOut}><LogOut className="h-4 w-4" /><span>Sign out</span></SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-card/90 px-4 backdrop-blur">
            <SidebarTrigger />
            <span className="font-display text-sm font-semibold text-foreground">Admin Panel</span>
            <div className="ml-auto flex min-w-0 items-center gap-3 text-sm">
              <span className="hidden truncate text-muted-foreground sm:inline">{user.email}</span>
              {roles.length > 0 && <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">{roles.map((r) => ROLE_LABELS[r]).join(", ")}</span>}
            </div>
          </header>
          <main className="admin-main mx-auto w-full max-w-7xl flex-1 px-4 py-6 md:px-8">
            {isLoading ? null : roles.length === 0 ? (
              <div className="rounded-lg border bg-card p-8 text-center">
                <h1 className="text-xl font-semibold text-foreground">{status === "rejected" ? "Access not approved" : "Waiting for approval"}</h1>
                <p className="mt-2 text-sm text-muted-foreground">{status === "rejected" ? "The Super Admin has not approved this account. Contact your manager if this is a mistake." : "Your account is created. The Super Admin will review your sign-up and give you access."}</p>
                <Button className="mt-4" variant="outline" onClick={signOut}>Sign out</Button>
              </div>
            ) : (
              <Outlet />
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
