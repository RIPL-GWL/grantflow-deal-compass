import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, BadgeX, Info, RotateCcw, TriangleAlert } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { categoryOptions, inputCls } from "@/frontend/features/fund-your-business/content";

const rupees = (n: number) =>
  `₹${(Number.isFinite(n) ? Math.round(n) : 0).toLocaleString("en-IN")}`;

const compact = (n: number) => {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2).replace(/\.00$/, "")} Crore`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(1).replace(/\.0$/, "")} Lakh`;
  return rupees(n);
};

// Indicative revenue multiples by business category (industry-standard heuristic ranges)
const CATEGORY_MULTIPLE: Record<string, number> = {
  "Food & Beverages": 1.0,
  "Personal Care": 1.1,
  "Home Care": 1.0,
  "Health & Wellness": 1.2,
  "Packaged Snacks": 1.0,
  Chemicals: 0.9,
  "Machinery & Equipment": 0.8,
  "Technology Startup": 1.5,
  "Other Startup": 1.2,
  "Other Manufacturing": 0.9,
};

const YEARS_FACTOR: Record<string, number> = {
  "Less than 1 year": 0.7,
  "1–3 years": 0.85,
  "3–5 years": 1.0,
  "5–10 years": 1.1,
  "More than 10 years": 1.2,
};

type Verdict = { label: string; tone: "good" | "warn" | "bad"; note: string };

