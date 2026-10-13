import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, BarChart3, Building2, ChevronUp, Factory, Loader2, Rocket, Save, Settings, ShoppingCart } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { OPTIONS, type S } from "./valuation-engine";
import { DRAFT_KEY, REPORT_KEY, valuationErrors, valuationWarnings } from "./valuation-session";
import { HelperCalculator } from "./helper-calculators";
import { HistoryEditor } from "./history-editor";
import { historyAnnual, historyGrowth, historyRequirement, newHistory, parseHistory, type History } from "./valuation-history";

const STEPS = ["Business Details", "Financials & Operations", "Market & Customers", "Team & Compliance", "Valuation Result"];
const TYPE_ICONS = [Factory, Rocket, Settings, ShoppingCart, Building2];
const STORAGE_KEY = DRAFT_KEY;
function Section({ n, title, subtitle, children, open, toggle }: { n: number; title: string; subtitle: string; children: ReactNode; open: boolean; toggle: () => void }) {
  return <section id={`valuation-step-${n}`} className="valuation-form-section"><Button variant="ghost" className="valuation-section-toggle" onClick={toggle} aria-expanded={open} aria-controls={`valuation-body-${n}`}><span className="valuation-number">{n}</span><span className="valuation-section-title"><strong>{title}</strong><small>{subtitle}</small></span><ChevronUp className={open ? "" : "rotate-180"} /></Button><div id={`valuation-body-${n}`} hidden={!open} className="valuation-section-body">{children}</div></section>;
}
function Field({ label, required, error, children, id, helper }: { label: string; required?: boolean; error?: string | undefined; children: ReactNode; id?: string; helper?: ReactNode }) { return <div className="valuation-field"><span className="valuation-field-label"><label htmlFor={id}>{label}{required && <b> *</b>}</label>{helper}</span>{children}{error && <small className="text-destructive">{error}</small>}</div>; }

