import { historyGrowth, parseHistory } from "./valuation-history";
export const rupees = (n: number) => `₹${Math.round(Number.isFinite(n) ? n : 0).toLocaleString("en-IN")}`;
export const compact = (n: number) => {
  if (!Number.isFinite(n) || n <= 0) return "—";
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2).replace(/\.00$/, "")} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(1).replace(/\.0$/, "")} Lakh`;
  return rupees(n);
};

const TYPES = ["Manufacturer", "Startup", "Service", "Trading", "D2C"] as const;
const INDUSTRY: Record<string, { rev: number; ebitda: number }> = {
  "FMCG - Food & Beverages": { rev: 1.2, ebitda: 8 },
  "Personal & Home Care": { rev: 1.3, ebitda: 9 },
  "Health & Wellness": { rev: 1.5, ebitda: 10 },
  Chemicals: { rev: 1.0, ebitda: 7 },
  "Machinery & Equipment": { rev: 0.9, ebitda: 6 },
  "Technology / SaaS": { rev: 3.0, ebitda: 14 },
  "Retail / Trading": { rev: 0.5, ebitda: 6 },
  "Services": { rev: 1.0, ebitda: 7 },
  Other: { rev: 1.0, ebitda: 7 },
};
const STAGES: Record<string, number> = { "Idea / Pre-Revenue": 0.6, "Early Revenue": 0.8, "Growth Stage": 1, "Established / Mature": 1.1 };
const YEARS: Record<string, number> = { "Less than 1 year": 0.75, "1–3 years": 0.9, "3–5 years": 1, "5–10 years": 1.08, "10+ years": 1.15 };
const MARKETS = ["Local (City/District)", "State Level", "Pan India", "International"];
const COMPLIANCE = ["GST", "MCA", "FSSAI", "ISO", "Udyam"];
const STRUCTURES: Record<string, number> = { "Private Limited Company": 10, LLP: 7, Partnership: 5, Proprietorship: 3 };
const RECORDS: Record<string, number> = { "Yes (Last 3 Years, Audited)": 10, "Yes (1–2 Years)": 6, "No / Incomplete": 1 };

export type S = { [K in "type"|"name"|"industry"|"stage"|"years"|"desc"|"revenue"|"ebitda"|"netProfit"|"growth"|"grossMargin"|"utilization"|"assets"|"liabilities"|"debt"|"orders"|"customers"|"repeat"|"experience"|"team"|"structure"|"records"|"marketSize"|"usp"]?: string } & Record<string, string | undefined>;
const num = (v?: string) => { const n = Number(v); return Number.isFinite(n) ? n : 0; };
const clamp = (n: number, a = 0, b = 100) => Math.min(b, Math.max(a, n));


const MARKET_SIZE: Record<string, number> = { "Below ₹100 Cr": 3, "₹100 Cr – ₹500 Cr": 7, "₹500 Cr – ₹5,000 Cr": 11, "Above ₹5,000 Cr": 15 };
const COMPETITION: Record<string, number> = { "Low (few competitors)": 12, "Medium": 6, "High (many competitors)": 0 };
const SECOND_LINE: Record<string, number> = { "Yes, trained managers run daily work": 12, "Partly": 6, "No, owner handles everything": 0 };
const KEY_PERSON: Record<string, number> = { "Low": 6, "Medium": 0, "High (business stops without owner)": -10 };
const LITIGATION: Record<string, number> = { "None": 8, "Minor / settled": 0, "Yes, pending major case": -18 };
const FILINGS: Record<string, number> = { "Always on time": 8, "Sometimes delayed": 0, "Often delayed / pending": -12 };
const EXPANSION: Record<string, number> = { "Detailed plan with budget": 12, "Plan ready, budget pending": 7, "Only an idea": 2, "No expansion planned": 0 };
export const OPTIONS = { TYPES, INDUSTRY, STAGES, YEARS, MARKETS, COMPLIANCE, STRUCTURES, RECORDS, MARKET_SIZE, COMPETITION, SECOND_LINE, KEY_PERSON, LITIGATION, FILINGS, EXPANSION };
export function calculateValuation(v: S, markets: string[], comp: string[]) {
    const history = parseHistory(v["history"]);
    const histGrowth = historyGrowth(history);
    const revenue = num(v.revenue), ebitda = num(v.ebitda), np = num(v.netProfit);
    const assets = num(v.assets), liab = num(v.liabilities), debt = num(v.debt);
    const growth = histGrowth ?? num(v.growth), gm = num(v.grossMargin), repeat = num(v.repeat);
    const topShare = num(v["topCustomerShare"]), cash = num(v["cash"]), recDays = num(v["receivableDays"]), recurring = num(v["recurring"]);
    const pick = (map: Record<string, number>, key: string) => map[v[key] ?? ""] ?? 0;
    const lossYears = history ? history.rows.filter((r) => r.netProfit.trim() && Number(r.netProfit) < 0).length : 0;
    const orders = num(v.orders), util = num(v.utilization), exp = num(v.experience);
    const ind = INDUSTRY[v.industry ?? ""] ?? { rev: 1, ebitda: 7 };
    const stageF = STAGES[v.stage ?? ""] ?? 1, yearsF = YEARS[v.years ?? ""] ?? 1;
    const growthF = clamp(1 + growth / 100, 0.7, 1.6);

    const revLow = revenue * ind.rev * 0.8, revHigh = revenue * ind.rev * 1.25;
    const ebLow = Math.max(0, ebitda) * ind.ebitda * 0.8, ebHigh = Math.max(0, ebitda) * ind.ebitda * 1.25;
    // Simple 5-year DCF: FCF ≈ net profit growing at capped growth, 18% discount, 4% terminal
    const g = clamp(growth, -20, 40) / 100; let dcf = 0; let cf = Math.max(0, np);
    for (let y = 1; y <= 5; y++) { cf *= 1 + g; dcf += cf / Math.pow(1.18, y); }
    dcf += (cf * 1.04) / (0.18 - 0.04) / Math.pow(1.18, 5);
    const nav = Math.max(0, assets - liab);
    const methods = [
      { name: `Revenue Multiple (${(ind.rev * 0.8).toFixed(1)}x – ${(ind.rev * 1.25).toFixed(1)}x)`, low: revLow, high: revHigh, w: 0.3 },
      { name: `EBITDA Multiple (${(ind.ebitda * 0.8).toFixed(0)}x – ${(ind.ebitda * 1.25).toFixed(0)}x)`, low: ebLow, high: ebHigh, w: 0.3 },
      { name: "DCF (5 Year Projection)", low: dcf * 0.85, high: dcf * 1.15, w: 0.25 },
      { name: "Asset Based (Net Assets)", low: nav * 0.9, high: nav * 1.1, w: 0.15 },
    ];
    const adj = stageF * yearsF * clamp(growthF, 0.85, 1.25) * (debt > assets * 0.6 ? 0.88 : 1)
      * (topShare > 50 ? 0.92 : 1) * (v["litigation"] === "Yes, pending major case" ? 0.9 : 1) * (v["keyPerson"] === "High (business stops without owner)" ? 0.95 : 1);
    const low = methods.reduce((s, m) => s + m.low * m.w, 0) * adj;
    const high = methods.reduce((s, m) => s + m.high * m.w, 0) * adj;
    const mid = (low + high) / 2;

    const margin = revenue > 0 ? (np / revenue) * 100 : 0;
    const ebMargin = revenue > 0 ? (ebitda / revenue) * 100 : 0;
    type Part = [string, number];
    const r1 = (n: number) => Math.round(n * 10) / 10;
    const teamPts = v.team === "50+" ? 30 : v.team === "25-50" ? 25 : v.team === "10-25" ? 18 : 10;
    const parts: { p: string; w: number; parts: Part[] }[] = [
      { p: "Revenue & Growth Potential", w: 20, parts: [
        [`Revenue size (${compact(revenue)})`, revenue >= 5e7 ? 50 : revenue >= 1e7 ? 40 : revenue >= 2e6 ? 30 : revenue > 0 ? 18 : 5],
        [`Growth ${r1(growth)}% × 1.5 (max 50)`, clamp(growth * 1.5, 0, 50)],
        [`Biggest customer ${topShare}% of sales`, topShare > 50 ? -12 : topShare > 30 ? -5 : 0]] },
      { p: "Profitability & Margins", w: 15, parts: [
        ["Base", 20], [`Net margin ${r1(margin)}% × 3`, margin * 3], [`Gross margin ${gm}% × 0.8`, gm * 0.8], [`Loss years in history (${lossYears}) × −8`, -lossYears * 8]] },
      { p: "Assets & Financial Strength", w: 15, parts: [
        ["Base", 15], [`Net worth ratio (1 − liabilities ÷ assets) × 80`, assets > 0 ? (1 - liab / assets) * 80 : 0],
        ["Cash ÷ liabilities × 20 (max 10)", liab > 0 ? clamp((cash / liab) * 20, 0, 10) : cash > 0 ? 10 : 0],
        [`Collection days (${recDays})`, recDays > 120 ? -12 : recDays > 90 ? -6 : 0]] },
      { p: "Market Opportunity", w: 15, parts: [
        [`Markets served (${markets.length}) × 15`, markets.length * 15], [`Repeat customers ${repeat}% × 0.35`, repeat > 0 ? repeat * 0.35 : 0],
        [`Market size (${v.marketSize || "not given"})`, pick(MARKET_SIZE, "marketSize")], [`Competition (${v["competition"] || "not given"})`, pick(COMPETITION, "competition")]] },
      { p: "Management Team", w: 15, parts: [
        ["Base", 12], [`Promoter experience ${exp} yrs × 5`, exp * 5], [`Team size (${v.team || "not given"})`, teamPts],
        [`Second-line managers (${v["secondLine"] || "not given"})`, pick(SECOND_LINE, "secondLine")], [`Owner dependence (${v["keyPerson"] || "not given"})`, pick(KEY_PERSON, "keyPerson")]] },
      { p: "Risk & Compliance", w: 10, parts: [
        [`Registrations (${comp.length}) × 12`, comp.length * 12], [`Business structure (${v.structure || "not given"})`, (STRUCTURES[v.structure ?? ""] ?? 3) * 2],
        [`Financial records (${v.records || "not given"})`, (RECORDS[v.records ?? ""] ?? 1) * 2],
        [`Legal cases (${v["litigation"] || "not given"})`, pick(LITIGATION, "litigation")], [`Tax filing (${v["filings"] || "not given"})`, pick(FILINGS, "filings")]] },
      { p: "Scalability & Expansion", w: 10, parts: [
        [`Capacity used ${util}% × 0.6`, util * 0.6], ["Order book ÷ revenue × 200 (max 30)", revenue > 0 ? clamp((orders / revenue) * 200, 0, 30) : 0],
        [`Expansion plan (${v["expansion"] || "not given"})`, pick(EXPANSION, "expansion")], [`Recurring revenue ${recurring}% × 0.15 (max 15)`, clamp(recurring * 0.15, 0, 15)]] },
    ];
    const rows = parts.map((x) => {
      const raw = x.parts.reduce((t, [, n]) => t + n, 0);
      const sc = Math.round(clamp(raw));
      return { p: x.p, w: x.w, parts: x.parts.map(([l, n]) => ({ label: l, points: r1(n) })), raw: r1(raw), s: sc, ws: (sc * x.w) / 100 };
    });
    const valueScore = Math.round(rows.reduce((s, x) => s + x.ws, 0));
    const readiness = Math.round(clamp(valueScore * 0.6 + comp.length * 4 + (RECORDS[v.records ?? ""] ?? 1) * 1.5 + (STRUCTURES[v.structure ?? ""] ?? 3) * 0.5));
    const grade = valueScore >= 85 ? "A+" : valueScore >= 75 ? "A-" : valueScore >= 65 ? "B+" : valueScore >= 55 ? "B" : valueScore >= 45 ? "C" : "D";
    const fundLow = mid * (0.08 + readiness / 1000), fundHigh = mid * (0.16 + readiness / 600);
    const eqLow = high > 0 ? (fundLow / (high + fundLow)) * 100 : 0, eqHigh = low > 0 ? (fundHigh / (low + fundHigh)) * 100 : 0;
    const strengths: string[] = [], improve: string[] = [];
    (growth >= 15 ? strengths : improve).push(growth >= 15 ? "Healthy revenue growth" : "Revenue growth badhayein (15%+ target)");
    (margin >= 10 ? strengths : improve).push(margin >= 10 ? "Achha net profit margin" : "Profitability margins improve karein");
    (assets > 0 && liab / assets < 0.5 ? strengths : improve).push(assets > 0 && liab / assets < 0.5 ? "Manageable debt / liability level" : "Liabilities kam karein");
    (markets.length >= 2 ? strengths : improve).push(markets.length >= 2 ? "Multiple market presence" : "Naye geographies mein expand karein");
    (comp.length >= 3 ? strengths : improve).push(comp.length >= 3 ? "Compliance documentation available" : "Registrations / compliance poore karein");
    (exp >= 5 ? strengths : improve).push(exp >= 5 ? "Experienced promoter" : "Strong management team banayein");
    if (topShare > 50) improve.push("Ek customer par nirbharta kam karein (50% se zyada revenue ek customer se)");
    if (v["litigation"] === "Yes, pending major case") improve.push("Pending legal case ka solution valuation ke liye zaroori hai");
    if (v["secondLine"] === "Yes, trained managers run daily work") strengths.push("Second-line management in place");
    if (histGrowth !== null && histGrowth >= 15 && history && history.rows.length >= 3) strengths.push("Consistent multi-year growth track record");
    const ebitdaCalc = { ebitda: Math.max(0, ebitda), multiple: ind.ebitda, lowMult: ind.ebitda * 0.8, highMult: ind.ebitda * 1.25, base: Math.max(0, ebitda) * ind.ebitda, low: ebLow, high: ebHigh, adj };
    return { ebitdaCalc, history, growthFromHistory: histGrowth !== null, methods, low, high, mid, rows, valueScore, readiness, grade, fundLow, fundHigh, eqLow, eqHigh, strengths, improve, revenue, ebitda, np, orders, margin, ebMargin, growth };

}
export type Valuation = ReturnType<typeof calculateValuation>;
export const DEMO: S = { type: "Manufacturer", name: "Sharma Foods Private Limited", industry: "FMCG - Food & Beverages", stage: "Growth Stage", years: "3–5 years", desc: "We manufacture healthy snacks under our own brand and supply to retail stores and modern trade. We have 3 products and plan to expand to 5 new states in the next 2 years.", revenue: "12000000", ebitda: "1800000", netProfit: "1200000", growth: "10", grossMargin: "35", locations: "3", assets: "5000000", liabilities: "1800000", debt: "1000000", orders: "2500000", orderSize: "500000", utilization: "70", customers: "500", repeat: "60", marketSize: "₹500 Cr – ₹5,000 Cr", segments: "Retailers, Distributors, Modern Trade", usp: "Own Brand & Distribution Network", experience: "8", team: "25-50", management: "Sales & Distribution", structure: "Private Limited Company", records: "Yes (Last 3 Years, Audited)", topCustomerShare: "15", cash: "600000", receivableDays: "45", competition: "Medium", secondLine: "Partly", keyPerson: "Medium", litigation: "None", filings: "Always on time", expansion: "Plan ready, budget pending", recurring: "40", history: JSON.stringify({ unit: "year", rows: [{ label: "FY 2023-24", revenue: "9917355", ebitda: "1450000", netProfit: "950000" }, { label: "FY 2024-25", revenue: "10909091", ebitda: "1620000", netProfit: "1080000" }, { label: "FY 2025-26", revenue: "12000000", ebitda: "1800000", netProfit: "1200000" }] }) };