export function FundingCalculator() {
  const [v, setV] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setV({ ...v, [k]: e.target.value });
    setDone(false);
  };

  const turnover = Number(v["turnover"]);
  const margin = Number(v["margin"]);
  const growth = Number(v["growth"]);
  const loans = v["loans"] ?? "";

  const turnoverErr =
    v["turnover"] !== undefined && v["turnover"] !== "" && !(Number.isFinite(turnover) && turnover >= 0)
      ? "Turnover 0 ya usse zyada hona chahiye."
      : "";
  const marginErr =
    v["margin"] !== undefined && v["margin"] !== "" && !(Number.isFinite(margin) && margin >= -50 && margin <= 80)
      ? "Profit margin -50% se 80% ke beech likhein."
      : "";
  const growthErr =
    v["growth"] !== undefined && v["growth"] !== "" && !(Number.isFinite(growth) && growth >= -50 && growth <= 200)
      ? "Growth -50% se 200% ke beech likhein."
      : "";

  const valid =
    !!v["category"] &&
    !!v["years"] &&
    v["turnover"] !== undefined &&
    v["turnover"] !== "" &&
    v["margin"] !== undefined &&
    v["margin"] !== "" &&
    v["growth"] !== undefined &&
    v["growth"] !== "" &&
    loans !== "" &&
    !turnoverErr &&
    !marginErr &&
    !growthErr;

  const result = useMemo(() => {
    if (!valid) return null;

    const profit = turnover * (margin / 100);
    const revMultiple = CATEGORY_MULTIPLE[(v["category"] ?? "")] ?? 0.9;
    const yearsFactor = YEARS_FACTOR[(v["years"] ?? "")] ?? 1;
    const growthFactor = Math.min(1.5, Math.max(0.7, 1 + growth / 100));
    const loanFactor = loans === "No Existing Loans" ? 1 : loans === "Yes — Other Funding" ? 0.85 : 0.92;

    // Valuation: blend of revenue multiple and profit multiple (5x profit), adjusted
    const revBased = turnover * revMultiple;
    const profitBased = Math.max(0, profit) * 5;
    let valuation = (revBased * 0.6 + profitBased * 0.4) * yearsFactor * growthFactor * loanFactor;
    if (turnover === 0) valuation = 0; // pre-revenue: no standard valuation

    // Eligibility score (0–100)
    let score = 0;
    score += margin >= 15 ? 30 : margin >= 8 ? 20 : margin >= 0 ? 10 : 0;
    score += growth >= 20 ? 25 : growth >= 10 ? 18 : growth >= 0 ? 10 : 0;
    score += v["years"] === "More than 10 years" ? 20 : v["years"] === "5–10 years" ? 16 : v["years"] === "3–5 years" ? 12 : v["years"] === "1–3 years" ? 8 : 4;
    score += loans === "No Existing Loans" ? 15 : loans === "Yes — Business Loan" ? 10 : 7;
    score += turnover >= 5e6 ? 10 : turnover >= 1e6 ? 7 : turnover > 0 ? 4 : 0;

    let verdict: Verdict;
    if (turnover === 0) {
      verdict = {
        label: "Pre-Revenue — Seed Stage",
        tone: "warn",
        note: "Revenue abhi shuru nahi hua. Aapka business seed funding / prototype support ke liye consider ho sakta hai — strong business plan aur founder profile zaroori hai.",
      };
    } else if (score >= 70) {
      verdict = {
        label: "Funding ke Liye Suitable",
        tone: "good",
        note: "Aapke business ke numbers investor expectations ke kareeb hain. Documentation aur due diligence ke baad funding ki sambhavna achhi hai.",
      };
    } else if (score >= 45) {
      verdict = {
        label: "Conditionally Eligible",
        tone: "warn",
        note: "Kuchh areas (margin, growth ya track record) ko improve karne par funding ki sambhavna badhegi. Guidance ke saath apply kiya ja sakta hai.",
      };
    } else {
      verdict = {
        label: "Abhi Ready Nahi",
        tone: "bad",
        note: "Current numbers par funding mushkil hai. Pehle profitability, sales track record aur documentation strong karein, phir apply karein.",
      };
    }

    // Approx funding: 20–30% of valuation (equity dilution 10–25% typical for early rounds)
    const fundingLow = valuation * 0.2;
    const fundingHigh = valuation * 0.3;
    const equityLow = valuation > 0 ? (fundingLow / (valuation + fundingLow)) * 100 : 0;
    const equityHigh = valuation > 0 ? (fundingHigh / (valuation + fundingHigh)) * 100 : 0;

    return { profit, valuation, score, verdict, fundingLow, fundingHigh, equityLow, equityHigh };
  }, [valid, turnover, margin, growth, loans, v]);

  const reset = () => {
    setV({});
    setDone(false);
  };

  const show = done && result;
  const toneCls = {
    good: "border-primary bg-primary/10 text-primary",
    warn: "border-primary/50 bg-primary/5 text-foreground",
    bad: "border-destructive/50 bg-destructive/10 text-destructive",
  } as const;

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
      <div className="min-w-0 space-y-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block min-w-0 text-sm font-semibold">Business Category <span className="text-primary">*</span>
            <select value={v["category"] ?? ""} onChange={set("category")} className={`${inputCls} h-12`}>
              <option value="">Select category</option>
              {categoryOptions.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label className="block min-w-0 text-sm font-semibold">Years in Business <span className="text-primary">*</span>
            <select value={v["years"] ?? ""} onChange={set("years")} className={`${inputCls} h-12`}>
              <option value="">Select years</option>
              {Object.keys(YEARS_FACTOR).map((y) => <option key={y}>{y}</option>)}
            </select>
          </label>
          <label className="block min-w-0 text-sm font-semibold">Annual Turnover (₹) <span className="text-primary">*</span>
            <input type="number" inputMode="numeric" min="0" placeholder="e.g. 5000000" value={v["turnover"] ?? ""} onChange={set("turnover")} className={`${inputCls} h-12`} aria-invalid={!!turnoverErr} />
            {turnoverErr && <span className="mt-1 block text-xs font-medium text-destructive">{turnoverErr}</span>}
          </label>
          <label className="block min-w-0 text-sm font-semibold">Net Profit Margin (%) <span className="text-primary">*</span>
            <input type="number" inputMode="decimal" placeholder="e.g. 12" value={v["margin"] ?? ""} onChange={set("margin")} className={`${inputCls} h-12`} aria-invalid={!!marginErr} />
            {marginErr && <span className="mt-1 block text-xs font-medium text-destructive">{marginErr}</span>}
          </label>
          <label className="block min-w-0 text-sm font-semibold">Yearly Growth (%) <span className="text-primary">*</span>
            <input type="number" inputMode="decimal" placeholder="e.g. 20" value={v["growth"] ?? ""} onChange={set("growth")} className={`${inputCls} h-12`} aria-invalid={!!growthErr} />
            {growthErr && <span className="mt-1 block text-xs font-medium text-destructive">{growthErr}</span>}
          </label>
          <label className="block min-w-0 text-sm font-semibold">Existing Loans / Funding <span className="text-primary">*</span>
            <select value={loans} onChange={set("loans")} className={`${inputCls} h-12`}>
              <option value="">Select option</option>
              {["No Existing Loans", "Yes — Business Loan", "Yes — Machinery Loan", "Yes — Other Funding"].map((l) => <option key={l}>{l}</option>)}
            </select>
          </label>
        </div>

        <div className="flex gap-3">
          <Button size="lg" className="h-12 min-w-0 flex-1 whitespace-normal text-center" disabled={!valid} onClick={() => setDone(true)}>
            Calculate Valuation & Funding
          </Button>
          <Button size="lg" variant="outline" className="h-12" onClick={reset}>
            <RotateCcw aria-hidden="true" /> <span className="max-sm:sr-only">Reset</span>
          </Button>
        </div>

        <div className="border-l-4 border-primary bg-secondary px-5 py-4 text-xs leading-relaxed text-muted-foreground">
          <div className="flex items-center gap-2 font-bold text-primary"><Info className="size-4" aria-hidden="true" /> How it works</div>
          <p className="mt-2">Valuation industry-standard revenue aur profit multiples par based hai, jo years in business, growth aur existing loans se adjust hoti hai. Funding estimate valuation ka lagbhag 20–30% hota hai, aur equity share post-money valuation ke hisaab se nikala jata hai.</p>
        </div>
      </div>

      <div className="rounded-md border border-primary/30 bg-card p-5 sm:p-7 lg:self-start" aria-live="polite">
        <p className="font-display text-xl font-extrabold"><span className="text-primary">Result</span> Valuation & Funding Estimate</p>
        {show && result ? (
          <>
            <div className={`mt-5 flex items-start gap-3 rounded-md border px-4 py-3 ${toneCls[result.verdict.tone]}`}>
              {result.verdict.tone === "good" ? <BadgeCheck className="mt-0.5 size-5 shrink-0" aria-hidden="true" /> : result.verdict.tone === "warn" ? <TriangleAlert className="mt-0.5 size-5 shrink-0" aria-hidden="true" /> : <BadgeX className="mt-0.5 size-5 shrink-0" aria-hidden="true" />}
              <div>
                <p className="font-bold">{result.verdict.label}</p>
                <p className="mt-1 text-sm font-normal leading-relaxed text-muted-foreground">{result.verdict.note}</p>
              </div>
            </div>

            <div className="mt-5 border-l-4 border-primary bg-primary/10 px-5 py-4">
              <p className="text-sm font-semibold">Estimated Business Valuation</p>
              <p className="mt-1 text-3xl font-bold tabular-nums text-primary sm:text-4xl">
                {result.valuation > 0 ? compact(result.valuation) : "—"}
              </p>
              {result.valuation > 0 && <p className="mt-1 text-xs text-muted-foreground">({rupees(result.valuation)})</p>}
            </div>

            <dl className="mt-5 divide-y divide-border text-sm">
              {[
                ["Eligibility Score", `${result.score} / 100`],
                ["Estimated Annual Profit", compact(Math.max(0, result.profit))],
                ["Approx. Funding Possible", result.valuation > 0 ? `${compact(result.fundingLow)} – ${compact(result.fundingHigh)}` : "Seed stage — case by case"],
                ["Approx. Equity Dilution", result.valuation > 0 ? `${result.equityLow.toFixed(1)}% – ${result.equityHigh.toFixed(1)}%` : "—"],
              ].map(([k, val]) => (
                <div key={k} className="flex justify-between gap-4 py-2.5">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="text-right font-semibold tabular-nums">{val}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">*Ye figures indicative estimates hain. Actual valuation, funding amount aur equity terms investor / funding partner ki due diligence, negotiation aur written agreement par depend karte hain.</p>
            <Button asChild size="lg" className="mt-5 h-12 w-full"><a href="#apply">Apply for Funding <ArrowRight aria-hidden="true" /></a></Button>
          </>
        ) : (
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Apne business ki details bhariye, phir “Calculate Valuation & Funding” dabaiye. Aapko estimated valuation, eligibility, approx funding amount aur equity percentage yahan dikhega.</p>
        )}
      </div>
    </div>
  );
}
