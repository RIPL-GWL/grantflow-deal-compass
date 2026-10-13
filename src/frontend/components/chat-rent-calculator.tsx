import { useState } from "react";
import { Calculator } from "lucide-react";
import { Button } from "./ui/button";
import locations from "@/frontend/data/locations.json";
import { explainRental, explainStore } from "@/lib/ripl-assistant";

const rows = locations as [string, string, string, string, number][];
export function ChatRentCalculator({ onResult }: { onResult: (text: string) => void }) {
  const [mode, setMode] = useState("manufacturer");
  const [plan, setPlan] = useState<"local" | "next" | "domestic">("local");
  const [months, setMonths] = useState("1");
  const [sales, setSales] = useState("");
  const [share, setShare] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [town, setTown] = useState("");
  const [area, setArea] = useState("");
  const [error, setError] = useState("");
  const unique = (values: string[]) => [...new Set(values)].sort();
  return <form className="chat-calculator" onSubmit={e => {
    e.preventDefault(); setError("");
    try {
      if (mode === "manufacturer") onResult(explainRental(plan, Number(months), Number(sales), share === "" ? undefined : Number(share)));
      else { const row = rows.find(r => r[0] === state && r[1] === district && r[2] === town); if (!row) throw new Error("Choose the complete store location."); onResult(explainStore(Number(area), row[4], `${town}, ${district}, ${state}`)); }
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Check your inputs."); }
  }}>
    <h3>Calculate Rent</h3>
    <label>Calculation type<select value={mode} onChange={e => { setMode(e.target.value); setError(""); }}><option value="manufacturer">Manufacturer rental charges</option><option value="retailer">Retailer store income</option></select></label>
    {mode === "manufacturer" ? <>
      <label>Rental plan<select value={plan} onChange={e => setPlan(e.target.value as typeof plan)}><option value="local">Local · ₹750/month</option><option value="next">Next Level · ₹1,000/month</option><option value="domestic">Domestic · ₹1,250/month</option></select></label>
      <div className="chat-field-grid"><label>Months<input type="number" min="1" max="120" required value={months} onChange={e => setMonths(e.target.value)} /></label><label>Agreed share (%)<input type="number" min="5" max="10" step="0.01" placeholder="5–10% range" value={share} onChange={e => setShare(e.target.value)} /></label></div>
      <label>Sales for selected period (₹)<input type="number" min="0" step="0.01" required placeholder="e.g. 100000" value={sales} onChange={e => setSales(e.target.value)} /></label>
    </> : <>
      <label>State / UT<select required value={state} onChange={e => { setState(e.target.value); setDistrict(""); setTown(""); }}><option value="">Select state</option>{unique(rows.map(r => r[0])).map(s => <option key={s}>{s}</option>)}</select></label>
      <label>District<select required disabled={!state} value={district} onChange={e => { setDistrict(e.target.value); setTown(""); }}><option value="">Select district</option>{unique(rows.filter(r => r[0] === state).map(r => r[1])).map(s => <option key={s}>{s}</option>)}</select></label>
      <label>City / Town<select required disabled={!district} value={town} onChange={e => setTown(e.target.value)}><option value="">Select city</option>{unique(rows.filter(r => r[0] === state && r[1] === district).map(r => r[2])).map(s => <option key={s}>{s}</option>)}</select></label>
      <label>Store area (sq.ft.)<input type="number" min="0.01" step="0.01" required value={area} onChange={e => setArea(e.target.value)} /></label>
    </>}
    {error && <p role="alert" className="text-destructive">{error}</p>}
    <Button type="submit" className="w-full"><Calculator />Calculate</Button>
  </form>;
}