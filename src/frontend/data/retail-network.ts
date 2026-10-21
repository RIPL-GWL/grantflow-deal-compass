import { useQuery } from "@tanstack/react-query";
import rows from "./retail-network.json";
import { supabase } from "@/integrations/supabase/client";

export type NetworkRow = { state: string; area: string; district: string; stores: number };

// Fallback shown before live admin-managed data loads: states hidden by default
// (below the public threshold or explicitly removed) are excluded.
export const HIDDEN_STATES_DEFAULT = ["West Bengal", "Punjab"];
export const MIN_STATE_STORES = 400;

export function publicRows(all: NetworkRow[], hidden = HIDDEN_STATES_DEFAULT, min = MIN_STATE_STORES): NetworkRow[] {
  const totals = new Map<string, number>();
  for (const r of all) totals.set(r.state, (totals.get(r.state) ?? 0) + r.stores);
  return all.filter((r) => r.stores > 0 && !hidden.includes(r.state) && (totals.get(r.state) ?? 0) >= min);
}

export const retailNetwork: NetworkRow[] = publicRows(rows as NetworkRow[]);

// The '+' figure is a conservative lower bound, not an upward-rounded estimate.
export function storeFigure(count: number) {
  return count < 50 ? count.toLocaleString("en-IN") : `${(Math.floor(count / 50) * 50).toLocaleString("en-IN")}+`;
}

export function networkFigures(list: NetworkRow[]) {
  const stores = list.reduce((t, r) => t + r.stores, 0);
  const districts = new Set(list.filter((r) => r.stores > 0).map((r) => `${r.state}:${r.district}`)).size;
  return { stores, districts, storeFigure: storeFigure(stores), districtFigure: String(districts) };
}

const initial = networkFigures(retailNetwork);
export const networkStores = initial.stores;
export const networkDistricts = initial.districts;
export const totalStoreFigure = initial.storeFigure;
export const districtFigure = initial.districtFigure;

/** Live public network (visible rows with stores > 0), managed from Admin → Store Network. */
export function useRetailNetwork(): NetworkRow[] {
  const { data } = useQuery({
    queryKey: ["public-store-network"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("store_network")
        .select("state, area, district, stores")
        .eq("is_visible", true)
        .gt("stores", 0)
        .order("sort_order")
        .limit(5000);
      if (error) throw error;
      return data as NetworkRow[];
    },
    staleTime: 60_000,
  });
  return data ?? retailNetwork;
}

export function useNetworkFigures() {
  return networkFigures(useRetailNetwork());
}
