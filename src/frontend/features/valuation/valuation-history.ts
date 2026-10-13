// Revenue & profit history entered by the owner. Stored as a JSON string in the form values
// so drafts and submitted reports carry it unchanged.
export type HistoryRow = { label: string; revenue: string; ebitda: string; netProfit: string };
export type History = { unit: "year" | "month"; rows: HistoryRow[] };

const n = (v?: string) => { const x = Number(v); return v?.trim() && Number.isFinite(x) ? x : null; };

export function historyRequirement(years?: string): { unit: "year" | "month"; min: number; initial: number } | null {
  if (!years) return null;
  if (years === "Less than 1 year") return { unit: "month", min: 1, initial: 3 };
  if (years === "1–3 years") return { unit: "year", min: 1, initial: 2 };
  return { unit: "year", min: 3, initial: 3 };
}

export function parseHistory(raw?: string): History | null {
  if (!raw) return null;
  try {
    const h = JSON.parse(raw);
    if (!h || (h.unit !== "year" && h.unit !== "month") || !Array.isArray(h.rows)) return null;
    const rows = h.rows.filter((r: unknown) => r && typeof r === "object").map((r: Record<string, unknown>) => ({
      label: String(r["label"] ?? ""), revenue: String(r["revenue"] ?? ""), ebitda: String(r["ebitda"] ?? ""), netProfit: String(r["netProfit"] ?? ""),
    }));
    return { unit: h.unit, rows: rows.slice(0, 24) };
  } catch { return null; }
}

/** Completed Indian financial years, oldest first. FY runs April–March. */
export function fyLabels(count: number, today = new Date()): string[] {
  const end = today.getMonth() >= 3 ? today.getFullYear() : today.getFullYear() - 1;
  return Array.from({ length: count }, (_, i) => { const e = end - (count - 1 - i); return `FY ${e - 1}-${String(e).slice(2)}`; });
}

export function newHistory(unit: "year" | "month", count: number): History {
  const labels = unit === "year" ? fyLabels(count) : Array.from({ length: count }, (_, i) => `Month ${i + 1}`);
  return { unit, rows: labels.map((label) => ({ label, revenue: "", ebitda: "", netProfit: "" })) };
}

const filled = (h: History) => h.rows.filter((r) => (n(r.revenue) ?? 0) > 0);

/** Annual growth % from history: CAGR for years, compounded monthly growth for months. */
export function historyGrowth(h: History | null): number | null {
  if (!h) return null;
  const rows = filled(h);
  if (rows.length < 2) return null;
  const first = n(rows[0]!.revenue)!, last = n(rows[rows.length - 1]!.revenue)!;
  const periodRate = (last / first) ** (1 / (rows.length - 1)) - 1;
  const annual = h.unit === "year" ? periodRate : (1 + periodRate) ** 12 - 1;
  return Math.round(Math.min(200, Math.max(-60, annual * 100)) * 10) / 10;
}

/** Latest-year figures; for months, the average month annualised (x12). */
export function historyAnnual(h: History | null): { revenue: number; ebitda: number | null; netProfit: number | null } | null {
  if (!h) return null;
  const rows = filled(h);
  if (!rows.length) return null;
  if (h.unit === "year") { const r = rows[rows.length - 1]!; return { revenue: n(r.revenue)!, ebitda: n(r.ebitda), netProfit: n(r.netProfit) }; }
  const k = 12 / rows.length;
  const sum = (key: "revenue" | "ebitda" | "netProfit") => rows.every((r) => n(r[key]) !== null) ? Math.round(rows.reduce((s, r) => s + n(r[key])!, 0) * k) : null;
  return { revenue: sum("revenue")!, ebitda: sum("ebitda"), netProfit: sum("netProfit") };
}

export function historyErrors(h: History | null, years?: string): string | null {
  const req = historyRequirement(years);
  if (!req) return null;
  if (!h || h.unit !== req.unit) return `Please add your ${req.unit === "month" ? "monthly" : "yearly"} revenue history`;
  for (const r of h.rows) {
    for (const key of ["revenue", "ebitda", "netProfit"] as const) if (r[key].trim() && n(r[key]) === null) return `${r.label}: enter a valid number`;
    if ((n(r.revenue) ?? 0) < 0) return `${r.label}: revenue cannot be negative`;
    const rev = n(r.revenue) ?? 0;
    if (rev > 0 && (n(r.netProfit) ?? 0) > rev) return `${r.label}: net profit cannot be more than revenue`;
    if (rev > 0 && (n(r.ebitda) ?? 0) > rev) return `${r.label}: EBITDA cannot be more than revenue`;
  }
  const count = filled(h).length;
  if (count < req.min) return req.unit === "month" ? "Enter revenue for at least 1 month" : `Enter revenue for at least the last ${req.min} financial year${req.min > 1 ? "s" : ""}`;
  return null;
}
