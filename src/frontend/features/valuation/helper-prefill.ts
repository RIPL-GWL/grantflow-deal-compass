// Auto-fill rules for the popup calculators: what each popup can pre-fill from the main form,
// and which extra form boxes a popup's inputs can fill when the user clicks "Use this value".
import { parseHistory } from "./valuation-history";

type S = Record<string, string | undefined>;
const num = (x?: string) => { const n = Number(x); return x?.trim() && Number.isFinite(n) ? n : null; };
const str = (n: number | null) => (n === null ? undefined : String(n));

/** Revenue of the last two completed financial years from the history table (yearly history only). */
export function lastTwoYears(v: S): { now: number | null; last: number | null } {
  const h = parseHistory(v["history"]);
  if (!h || h.unit !== "year") return { now: null, last: null };
  const rows = h.rows.filter((r) => (num(r.revenue) ?? 0) > 0);
  return { now: num(rows.at(-1)?.revenue), last: rows.length > 1 ? num(rows.at(-2)?.revenue) : null };
}

/** Popup inputs pre-filled from figures already entered in the form. */
export function helperPrefill(field: string, v: S): Record<string, string> {
  const rev = v["revenue"]?.trim() || undefined;
  const map: Record<string, Record<string, string | undefined>> = {
    ebitda: { np: v["netProfit"] },
    netProfit: { rev },
    grossMargin: { rev },
    growth: (() => { const y = lastTwoYears(v); return { now: str(y.now) ?? rev, last: str(y.last) }; })(),
    assets: { cash: v["cash"] },
    receivableDays: { rev },
    topCustomerShare: { rev },
    recurring: { rev },
    repeat: { total: v["customers"] },
  };
  return Object.fromEntries(Object.entries(map[field] ?? {}).filter(([, x]) => x !== undefined && x.trim() !== "")) as Record<string, string>;
}

/** Extra form boxes filled from popup inputs (only boxes the user left empty). */
export function helperAlsoFills(field: string, vals: Record<string, string>, v: S): Record<string, string> {
  const n = (k: string) => num(vals[k]);
  const out: Record<string, string | undefined> = {};
  if (field === "ebitda") out["netProfit"] = vals["np"];
  if (field === "netProfit") {
    const r = n("rev");
    out["revenue"] = vals["rev"];
    if (r !== null) out["ebitda"] = String(Math.round(r - (n("cogs") ?? 0) - (n("opex") ?? 0)));
    if (r !== null && n("cogs") !== null && r > 0) out["grossMargin"] = String(Math.round(((r - n("cogs")!) / r) * 1000) / 10);
  }
  if (field === "grossMargin") out["revenue"] = vals["rev"];
  if (field === "assets") out["cash"] = vals["cash"];
  if (field === "liabilities") {
    const d = (n("bank") ?? 0) + (n("other") ?? 0);
    if (d > 0) out["debt"] = String(d);
  }
  if (field === "repeat") out["customers"] = vals["total"];
  if (["receivableDays", "topCustomerShare", "recurring"].includes(field)) out["revenue"] = vals["rev"];
  return Object.fromEntries(Object.entries(out).filter(([k, x]) => x !== undefined && x.trim() !== "" && !v[k]?.trim())) as Record<string, string>;
}
