import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { FaqGroup } from "@/lib/knowledge/business-facts";
import { allFaqGroups } from "@/lib/knowledge/faq";
import { PLAN_RATES, RENT_CAP, RENT_RATES } from "@/lib/ripl-pricing";

/** Admin-editable site sections. Pages show built-in content until an admin saves an edit. */
export type ServiceEdit = { id: string; title: string; tagline: string; text: string; points: string[]; hidden?: boolean };
export type CountryEdit = { slug: string; name: string; flag: string; note: string; hidden?: boolean };
export type PricingEdit = { rentRates: Record<string, number>; rentCap: number; planRates: { local: number; next: number; domestic: number } };
export type SiteContent = { services: ServiceEdit[]; countries: CountryEdit[]; faq: FaqGroup[]; pricing: PricingEdit };
export type SiteContentKey = keyof SiteContent;

export const defaultPricing: PricingEdit = { rentRates: { ...RENT_RATES }, rentCap: RENT_CAP, planRates: { ...PLAN_RATES } };
export const defaultFaq = allFaqGroups;

export async function fetchSiteContent<K extends SiteContentKey>(key: K): Promise<SiteContent[K] | null> {
  const { data, error } = await supabase.from("site_content").select("data").eq("key", key).maybeSingle();
  if (error || !data) return null;
  return data.data as unknown as SiteContent[K];
}

export async function saveSiteContent<K extends SiteContentKey>(key: K, value: SiteContent[K]) {
  const { error } = await supabase.from("site_content").upsert({ key, data: value as never, updated_at: new Date().toISOString() });
  if (error) throw error;
}

export async function resetSiteContent(key: SiteContentKey) {
  const { error } = await supabase.from("site_content").delete().eq("key", key);
  if (error) throw error;
}

/** Returns the saved edit for a section, or null while loading / when nothing is saved. */
export function useSiteContent<K extends SiteContentKey>(key: K) {
  return useQuery({ queryKey: ["site-content", key], queryFn: () => fetchSiteContent(key), staleTime: 60_000 }).data ?? null;
}

/** Merge saved edits over built-in items by id; built-in-only fields (icons, images) are kept. */
export function mergeById<T, E extends { hidden?: boolean }>(base: T[], edits: E[] | null, idOf: (x: T) => string, editId: (e: E) => string): T[] {
  if (!edits) return base;
  const byId = new Map(base.map((b) => [idOf(b), b]));
  return edits.filter((e) => !e.hidden && byId.has(editId(e))).map((e) => ({ ...byId.get(editId(e))!, ...e }));
}
