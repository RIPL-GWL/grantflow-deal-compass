import { useState } from "react";
import { Calculator } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/frontend/components/ui/dialog";
import { HELPERS } from "./helper-formulas";
import { helperAlsoFills, helperPrefill } from "./helper-prefill";

type S = Record<string, string | undefined>;

export function HelperCalculator({ field, values, onApply }: { field: string; values: S; onApply: (updates: Record<string, string>) => void }) {
  const cfg = HELPERS[field];
  const [open, setOpen] = useState(false);
  const [vals, setVals] = useState<Record<string, string>>({});
  const [auto, setAuto] = useState<string[]>([]);
  if (!cfg) return null;
  const onOpenChange = (o: boolean) => {
    if (o) {
      const pre = helperPrefill(field, values);
      setVals((old) => { const next = { ...old }; const used: string[] = []; for (const [k, x] of Object.entries(pre)) if (!old[k]?.trim() || auto.includes(k)) { next[k] = x; used.push(k); } setAuto(used); return next; });
    }
    setOpen(o);
  };
  const nums = Object.fromEntries(cfg.inputs.map((i) => [i.key, Number(vals[i.key] || 0)]));
  const missing = cfg.inputs.filter((i) => i.required && !vals[i.key]?.trim()).length > 0;
  const result = missing ? null : cfg.compute(nums);
  const ok = result !== null && Number.isFinite(result);
  const extra = helperAlsoFills(field, vals, values);
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogTrigger asChild><Button type="button" variant="link" size="sm" className="valuation-helper-trigger"><Calculator />{cfg.trigger}</Button></DialogTrigger>
    <DialogContent className="valuation-helper-dialog max-h-[90vh] overflow-y-auto">
      <DialogHeader><DialogTitle>{cfg.title}</DialogTitle><DialogDescription>{cfg.explain}</DialogDescription></DialogHeader>
      <p className="valuation-helper-formula">{cfg.formula}</p>
      <div className="valuation-helper-grid">{cfg.inputs.map((i) => <label key={i.key} className="valuation-field"><span>{i.label}{i.required && <b> *</b>}</span>
        <input className="valuation-input" type="number" step="any" min={0} value={vals[i.key] ?? ""} onChange={(e) => { setVals((o) => ({ ...o, [i.key]: e.target.value })); setAuto((a) => a.filter((k) => k !== i.key)); }} />
        {auto.includes(i.key) ? <small className="valuation-helper-hint">Auto-filled from your form — edit if needed.</small> : i.hint && <small className="valuation-helper-hint">{i.hint}</small>}</label>)}</div>
      <div className="valuation-helper-result" role="status">{ok ? <>Result: <strong>{cfg.unit === "%" ? `${result.toFixed(1)}%` : cfg.unit === "days" ? `${Math.round(result)} days` : `₹${Math.round(result).toLocaleString("en-IN")}`}</strong></> : missing ? "Fill the required fields to see the result." : "Please check the figures."}</div>
      {ok && Object.keys(extra).length > 0 && <p className="valuation-helper-hint">Will also fill empty boxes: {Object.keys(extra).join(", ")}</p>}
      <DialogFooter><Button type="button" disabled={!ok} onClick={() => { onApply({ ...extra, [field]: String(cfg.unit === "%" ? Math.round(result! * 10) / 10 : Math.round(result!)) }); setOpen(false); }}>Use this value</Button></DialogFooter>
    </DialogContent>
  </Dialog>;
}
