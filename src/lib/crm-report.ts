export const FUNNEL_STAGES = ["new", "qualified", "proposal", "negotiation", "won"] as const;
type D = { stage: string; value: number | string };

/** Stage-wise counts/values; "reached" = deals currently at or past that stage (lost excluded). */
export function stageFunnel(deals: D[]) {
  const idx = (s: string) => FUNNEL_STAGES.indexOf(s as (typeof FUNNEL_STAGES)[number]);
  const total = deals.length;
  return FUNNEL_STAGES.map((stage, i) => {
    const at = deals.filter((d) => d.stage === stage);
    const reached = deals.filter((d) => idx(d.stage) >= i).length;
    return { stage, count: at.length, value: at.reduce((s, d) => s + Number(d.value), 0), reached, reachedPct: total ? Math.round((reached / total) * 100) : 0 };
  });
}

/** Conversion rate = won / all closed (won + lost), in %. Won amount = sum of won values. */
export function conversionSummary(deals: D[]) {
  const won = deals.filter((d) => d.stage === "won");
  const lost = deals.filter((d) => d.stage === "lost").length;
  return {
    conversionRate: won.length + lost ? Math.round((won.length / (won.length + lost)) * 100) : 0,
    wonAmount: won.reduce((s, d) => s + Number(d.value), 0),
    wonCount: won.length,
    lostCount: lost,
  };
}
