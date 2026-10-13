export type HelperInput = { key: string; label: string; required?: boolean; hint?: string };
export type Helper = { trigger: string; title: string; explain: string; formula: string; unit: "₹" | "%" | "days"; inputs: HelperInput[]; compute: (n: Record<string, number>) => number | null };

const sum = (n: Record<string, number>, keys: string[]) => keys.reduce((s, k) => s + (n[k] ?? 0), 0);
const pct = (a: number, b: number) => (b > 0 ? (a / b) * 100 : null);

export const HELPERS: Record<string, Helper> = {
  ebitda: {
    trigger: "Find EBITDA", title: "Find your EBITDA", unit: "₹",
    explain: "EBITDA is your profit before interest, tax, depreciation and amortisation — the money your core business earns from operations. Take the figures from your Profit & Loss statement for the last full year.",
    formula: "EBITDA = Net Profit + Interest + Tax + Depreciation + Amortisation",
    inputs: [
      { key: "np", label: "Net Profit (₹)", required: true, hint: "Profit after all expenses and tax. Use a minus sign for a loss." },
      { key: "interest", label: "Interest paid on loans (₹)" },
      { key: "tax", label: "Income tax paid (₹)" },
      { key: "dep", label: "Depreciation (₹)", hint: "Yearly wear-and-tear value of machines, vehicles, buildings." },
      { key: "amort", label: "Amortisation (₹)", hint: "Like depreciation, for software, patents, licences." },
    ],
    compute: (n) => sum(n, ["np", "interest", "tax", "dep", "amort"]),
  },
  netProfit: {
    trigger: "Find Net Profit", title: "Find your Net Profit", unit: "₹",
    explain: "Net profit is what remains from your yearly sales after paying every expense, interest and tax.",
    formula: "Net Profit = Revenue − Cost of Goods − Operating Expenses − Interest − Depreciation − Tax",
    inputs: [
      { key: "rev", label: "Annual Revenue / Sales (₹)", required: true },
      { key: "cogs", label: "Cost of goods / raw material (₹)" },
      { key: "opex", label: "Salaries, rent, electricity, marketing & other expenses (₹)" },
      { key: "interest", label: "Interest paid (₹)" },
      { key: "dep", label: "Depreciation (₹)" },
      { key: "tax", label: "Income tax (₹)" },
    ],
    compute: (n) => (n["rev"] ?? 0) - sum(n, ["cogs", "opex", "interest", "dep", "tax"]),
  },
  grossMargin: {
    trigger: "Find Gross Margin", title: "Find your Gross Margin", unit: "%",
    explain: "Gross margin shows how much of every ₹100 of sales is left after paying the direct cost of making or buying the product.",
    formula: "Gross Margin % = (Revenue − Cost of Goods) ÷ Revenue × 100",
    inputs: [
      { key: "rev", label: "Annual Revenue (₹)", required: true },
      { key: "cogs", label: "Cost of goods sold (₹)", required: true, hint: "Raw material, packing, factory labour, purchase cost of goods." },
    ],
    compute: (n) => pct((n["rev"] ?? 0) - (n["cogs"] ?? 0), n["rev"] ?? 0),
  },
  growth: {
    trigger: "Find Growth %", title: "Find your Annual Growth", unit: "%",
    explain: "Growth compares this year's revenue with last year's.",
    formula: "Growth % = (This Year Revenue − Last Year Revenue) ÷ Last Year Revenue × 100",
    inputs: [
      { key: "now", label: "This year's revenue (₹)", required: true },
      { key: "last", label: "Last year's revenue (₹)", required: true },
    ],
    compute: (n) => { const p = pct((n["now"] ?? 0) - (n["last"] ?? 0), n["last"] ?? 0); return p; },
  },
  assets: {
    trigger: "Find Total Assets", title: "Find your Total Assets", unit: "₹",
    explain: "Total assets is the current value of everything the business owns. Use your balance sheet or today's fair value.",
    formula: "Total Assets = Land & Building + Machinery + Vehicles & Furniture + Stock + Money to receive + Cash & Bank + Other",
    inputs: [
      { key: "land", label: "Land & building (₹)" }, { key: "mach", label: "Plant & machinery (₹)" },
      { key: "veh", label: "Vehicles, furniture, computers (₹)" }, { key: "stock", label: "Stock / inventory (₹)" },
      { key: "rec", label: "Money customers owe you (₹)" }, { key: "cash", label: "Cash & bank balance (₹)" },
      { key: "other", label: "Deposits, investments & other (₹)" },
    ],
    compute: (n) => sum(n, ["land", "mach", "veh", "stock", "rec", "cash", "other"]),
  },
  liabilities: {
    trigger: "Find Total Liabilities", title: "Find your Total Liabilities", unit: "₹",
    explain: "Total liabilities is everything the business owes to others.",
    formula: "Total Liabilities = Bank Loans + Other Loans + Money owed to suppliers + Pending dues",
    inputs: [
      { key: "bank", label: "Bank loans, OD / CC outstanding (₹)" }, { key: "other", label: "Loans from relatives / NBFC (₹)" },
      { key: "supp", label: "Money owed to suppliers (₹)" }, { key: "dues", label: "Pending salary, tax, GST & other dues (₹)" },
    ],
    compute: (n) => sum(n, ["bank", "other", "supp", "dues"]),
  },
  debt: {
    trigger: "Find Debt", title: "Find your Current Debt", unit: "₹",
    explain: "Debt is only borrowed money on which you pay interest. It is a part of total liabilities.",
    formula: "Debt = Term Loans + OD / CC used + Other interest-bearing loans",
    inputs: [{ key: "term", label: "Term loans outstanding (₹)" }, { key: "od", label: "OD / CC limit used (₹)" }, { key: "other", label: "Other loans (₹)" }],
    compute: (n) => sum(n, ["term", "od", "other"]),
  },
  utilization: {
    trigger: "Find Utilization", title: "Find Capacity Utilization", unit: "%",
    explain: "How much of your maximum production capacity you actually use.",
    formula: "Utilization % = Actual Production ÷ Maximum Capacity × 100",
    inputs: [{ key: "actual", label: "Actual monthly production (units)", required: true }, { key: "max", label: "Maximum possible monthly production (units)", required: true }],
    compute: (n) => { const p = pct(n["actual"] ?? 0, n["max"] ?? 0); return p === null ? null : Math.min(100, p); },
  },
  repeat: {
    trigger: "Find Repeat Rate", title: "Find Repeat Customer Rate", unit: "%",
    explain: "The share of customers who bought from you more than once in the last year.",
    formula: "Repeat Rate % = Customers who bought again ÷ Total Customers × 100",
    inputs: [{ key: "rep", label: "Customers who bought more than once", required: true }, { key: "total", label: "Total customers in the year", required: true }],
    compute: (n) => { const p = pct(n["rep"] ?? 0, n["total"] ?? 0); return p === null ? null : Math.min(100, p); },
  },
  receivableDays: {
    trigger: "Find Days", title: "Find Average Collection Days", unit: "days",
    explain: "On average, how many days customers take to pay you.",
    formula: "Collection Days = Money customers owe you ÷ Annual Revenue × 365",
    inputs: [{ key: "rec", label: "Money customers owe you today (₹)", required: true }, { key: "rev", label: "Annual Revenue (₹)", required: true }],
    compute: (n) => ((n["rev"] ?? 0) > 0 ? ((n["rec"] ?? 0) / n["rev"]!) * 365 : null),
  },
  topCustomerShare: {
    trigger: "Find Share", title: "Find Top Customer Share", unit: "%",
    explain: "What part of your total sales comes from your single biggest customer.",
    formula: "Top Customer Share % = Sales to biggest customer ÷ Total Revenue × 100",
    inputs: [{ key: "top", label: "Yearly sales to biggest customer (₹)", required: true }, { key: "rev", label: "Annual Revenue (₹)", required: true }],
    compute: (n) => { const p = pct(n["top"] ?? 0, n["rev"] ?? 0); return p === null ? null : Math.min(100, p); },
  },
  recurring: {
    trigger: "Find Recurring %", title: "Find Recurring Revenue", unit: "%",
    explain: "Revenue that comes again every month from contracts, subscriptions or fixed regular buyers.",
    formula: "Recurring % = Regular / contract revenue ÷ Total Revenue × 100",
    inputs: [{ key: "rec", label: "Yearly regular / contract revenue (₹)", required: true }, { key: "rev", label: "Annual Revenue (₹)", required: true }],
    compute: (n) => { const p = pct(n["rec"] ?? 0, n["rev"] ?? 0); return p === null ? null : Math.min(100, p); },
  },
};
