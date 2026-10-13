import { OPTIONS, type S } from "./valuation-engine";
import { historyAnnual, historyErrors, parseHistory } from "./valuation-history";

export const DRAFT_KEY = "ripl-valuation-draft-v2";
export const REPORT_KEY = "ripl-valuation-submitted-report-v1";
export type SubmittedValuation = { values: S; markets: string[]; comp: string[]; confirmed: true };

export function valuationErrors(v: S): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const key of ["type", "name", "industry", "stage", "years", "desc", "revenue", "ebitda", "netProfit", "assets", "liabilities"]) {
    if (!v[key]?.trim()) errors[key] = "This field is required";
  }
  for (const key of ["revenue", "ebitda", "netProfit", "growth", "grossMargin", "utilization", "repeat", "assets", "liabilities", "debt", "orders", "orderSize", "customers", "locations", "experience"]) {
    if (v[key] && !Number.isFinite(Number(v[key]))) errors[key] = "Enter a valid number";
  }
  for (const key of ["revenue", "assets", "liabilities", "debt", "orders", "orderSize", "customers", "locations", "experience"]) {
    if (v[key] && Number(v[key]) < 0) errors[key] = "Enter a valid, non-negative number";
  }
  for (const key of ["grossMargin", "utilization", "repeat", "experience"]) {
    if (v[key] && (Number(v[key]) < 0 || Number(v[key]) > 100)) errors[key] = "Enter a value between 0 and 100";
  }
  for (const key of ["topCustomerShare", "recurring"]) {
    if (v[key] && (!Number.isFinite(Number(v[key])) || Number(v[key]) < 0 || Number(v[key]) > 100)) errors[key] = "Enter a value between 0 and 100";
  }
  for (const key of ["cash", "receivableDays"]) if (v[key] && !(Number(v[key]) >= 0)) errors[key] = "Enter a valid, non-negative number";
  if (v.revenue && Number(v.revenue) <= 0) errors["revenue"] = "Annual revenue must be greater than zero";
  const rev = Number(v.revenue), eb = Number(v.ebitda), np = Number(v.netProfit);
  if (rev > 0 && eb > rev) errors["ebitda"] = "EBITDA cannot be more than annual revenue";
  if (rev > 0 && np > rev) errors["netProfit"] = "Net profit cannot be more than annual revenue";
  if (v.debt && v.liabilities && Number(v.debt) > Number(v.liabilities)) errors["debt"] = "Debt is part of total liabilities, so it cannot be higher";
  if (v.grossMargin && rev > 0 && Number.isFinite(eb) && Number(v.grossMargin) < (eb / rev) * 100 - 0.5) errors["grossMargin"] = "Gross margin cannot be lower than your EBITDA margin";
  const h = historyErrors(parseHistory(v["history"]), v.years);
  if (h) errors["history"] = h;
  return errors;
}

/** Unusual but possible figures: shown for review before calculating. */
export function valuationWarnings(v: S): string[] {
  const w: string[] = [];
  const rev = Number(v.revenue), eb = Number(v.ebitda), np = Number(v.netProfit), assets = Number(v.assets), liab = Number(v.liabilities);
  if (rev > 0 && np > eb) w.push("Net profit is higher than EBITDA. This is only possible with large other income — please re-check both figures.");
  if (assets > 0 && liab > assets) w.push("Total liabilities are higher than total assets (negative net worth). This will lower your valuation.");
  if (Number(v.growth) > 100) w.push("Annual growth above 100% is very high. Please confirm it is based on actual figures.");
  if (rev > 0 && eb / rev > 0.6) w.push("EBITDA margin above 60% is unusual for most businesses. Please confirm.");
  const annual = historyAnnual(parseHistory(v["history"]));
  if (annual && rev > 0 && Math.abs(annual.revenue - rev) / rev > 0.05) w.push(`Annual revenue (₹${rev.toLocaleString("en-IN")}) differs from your latest revenue history (₹${annual.revenue.toLocaleString("en-IN")}).`);
  if (Number(v["receivableDays"]) > 120) w.push("Customers take more than 120 days to pay. This weakens cash flow and valuation.");
  return w;
}

export function parseSubmittedValuation(raw: string | null): SubmittedValuation | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
    if (!data || data.confirmed !== true || !data.values || typeof data.values !== "object" || Array.isArray(data.values)) return null;
    const values: S = {};
    for (const [key, value] of Object.entries(data.values)) if (typeof value === "string") values[key] = value;
    if (Object.keys(valuationErrors(values)).length) return null;
    if (!Array.isArray(data.markets) || !Array.isArray(data.comp)) return null;
    return { values, confirmed: true, markets: data.markets.filter((s: unknown) => typeof s === "string" && OPTIONS.MARKETS.includes(s)), comp: data.comp.filter((s: unknown) => typeof s === "string" && OPTIONS.COMPLIANCE.includes(s)) };
  } catch { return null; }
}