export function ValuationCalculator() {
  const navigate = useNavigate();
  const [v, setV] = useState<S>({});
  const [markets, setMarkets] = useState<string[]>([]);
  const [comp, setComp] = useState<string[]>([]);
  const [confirm, setConfirm] = useState(false);
  const [step, setStep] = useState(0);
  const [opened, setOpened] = useState([true, true, true, true, true]);
  const [status, setStatus] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("ripl-valuation-edit-v1") || localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw);
      if (!draft || typeof draft !== "object" || !draft.values || typeof draft.values !== "object") return;
      const clean: S = {};
      for (const [key, value] of Object.entries(draft.values)) if (typeof value === "string") clean[key] = value;
      setV(clean);
      setMarkets(Array.isArray(draft.markets) ? draft.markets.filter((s: unknown) => typeof s === "string" && OPTIONS.MARKETS.includes(s)) : []);
      setComp(Array.isArray(draft.comp) ? draft.comp.filter((s: unknown) => typeof s === "string" && OPTIONS.COMPLIANCE.includes(s)) : []);
      setStep(Number.isInteger(draft.step) ? Math.max(0, Math.min(4, draft.step)) : 0);
      setStatus("Saved draft restored");
    } catch { setStatus("Saved draft could not be restored"); }
  }, []);
  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setV((old) => ({ ...old, [key]: e.target.value })); setStatus("");
  };
  const errors = valuationErrors(v);
  const warnings = valuationWarnings(v);
  const history = parseHistory(v["history"]);
  useEffect(() => {
    const req = historyRequirement(v.years);
    if (!req) return;
    const h = parseHistory(v["history"]);
    if (!h || h.unit !== req.unit) setV((old) => ({ ...old, history: JSON.stringify(newHistory(req.unit, req.initial)) }));
  }, [v.years, v["history"]]);
  const setHistory = (h: History) => {
    setStatus("");
    setV((old) => {
      const next: S = { ...old, history: JSON.stringify(h) };
      const a = historyAnnual(h), g = historyGrowth(h);
      if (a) { next.revenue = String(a.revenue); if (a.ebitda !== null) next.ebitda = String(a.ebitda); if (a.netProfit !== null) next.netProfit = String(a.netProfit); }
      if (g !== null) next.growth = String(g);
      return next;
    });
  };
  const input = (key: string, prefix = "", type = "number") => <div className="valuation-input-wrap">{prefix && <span>{prefix}</span>}<input id={`val-${key}`} className="valuation-input" type={type} min={type === "number" && !["ebitda", "netProfit", "growth"].includes(key) ? 0 : undefined} max={["grossMargin", "utilization", "repeat", "experience", "topCustomerShare", "recurring"].includes(key) ? 100 : undefined} step="any" value={v[key] ?? ""} onChange={set(key)} aria-invalid={submitted && !!errors[key]} /></div>;
  const select = (key: string, opts: string[]) => <select id={`val-${key}`} className="valuation-input" value={v[key] ?? ""} onChange={set(key)} aria-invalid={submitted && !!errors[key]}><option value="">Select</option>{opts.map((o) => <option key={o} value={o}>{o}</option>)}</select>;
  const field = (key: string, label: string, prefix = "", type = "number", required = false) => <Field key={key} id={`val-${key}`} label={label} required={required} error={submitted || errors[key]?.includes("cannot") ? errors[key] : undefined} helper={<HelperCalculator field={key} values={v} onApply={(updates) => { setV((old) => ({ ...old, ...updates })); setStatus(Object.keys(updates).length > 1 ? "Value applied — related empty boxes were auto-filled too" : ""); }} />}>{input(key, prefix, type)}</Field>;
  const choose = (key: string, label: string, opts: string[], required = false) => <Field id={`val-${key}`} label={label} required={required} error={submitted ? errors[key] : undefined}>{select(key, opts)}</Field>;
  const checkbox = (items: string[], fn: (s: string[]) => void, item: string) => <label className="valuation-checkbox" key={item}><input type="checkbox" checked={items.includes(item)} onChange={() => { fn(items.includes(item) ? items.filter((s) => s !== item) : [...items, item]); }} /><span>{item}</span></label>;
  const jump = (index: number) => { setStep(index); setOpened((o) => o.map((s, i) => i === index ? true : s)); requestAnimationFrame(() => document.getElementById(`valuation-step-${index + 1}`)?.scrollIntoView({ behavior: "smooth", block: "start" })); };
  const save = () => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ values: v, markets, comp, step, savedAt: new Date().toISOString() })); setStatus("Saved on this device — continue here later"); } catch { setStatus("Unable to save on this device"); } };
  const calculate = async () => {
    setSubmitted(true);
    if (Object.keys(errors).length || !confirm) { setStatus("Please complete required fields and confirm your information"); setOpened([true, true, true, true, true]); return; }
    setBusy(true);
    try {
      sessionStorage.setItem(REPORT_KEY, JSON.stringify({ values: v, markets, comp, confirmed: true }));
      localStorage.setItem(REPORT_KEY, JSON.stringify({ values: v, markets, comp, confirmed: true }));
      sessionStorage.setItem("ripl-valuation-edit-v1", JSON.stringify({ values: v, markets, comp }));
      await navigate({ to: "/business-valuation-report" });
    } catch { setStatus("Your report could not be opened. Please allow storage on this device and try again."); }
    finally { setBusy(false); }
  };
  return <>
    <main className="valuation-shell">
      <div className="valuation-hero"><div><h1>Business Valuation <span>Calculator</span></h1><p>Get an indicative valuation, funding estimate and equity range for your business.</p></div><div className="valuation-benefits">{[[Factory, "For Manufacturers", "Scale Production"], [Rocket, "For Startups", "Turn Ideas into Impact"], [BarChart3, "For Growing Businesses", "Expand to New Markets"]].map(([Icon, title, subtitle]) => { const I = Icon as typeof Factory; return <div key={String(title)}><I /><span>{String(title)}<small>{String(subtitle)}</small></span></div>; })}</div><Button variant="outline" className="valuation-save" onClick={save}><Save />Save & Continue Later</Button></div>
      <div className="valuation-notice" role="status">{status}</div>
      <ol className="valuation-steps">{STEPS.map((s, i) => <li key={s} className={step === i ? "active" : step > i ? "complete" : ""}><Button variant="ghost" onClick={() => jump(i)} aria-current={step === i ? "step" : undefined}><span>{i + 1}</span><small>{s}</small></Button></li>)}</ol>
      <div className="valuation-workspace valuation-calculator-only">
        <div className="valuation-input-panel">
          <Section n={1} title="Business Details" subtitle="Tell us about your business. This helps us understand your business model." open={opened[0] ?? true} toggle={() => setOpened((o) => o.map((s, i) => i === 0 ? !s : s))}>
            <p className="valuation-label">Business Type <b>*</b></p><div className="valuation-types">{OPTIONS.TYPES.map((t, i) => { const Icon = TYPE_ICONS[i] ?? Factory; return <Button key={t} variant={v.type === t ? "default" : "outline"} onClick={() => { setV((old) => ({ ...old, type: t })); }} aria-pressed={v.type === t}><Icon />{t}</Button>; })}</div>
            <div className="valuation-grid two">{field("name", "Business Name", "", "text", true)}{choose("industry", "Industry / Sector", Object.keys(OPTIONS.INDUSTRY), true)}{choose("stage", "Business Stage", Object.keys(OPTIONS.STAGES), true)}{choose("years", "Years in Operation", Object.keys(OPTIONS.YEARS), true)}</div>
            <Field label="Business Description" required error={submitted ? errors["desc"] : undefined}><textarea className="valuation-input" rows={3} maxLength={500} value={v.desc ?? ""} onChange={set("desc")} /><span className="valuation-counter">{v.desc?.length ?? 0}/500</span></Field>
          </Section>
          <Section n={2} title="Financials & Operations" subtitle="Provide your financial performance and operational details." open={opened[1] ?? true} toggle={() => setOpened((o) => o.map((s, i) => i === 1 ? !s : s))}>
            <h3 className="valuation-subheading valuation-subheading-first">Revenue & Profit Trend</h3><HistoryEditor years={v.years} history={history} onChange={setHistory} error={submitted ? errors["history"] : undefined} />
            <h3 className="valuation-subheading">Latest Year Figures <small>(auto-filled from your history — edit if needed)</small></h3>
            <div className="valuation-grid three">{field("revenue", "Annual Revenue (₹)", "₹", "number", true)}{field("ebitda", "EBITDA / Operating Profit (₹)", "▥", "number", true)}{field("netProfit", "Net Profit (₹)", "₹", "number", true)}{field("growth", "Annual Revenue Growth (%)", "↗")}{field("grossMargin", "Gross Margin (%)", "%")}{field("locations", "Operating Locations", "⌖")}</div>
            <h3 className="valuation-subheading">Assets & Liabilities</h3><div className="valuation-grid three">{field("assets", "Total Assets (₹)", "₹", "number", true)}{field("liabilities", "Total Liabilities (₹)", "₹", "number", true)}{field("debt", "Current Debt (₹)", "₹")}{field("cash", "Cash & Bank Balance (₹)", "₹")}{field("receivableDays", "Average Days Customers Take to Pay", "⏱")}</div>
            <h3 className="valuation-subheading">Orders & Pipeline</h3><div className="valuation-grid three">{field("orders", "Order Book / Confirmed Orders (₹)", "₹")}{field("orderSize", "Average Order Size (₹)", "₹")}{field("utilization", "Production Capacity Utilization (%)", "%")}{field("recurring", "Recurring / Contract Revenue (%)", "%")}{choose("expansion", "Expansion Plan", Object.keys(OPTIONS.EXPANSION))}</div>
          </Section>
          <Section n={3} title="Market & Customers" subtitle="Tell us about your market, customers and competition." open={opened[2] ?? true} toggle={() => setOpened((o) => o.map((s, i) => i === 2 ? !s : s))}>
            <div className="valuation-grid market-grid">{field("customers", "Total Customers", "")}{field("repeat", "Repeat Customer Rate (%)", "%")}<div><p className="valuation-label">Key Markets <small>(Select all that apply)</small></p><div className="valuation-check-group">{OPTIONS.MARKETS.map((m) => checkbox(markets, setMarkets, m))}</div></div></div>
            <div className="valuation-grid three market-bottom">{choose("marketSize", "Market Size (₹)", Object.keys(OPTIONS.MARKET_SIZE))}{choose("competition", "Competition Level", Object.keys(OPTIONS.COMPETITION))}{field("topCustomerShare", "Revenue from Biggest Customer (%)", "%")}{field("segments", "Customer Segments", "", "text")}{field("usp", "Competitive Advantage / USP", "", "text")}</div>
          </Section>
          <Section n={4} title="Team & Compliance" subtitle="Share details about your team and regulatory compliance." open={opened[3] ?? true} toggle={() => setOpened((o) => o.map((s, i) => i === 3 ? !s : s))}>
            <div className="valuation-grid three">{field("experience", "Promoter Experience (Years)")}{choose("team", "Team Size", ["1-10", "10-25", "25-50", "50+"])}{choose("management", "Key Management Strength", ["Sales & Distribution", "Operations & Production", "Technology & Innovation", "Finance & Strategy"])}{choose("secondLine", "Second-line Management", Object.keys(OPTIONS.SECOND_LINE))}{choose("keyPerson", "Dependence on Owner", Object.keys(OPTIONS.KEY_PERSON))}</div>
            <div className="valuation-grid three compliance-grid">{choose("structure", "Business Structure", Object.keys(OPTIONS.STRUCTURES))}<div><p className="valuation-label">Registrations / Compliance</p><div className="valuation-check-group">{OPTIONS.COMPLIANCE.map((c) => checkbox(comp, setComp, c))}</div></div>{choose("records", "Financial Records Available", Object.keys(OPTIONS.RECORDS))}</div>
            <div className="valuation-grid two">{choose("litigation", "Legal Cases / Disputes", Object.keys(OPTIONS.LITIGATION))}{choose("filings", "GST & Tax Filing Record", Object.keys(OPTIONS.FILINGS))}</div>
          </Section>
          <Section n={5} title="Review & Calculate" subtitle="Review your information and calculate business valuation." open={opened[4] ?? true} toggle={() => setOpened((o) => o.map((s, i) => i === 4 ? !s : s))}>
            {Object.keys(errors).length > 0 && submitted && <div className="valuation-review-box valuation-review-error"><strong>Please fix these before calculating:</strong><ul>{Object.entries(errors).map(([k, e]) => <li key={k}>{e}</li>)}</ul></div>}
            {warnings.length > 0 && <div className="valuation-review-box"><strong>Please re-check these figures:</strong><ul>{warnings.map((w) => <li key={w}>{w}</li>)}</ul></div>}
            <label className="valuation-checkbox valuation-confirm"><input type="checkbox" checked={confirm} onChange={(e) => setConfirm(e.target.checked)} />I confirm that the information provided is accurate to the best of my knowledge.</label>{submitted && !confirm && <p className="valuation-error">Please confirm your information before calculating.</p>}
            <div className="valuation-action-bar"><Button variant="outline" onClick={() => jump(3)}><ArrowLeft />Previous</Button><Button onClick={calculate} disabled={busy}>{busy ? <Loader2 className="animate-spin" /> : null}{busy ? "Calculating…" : "Calculate Business Valuation"}<ArrowRight /></Button></div>
          </Section>
        </div>

      </div>

    </main>
  </>;
}
