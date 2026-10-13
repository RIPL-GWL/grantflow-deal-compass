import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { fyLabels, historyGrowth, historyRequirement, type History, type HistoryRow } from "./valuation-history";

const MAX = { year: 10, month: 11 };

export function HistoryEditor({ years, history, onChange, error }: { years?: string | undefined; history: History | null; onChange: (h: History) => void; error?: string | undefined }) {
  const req = historyRequirement(years);
  if (!req) return <p className="valuation-helper-hint">Select "Years in Operation" above to enter your revenue & profit history.</p>;
  if (!history || history.unit !== req.unit) return null;
  const rows = history.rows;
  const update = (i: number, key: keyof HistoryRow, value: string) => onChange({ ...history, rows: rows.map((r, j) => (j === i ? { ...r, [key]: value } : r)) });
  const add = () => {
    if (history.unit === "year") { const labels = fyLabels(rows.length + 1); onChange({ ...history, rows: [{ label: labels[0]!, revenue: "", ebitda: "", netProfit: "" }, ...rows] }); }
    else onChange({ ...history, rows: [...rows, { label: `Month ${rows.length + 1}`, revenue: "", ebitda: "", netProfit: "" }] });
  };
  const remove = (i: number) => {
    const next = rows.filter((_, j) => j !== i);
    const labels = history.unit === "year" ? fyLabels(next.length) : next.map((_, j) => `Month ${j + 1}`);
    onChange({ ...history, rows: next.map((r, j) => ({ ...r, label: labels[j]! })) });
  };
  const g = historyGrowth(history);
  const unitName = history.unit === "year" ? "financial year" : "month";
  return <div className="valuation-history">
    <p className="valuation-helper-hint">{history.unit === "year"
      ? `Enter figures for each completed financial year (April–March), oldest first. Minimum ${req.min} year${req.min > 1 ? "s" : ""}; you can add up to ${MAX.year}.`
      : "Your business is less than 1 year old — enter figures month by month. Add every month you have operated."}</p>
    <div className="valuation-table-wrap"><table className="valuation-table valuation-history-table">
      <thead><tr><th>{history.unit === "year" ? "Financial Year" : "Month"}</th><th>Revenue (₹) *</th><th>EBITDA (₹)</th><th>Net Profit (₹)</th><th><span className="sr-only">Remove</span></th></tr></thead>
      <tbody>{rows.map((r, i) => <tr key={`${r.label}-${i}`}>
        <td>{r.label}</td>
        {(["revenue", "ebitda", "netProfit"] as const).map((k) => <td key={k}><input aria-label={`${r.label} ${k}`} className="valuation-input" type="number" step="any" value={r[k]} onChange={(e) => update(i, k, e.target.value)} /></td>)}
        <td>{rows.length > req.min && <Button type="button" variant="ghost" size="icon-xs" aria-label={`Remove ${r.label}`} onClick={() => remove(i)}><Trash2 /></Button>}</td>
      </tr>)}</tbody>
    </table></div>
    <div className="valuation-history-foot">
      {rows.length < MAX[history.unit] && <Button type="button" variant="outline" size="sm" onClick={add}><Plus />Add {history.unit === "year" ? "older" : "next"} {unitName}</Button>}
      {g !== null && <span>Growth from your history: <strong>{g}% per year</strong></span>}
    </div>
    {error && <small className="text-destructive">{error}</small>}
  </div>;
}
