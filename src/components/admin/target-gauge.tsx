import { achievementPct, gaugeBand, needleAngle } from "@/lib/target-gauge";
import { inr } from "@/lib/crm";

const BAND_COLOR: Record<string, string> = {
  low: "var(--destructive)",
  mid: "var(--gauge-mid)",
  good: "var(--gauge-good)",
  over: "var(--gauge-over)",
};

function arc(r: number, from: number, to: number) {
  const p = (a: number) => { const rad = ((a - 90) * Math.PI) / 180; return [100 + r * Math.cos(rad), 100 + r * Math.sin(rad)]; };
  const [x1, y1] = p(from), [x2, y2] = p(to);
  return `M ${x1} ${y1} A ${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${x2} ${y2}`;
}

/** Analog meter: 0–120% scale, needle shows achievement vs target. */
export function TargetGauge({ label, sub, achieved, target, size = "md" }: { label: string; sub?: string; achieved: number; target: number; size?: "md" | "lg" }) {
  const pct = achievementPct(achieved, target);
  const angle = needleAngle(pct);
  const color = BAND_COLOR[gaugeBand(pct)];
  const ticks = Array.from({ length: 13 }, (_, i) => i); // every 10%
  return (
    <figure className={`admin-gauge flex flex-col items-center rounded-xl border bg-card p-4 ${size === "lg" ? "md:p-6" : ""}`}>
      <svg viewBox="0 0 200 170" className={size === "lg" ? "w-64" : "w-44"} role="img" aria-label={`${label}: ${pct}% of target`}>
        <circle cx="100" cy="100" r="92" fill="var(--gauge-face)" stroke="var(--gauge-rim)" strokeWidth="3" />
        <path d={arc(78, -120, -20)} stroke="var(--destructive)" strokeWidth="8" fill="none" opacity="0.85" />
        <path d={arc(78, -20, 40)} stroke="var(--gauge-mid)" strokeWidth="8" fill="none" opacity="0.85" />
        <path d={arc(78, 40, 80)} stroke="var(--gauge-good)" strokeWidth="8" fill="none" opacity="0.85" />
        <path d={arc(78, 80, 120)} stroke="var(--gauge-over)" strokeWidth="8" fill="none" opacity="0.85" />
        {ticks.map((i) => {
          const a = -120 + i * 20; const rad = ((a - 90) * Math.PI) / 180; const major = i % 2 === 0;
          const r1 = major ? 62 : 66, r2 = 72;
          return (
            <g key={i}>
              <line x1={100 + r1 * Math.cos(rad)} y1={100 + r1 * Math.sin(rad)} x2={100 + r2 * Math.cos(rad)} y2={100 + r2 * Math.sin(rad)} stroke="var(--gauge-ink)" strokeWidth={major ? 2 : 1} />
              {major && <text x={100 + 52 * Math.cos(rad)} y={100 + 52 * Math.sin(rad) + 3} textAnchor="middle" fontSize="8" fill="var(--gauge-ink)">{i * 10}</text>}
            </g>
          );
        })}
        <g style={{ transform: `rotate(${angle}deg)`, transformOrigin: "100px 100px", transition: "transform 1.2s cubic-bezier(.2,.9,.3,1.2)" }}>
          <polygon points="97,100 103,100 100,26" fill={color} />
        </g>
        <circle cx="100" cy="100" r="8" fill="var(--gauge-ink)" />
        <circle cx="100" cy="100" r="3" fill={color} />
        <text x="100" y="136" textAnchor="middle" fontSize="20" fontWeight="700" fill="var(--gauge-ink)">{pct}%</text>
        <text x="100" y="152" textAnchor="middle" fontSize="8" fill="var(--gauge-muted)">OF TARGET</text>
      </svg>
      <figcaption className="mt-1 text-center">
        <p className="font-display text-sm font-semibold text-foreground">{label}</p>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
        <p className="mt-1 text-xs text-muted-foreground">{inr(achieved)} / {target > 0 ? inr(target) : "No target"}</p>
      </figcaption>
    </figure>
  );
}
