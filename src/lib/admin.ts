import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type AppRole = Database["public"]["Enums"]["app_role"];

export const ROLE_LABELS: Record<AppRole, string> = {
  super_admin: "Super Admin",
  admin: "Admin / Operations Head",
  lead_manager: "Lead Manager",
  sales_executive: "Sales Executive",
  store_manager: "Store / Retail Manager",
  funding_manager: "Funding Manager",
  global_manager: "Global Desk Manager",
  content_editor: "Content Editor",
  hr_manager: "HR Manager",
  viewer: "Viewer / Auditor",
  partner: "Retail Partner",
  programme_manager: "Funding Programme Team",
};

export const LEAD_STATUSES = ["new", "contacted", "qualified", "proposal", "won", "lost", "closed"] as const;
export const STATUS_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  proposal: "Proposal sent",
  won: "Won",
  lost: "Lost",
  closed: "Closed",
};

export async function fetchMyRoles(): Promise<AppRole[]> {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return [];
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id);
  return (data ?? []).map((r) => r.role);
}
