import { useEffect, useId, useState } from "react";
import { Bar, CartesianGrid, ComposedChart, Line, Pie, PieChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { compact, type Valuation } from "./valuation-engine";

export function Gauge({ value, label, caption }: { value: number; label: string; caption: string }) {
  const id = useId();
  const [score, setScore] = useState(0);
  useEffect(() => { const frame = requestAnimationFrame(() => setScore(value)); return () => cancelAnimationFrame(frame); }, [value]);
  return <div className="valuation-score"><h3>{label}</h3><svg viewBox="0 0 180 116" role="img" aria-label={`${label}: ${value} out of 100`}>
    <defs><linearGradient id={id} x1="0" y1="0" x2="1" y2="0"><stop offset="0%" className="gauge-danger" /><stop offset="38%" className="gauge-warning" /><stop offset="65%" className="gauge-yellow" /><stop offset="100%" className="gauge-success" /></linearGradient></defs>
    <path d="M 18 92 A 72 72 0 0 1 162 92" fill="none" stroke="var(--muted)" strokeWidth="13" strokeLinecap="round" />
    <path className="gauge-arc" d="M 18 92 A 72 72 0 0 1 162 92" fill="none" stroke={`url(#${id})`} strokeWidth="13" strokeLinecap="round" pathLength="100" strokeDasharray={`${score} 100`} />
    <text x="86" y="87" textAnchor="middle" className="gauge-value">{value}</text><text x="114" y="87" className="gauge-denominator">/100</text>
  </svg><span className={`score-caption ${value < 60 ? "warning-caption" : ""}`}>{caption}</span></div>;
}

export function RevenueChart({ result }: { result: Valuation }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const growth = Math.min(0.4, Math.max(-0.2, result.growth / 100));
  const h = result.history;
  const actual = h ? h.rows.filter((r) => Number(r.revenue) > 0).map((r) => ({ year: h.unit === "year" ? r.label.replace("FY ", "") : r.label.replace("Month ", "M"), Revenue: Number(r.revenue) / 1e7, "Net Profit": Number(r.netProfit || 0) / 1e7 })) : [];
  const projected = Array.from({ length: actual.length ? 3 : 5 }, (_, i) => ({ year: actual.length ? `P${i + 1}` : `Y${i + 1}`, Revenue: result.revenue * (1 + growth) ** (actual.length ? i + 1 : i) / 1e7, "Net Profit": result.np * (1 + growth) ** (actual.length ? i + 1 : i) / 1e7 }));
  const data = [...actual, ...projected];
  return <div className="valuation-trend">{ready && <ResponsiveContainer width="100%" height="100%"><ComposedChart data={data} margin={{ top: 10, right: 6, bottom: 0, left: -25 }}><CartesianGrid vertical={false} stroke="var(--border)" /><XAxis dataKey="year" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} /><YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 9 }} tickFormatter={(n: number) => `₹${n.toFixed(1)}Cr`} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)", fontSize: 11 }} formatter={(value: number) => compact(value * 1e7)} /><Bar dataKey="Revenue" fill="var(--chart-revenue)" radius={[2, 2, 0, 0]} maxBarSize={22} /><Line dataKey="Net Profit" type="monotone" stroke="var(--chart-profit)" fill="var(--chart-profit)" strokeWidth={2} dot={{ r: 2 }} /></ComposedChart></ResponsiveContainer>}</div>;
}

export function FundingDonut({ result }: { result: Valuation }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const amount = (result.fundLow + result.fundHigh) / 2;
  const equity = result.mid > 0 ? amount / (result.mid + amount) * 100 : 0;
  const data = [{ name: "Promoter Equity", value: Math.max(0, 95 - equity), color: "var(--chart-revenue)" }, { name: "Investor Equity", value: equity, color: "var(--chart-equity)" }, { name: "ESOP Pool", value: 5, color: "var(--chart-profit)" }];
  return <div className="valuation-funding-chart"><div className="valuation-donut">{ready && <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data} dataKey="value" innerRadius="73%" outerRadius="98%" startAngle={90} endAngle={-270} stroke="none">{data.map((d) => <Cell key={d.name} fill={d.color} />)}</Pie><Tooltip contentStyle={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)", fontSize: 11 }} formatter={(n: number) => `${n.toFixed(1)}%`} /></PieChart></ResponsiveContainer>}<div className="donut-center"><strong>{compact(amount)}</strong><span>Funding</span></div></div><ul>{data.map((d, i) => <li key={d.name}><span className={`chart-dot chart-dot-${i}`} />{d.name}<strong>{d.value.toFixed(0)}%</strong></li>)}</ul></div>;
}