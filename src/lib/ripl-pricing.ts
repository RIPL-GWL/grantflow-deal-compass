export const RENT_RATES: Record<number, number> = { 1: 30, 2: 25, 3: 20, 4: 15, 5: 10 };
export const RENT_CAP = 10000;
export const PLAN_RATES = { local: 750, next: 1000, domestic: 1250 } as const;
export function storeRent(area: number, classification: number, rates: Record<number, number> = RENT_RATES, cap = RENT_CAP) {
  const rate = rates[classification];
  if (!Number.isFinite(area) || area <= 0 || !rate) throw new Error("Enter a positive store area and a valid location classification.");
  return { rate, areaRent: area * rate, rent: Math.min(cap, area * rate) };
}
export function rentalQuote(plan: keyof typeof PLAN_RATES, months: number, sales = 0, share?: number) {
  if (!Number.isInteger(months) || months < 1 || months > 120 || !Number.isFinite(sales) || sales < 0 || (share !== undefined && (!Number.isFinite(share) || share < 5 || share > 10))) throw new Error("Enter 1–120 months, non-negative sales and a 5–10% agreed share.");
  const rent = PLAN_RATES[plan] * months;
  const quote = (percent: number) => { const revenueShare = sales * percent / 100; const base = rent + revenueShare; const gst = Math.round(base * 18) / 100; return { percent, rent, revenueShare, base, gst, total: Math.round((base + gst) * 100) / 100 }; };
  return share === undefined ? [quote(5), quote(10)] : [quote(share)];
}