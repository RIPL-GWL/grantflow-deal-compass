import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Info, MapPin, RotateCcw } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import locations from "@/frontend/data/locations.json";

type Row = [string, string, string, string, number];
const DATA = locations as Row[];
import { RENT_RATES, RENT_CAP as DEFAULT_CAP, storeRent } from "@/lib/ripl-pricing";
import { useSiteContent } from "@/lib/site-content";
const TIER: Record<string, number> = { X: 1, Y: 2, Z: 3 };


const rupees = (n: number) => `₹${(Number.isFinite(n) ? Math.round(n) : 0).toLocaleString("en-IN")}`;
const uniq = (a: string[]) => [...new Set(a)].sort((x, y) => x.localeCompare(y));

const selectCls = "mt-2 h-12 w-full rounded-md border border-input bg-card px-3 text-base text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50";
const inputCls = "mt-2 h-12 w-full rounded-md border border-input bg-card px-4 text-base text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary";

export function IncomeCalculator() {
  const pricing = useSiteContent("pricing");
  const RATES: Record<number, number> = pricing ? Object.fromEntries(Object.entries(pricing.rentRates).map(([k, v]) => [Number(k), Number(v)])) : RENT_RATES;
  const RENT_CAP = pricing?.rentCap ?? DEFAULT_CAP;
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [town, setTown] = useState("");
  const [area, setArea] = useState("");
  const [calculated, setCalculated] = useState(false);

  const states = useMemo(() => uniq(DATA.map(r => r[0])), []);
  const districts = useMemo(() => uniq(DATA.filter(r => r[0] === state).map(r => r[1])), [state]);
  const towns = useMemo(() => uniq(DATA.filter(r => r[0] === state && r[1] === district).map(r => r[2])), [state, district]);
  const loc = useMemo(() => DATA.find(r => r[0] === state && r[1] === district && r[2] === town), [state, district, town]);

  const areaNum = Number(area);
  const areaErr = area !== "" && !(Number.isFinite(areaNum) && areaNum > 0) ? "Store area 0 se zyada hona chahiye." : "";
  const valid = !!loc && area !== "" && !areaErr;

  const step = calculated && valid ? 3 : loc && area !== "" && !areaErr ? 2 : 1;
  const rate = loc ? (RATES[loc[4]] ?? 0) : 0;
  const areaRent = valid ? areaNum * rate : 0;
  const rent = valid && loc ? storeRent(areaNum, loc[4], RATES, RENT_CAP).rent : 0;
  const show = calculated && valid;

  const reset = () => { setState(""); setDistrict(""); setTown(""); setArea(""); setCalculated(false); };
  const touch = () => setCalculated(false);

  return (
    <div>
      <ol className="mb-8 grid grid-cols-3 gap-2" aria-label="Progress">
        {["Location", "Store Details", "Estimated Rent"].map((l, i) => (
          <li key={l}>
            <div className={`h-1 rounded-full ${i < step ? "bg-primary" : "bg-border"}`} />
            <p className={`mt-2 text-xs font-semibold sm:text-sm ${i < step ? "text-foreground" : "text-muted-foreground"}`}><span className="text-primary">0{i + 1}</span> {l}</p>
          </li>
        ))}
      </ol>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="space-y-8">
          <fieldset>
            <legend className="font-display text-xl font-extrabold"><span className="text-primary">01</span> Location</legend>
            <div className="mt-3 grid gap-4 sm:grid-cols-3">
              <label className="block text-sm font-semibold">State / UT
                <select className={selectCls} value={state} onChange={e => { setState(e.target.value); setDistrict(""); setTown(""); touch(); }}>
                  <option value="">Select</option>{states.map(s => <option key={s}>{s}</option>)}
                </select>
              </label>
              <label className="block text-sm font-semibold">District
                <select className={selectCls} disabled={!state} value={district} onChange={e => { setDistrict(e.target.value); setTown(""); touch(); }}>
                  <option value="">Select</option>{districts.map(s => <option key={s}>{s}</option>)}
                </select>
              </label>
              <label className="block text-sm font-semibold">City / Town
                <select className={selectCls} disabled={!district} value={town} onChange={e => { setTown(e.target.value); touch(); }}>
                  <option value="">Select</option>{towns.map(s => <option key={s}>{s}</option>)}
                </select>
              </label>
            </div>
            {loc && (
              <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 rounded-md border border-border bg-secondary p-4 text-sm sm:grid-cols-3">
                <div className="col-span-2 sm:col-span-3"><dt className="text-muted-foreground">Location</dt><dd className="flex items-center gap-1.5 font-semibold"><MapPin className="size-4 text-primary" aria-hidden="true" />{loc[2]}, {loc[0]}</dd></div>
                <div><dt className="text-muted-foreground">Government Classification</dt><dd className="font-semibold">{loc[3]}</dd></div>
                <div><dt className="text-muted-foreground">Rishishwar Industry City Tier</dt><dd className="font-semibold">City Tier {TIER[loc[3]]}</dd></div>
                <div><dt className="text-muted-foreground">Rishishwar Industry Area</dt><dd className="font-semibold">Area {loc[4]}</dd></div>
                <div><dt className="text-muted-foreground">Applicable Base Rate</dt><dd className="font-semibold text-primary">₹{rate}/sq.ft.</dd></div>
                <p className="col-span-2 text-xs text-muted-foreground sm:col-span-3">Rishishwar Industry City Tier aur Area internal commercial classification hai, government classification nahi.</p>
              </dl>
            )}
          </fieldset>

          <fieldset>
            <legend className="font-display text-xl font-extrabold"><span className="text-primary">02</span> Store Details</legend>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-semibold">Store / Shop Area (sq.ft.)
                <input type="number" inputMode="numeric" min="1" placeholder="e.g. 500" value={area} onChange={e => { setArea(e.target.value.replace("-", "")); touch(); }} className={inputCls} aria-invalid={!!areaErr} />
                {areaErr && <span className="mt-1 block text-xs font-medium text-destructive">{areaErr}</span>}
              </label>
            </div>
          </fieldset>

          <div className="sticky bottom-3 z-10 flex gap-3 border border-border bg-background/95 p-2 backdrop-blur lg:static lg:border-0 lg:bg-transparent lg:p-0">
            <Button size="lg" className="h-12 flex-1" disabled={!valid} onClick={() => setCalculated(true)}>Calculate Estimated Rent</Button>
            <Button size="lg" variant="outline" className="h-12" onClick={reset}><RotateCcw aria-hidden="true" /> <span className="max-sm:sr-only">Reset Calculator</span></Button>
          </div>
        </div>

        <div className="rounded-md border border-primary/30 bg-card p-5 sm:p-7 lg:self-start" aria-live="polite">
          <p className="font-display text-xl font-extrabold"><span className="text-primary">03</span> Estimated Rent</p>
          {show && loc ? (
            <>
              <div className="mt-5 border-l-4 border-primary bg-primary/10 px-5 py-4">
                <p className="text-sm font-semibold">Approx. Monthly Store Rent</p>
                <p className="mt-1 text-3xl font-bold tabular-nums text-primary sm:text-4xl">{rupees(rent)} <span className="text-base font-medium text-foreground">/ month</span></p>
                <p className="mt-2 text-sm text-muted-foreground">Store area <strong className="text-foreground">{areaNum.toLocaleString("en-IN")} sq.ft.</strong> × <strong className="text-foreground">₹{rate}/sq.ft.</strong></p>
              </div>
              <dl className="mt-5 divide-y divide-border text-sm">
                {[
                  ["City / Town Tier", `City Tier ${TIER[loc[3]]} · Area ${loc[4]}`],
                  ["Applicable Base Rate", `₹${rate}/sq.ft.`],
                  ["Area-Based Rent", rupees(areaRent)],
                  ["Estimated Applicable Rent", rupees(rent)],
                ].map(([k, v]) => <div key={k} className="flex justify-between gap-4 py-2.5"><dt className="text-muted-foreground">{k}</dt><dd className="font-semibold tabular-nums">{v}</dd></div>)}
              </dl>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">*These figures are indicative estimates and may vary based on final store inspection, location assessment and commercial approval.</p>
              <Button asChild size="lg" className="mt-5 h-12 w-full"><Link to="/register-your-store">Register Your Store <ArrowRight aria-hidden="true" /></Link></Button>
            </>
          ) : (
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Location aur store area bhariye, phir “Calculate Estimated Rent” dabaiye. Aapka indicative monthly rent yahan dikhega.</p>
          )}
        </div>
      </div>

      <div className="mt-8 border-l-4 border-primary bg-secondary px-5 py-5 text-sm leading-relaxed sm:px-7">
        <div className="flex items-center gap-2 font-bold text-primary"><Info className="size-5" aria-hidden="true" /> Disclaimer</div>
        <p className="mt-2">Rent shown is an indicative estimate based on the information entered. Actual rent may vary based on store area, location, inspection and final commercial terms approved by Rishishwar Industry Private Limited.</p>
      </div>
    </div>
  );
}
