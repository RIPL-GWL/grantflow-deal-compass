import { useMemo } from "react";
import { MapPin, Store } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useRetailNetwork } from "@/frontend/data/retail-network";

export type NetworkSelection = { state: string; area: string; district: string };

export function RetailNetworkIndicator({ selection, onChange, count }: {
  selection: NetworkSelection;
  onChange: (selection: NetworkSelection) => void;
  count: number;
}) {
  const { state, area, district } = selection;
  const retailNetwork = useRetailNetwork();

  const states = useMemo(() => [...new Set(retailNetwork.map((row) => row.state))].sort(), [retailNetwork]);
  const areas = useMemo(() => [...new Set(retailNetwork.filter((row) => !state || row.state === state).map((row) => row.area))].sort(), [state, retailNetwork]);
  const districts = useMemo(() => [...new Set(retailNetwork.filter((row) => (!state || row.state === state) && (!area || row.area === area)).map((row) => row.district))].sort(), [state, area, retailNetwork]);
  const onState = (value: string) => onChange({ state: value, area: "", district: "" });
  const onArea = (value: string) => {
    onChange({ state, area: value, district: "" });
  };
  const onDistrict = (value: string) => {
    if (value) {
      const row = retailNetwork.find((entry) => entry.district === value && (!state || entry.state === state) && (!area || entry.area === area));
      if (row) onChange({ state: row.state, area: row.area, district: value });
    } else {
      onChange({ ...selection, district: "" });
    }
  };

  return (
    <section className="retail-network-indicator border-b border-border bg-background py-5 lg:py-3" aria-labelledby="network-title">
      <div className="page-shell lg:grid lg:grid-cols-[230px_minmax(0,1fr)] lg:items-center lg:gap-6">
        <div className="mb-4 flex min-w-0 items-center gap-2 lg:mb-0">
          <MapPin className="size-5 shrink-0 text-primary" aria-hidden="true" />
          <h2 id="network-title" className="min-w-0 whitespace-nowrap text-sm leading-snug sm:text-lg">Check Our Retail Store Network</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          <label className="order-1 min-w-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground">State
            <select aria-label="State" value={state} onChange={(event) => onState(event.target.value)} className="mt-1.5 h-11 w-full min-w-0 rounded-sm border border-border bg-card px-2 text-sm font-medium normal-case tracking-normal text-foreground sm:px-3">
              <option value="">Choose state</option>
              {states.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
          <label className="order-3 lg:order-2 min-w-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Area
            <select aria-label="Area" value={area} onChange={(event) => onArea(event.target.value)} className="mt-1.5 h-11 w-full min-w-0 rounded-sm border border-border bg-card px-2 text-sm font-medium normal-case tracking-normal text-foreground sm:px-3">
              <option value="">Choose area</option>
              {areas.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
          <label className="order-2 lg:order-3 min-w-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground">District
            <select aria-label="District" value={district} onChange={(event) => onDistrict(event.target.value)} className="mt-1.5 h-11 w-full min-w-0 rounded-sm border border-border bg-card px-2 text-sm font-medium normal-case tracking-normal text-foreground sm:px-3">
              <option value="">Choose district</option>
              {districts.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
          <Link to="/store-list" search={selection} className="order-4 min-w-0 border-l-2 border-primary pl-3 transition-colors hover:text-primary" aria-live="polite" aria-label="View retail network list for selected location">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Retail stores</p>
            <p className="mt-1 flex items-center gap-2 font-display text-2xl leading-10 text-foreground"><Store className="size-5 shrink-0 text-primary" aria-hidden="true" />{count.toLocaleString("en-IN")}</p>
            <span className="text-xs text-primary">View network list</span>
          </Link>
        </div>
      </div>
    </section>
  );
}