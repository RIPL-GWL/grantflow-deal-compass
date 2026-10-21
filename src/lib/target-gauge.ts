/** Browser-safe target maths for the dashboard gauges. */

export type GaugeBand = "low" | "mid" | "good" | "over";

/** Achievement as a percentage of target (0 when no target). Not capped. */
export function achievementPct(achieved: number, target: number): number {
  if (!(target > 0)) return 0;
  return Math.round((Math.max(0, achieved) / target) * 100);
}

/** Needle angle in degrees: -120 (0%) to +120 (scale max, default 120%). */
export function needleAngle(pct: number, scaleMax = 120): number {
  const clamped = Math.min(Math.max(pct, 0), scaleMax);
  return -120 + (clamped / scaleMax) * 240;
}

/** Colour band: below 50% low, 50–79% mid, 80–99% good, 100%+ over. */
export function gaugeBand(pct: number): GaugeBand {
  if (pct >= 100) return "over";
  if (pct >= 80) return "good";
  if (pct >= 50) return "mid";
  return "low";
}

export type TeamLink = { user_id: string; team_leader_id: string | null; manager_id: string | null };

/** People whose targets a viewer may monitor: self, plus team members they lead or manage; everyone when seeAll. */
export function visibleMembers(viewer: string, links: TeamLink[], everyone: string[], seeAll: boolean): string[] {
  if (seeAll) return everyone;
  const mine = links.filter((l) => l.team_leader_id === viewer || l.manager_id === viewer).map((l) => l.user_id);
  return [...new Set([viewer, ...mine])];
}
