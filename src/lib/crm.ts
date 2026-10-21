import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { AppRole } from "@/lib/admin";

export type Deal = Database["public"]["Tables"]["crm_deals"]["Row"];
export type Target = Database["public"]["Tables"]["crm_targets"]["Row"];

export const STAGES = ["new", "qualified", "proposal", "negotiation", "won", "lost"] as const;
export const STAGE_LABELS: Record<string, string> = { new: "New", qualified: "Qualified", proposal: "Proposal", negotiation: "Negotiation", won: "Won", lost: "Lost" };
export const PIPELINES = ["general", "manufacturer", "retailer", "distributor", "funding", "global"] as const;
export const PIPELINE_LABELS: Record<string, string> = { general: "General", manufacturer: "Manufacturers", retailer: "Retailers", distributor: "Distributors", funding: "Funding", global: "Global Markets" };

export const isManager = (roles: AppRole[]) => roles.some((r) => r === "super_admin" || r === "admin" || r === "lead_manager");
export const canSeeAll = (roles: AppRole[]) => isManager(roles) || roles.includes("viewer");

export const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
export const monthStart = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;

export async function fetchDeals(): Promise<Deal[]> {
  const { data, error } = await supabase.from("crm_deals").select("*").order("updated_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchPeople(): Promise<Record<string, string>> {
  const { data } = await supabase.from("profiles").select("id, email, full_name");
  return Object.fromEntries((data ?? []).map((p) => [p.id, p.full_name || p.email]));
}

export type Contact = Database["public"]["Tables"]["crm_contacts"]["Row"];
export type Activity = Database["public"]["Tables"]["crm_deal_activities"]["Row"];
export type Quote = Database["public"]["Tables"]["crm_quotes"]["Row"];
export type QuoteItem = { description: string; qty: number; rate: number };

export const ACTIVITY_KINDS = ["call", "meeting", "whatsapp", "email", "note"] as const;
export const ACTIVITY_LABELS: Record<string, string> = { call: "Call", meeting: "Meeting", whatsapp: "WhatsApp", email: "Email", note: "Note", stage: "Stage change", quote: "Quotation" };
export const QUOTE_STATUS_LABELS: Record<string, string> = { draft: "Draft", sent: "Sent", accepted: "Accepted", rejected: "Rejected" };

export function quoteTotals(q: { items: unknown; gst_percent: number | string; discount: number | string }) {
  const items = (Array.isArray(q.items) ? q.items : []) as QuoteItem[];
  const subtotal = items.reduce((s, i) => s + (Number(i.qty) || 0) * (Number(i.rate) || 0), 0);
  const taxable = Math.max(0, subtotal - (Number(q.discount) || 0));
  const gst = Math.round(taxable * (Number(q.gst_percent) || 0)) / 100;
  return { items, subtotal, taxable, gst, total: Math.round((taxable + gst) * 100) / 100 };
}

export async function fetchContacts(): Promise<Contact[]> {
  const { data, error } = await supabase.from("crm_contacts").select("*").order("name");
  if (error) throw error;
  return data;
}

export async function logActivity(dealId: string, kind: string, body: string) {
  return supabase.from("crm_deal_activities").insert({ deal_id: dealId, kind, body: body.slice(0, 4000) });
}

/** "overdue" | "today" | "upcoming" | null for a follow-up timestamp. */
export function followupState(at: string | null) {
  if (!at) return null;
  const d = new Date(at), now = new Date();
  if (d < now && d.toDateString() !== now.toDateString()) return "overdue" as const;
  if (d.toDateString() === now.toDateString()) return "today" as const;
  return "upcoming" as const;
}

export type Pipeline = Database["public"]["Tables"]["crm_pipelines"]["Row"];
export type TeamMember = Database["public"]["Tables"]["sales_team_members"]["Row"];

export async function fetchPipelines(): Promise<Pipeline[]> {
  const { data, error } = await supabase.from("crm_pipelines").select("*").order("sort_order").order("name");
  if (error) throw error;
  return data;
}

export async function fetchTeam(): Promise<TeamMember[]> {
  const { data, error } = await supabase.from("sales_team_members").select("*");
  if (error) throw error;
  return data;
}
