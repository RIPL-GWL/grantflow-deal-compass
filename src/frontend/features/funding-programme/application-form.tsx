import { useState } from "react";
import { SimpleMarkdown } from "@/frontend/components/simple-markdown";
import { Button } from "@/frontend/components/ui/button";
import { submitProgrammeApplication } from "@/lib/programme.functions";
import { applicationSchema, INTEREST_LABELS, registrationTotal, STAGE_LABELS_PROG } from "./rules";

const field = "programme-app-field";

export function ProgrammeApplicationForm() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ advice: string | null; adviceError?: string | undefined } | null>(null);
  const [participants, setParticipants] = useState(1);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const raw = Object.fromEntries(new FormData(e.currentTarget));
    const parsed = applicationSchema.safeParse({ ...raw, city: raw["city"] || undefined });
    if (!parsed.success) { setError("Kripya sabhi fields sahi bharein (idea kam se kam 20 characters)."); return; }
    setError(null); setBusy(true);
    try {
      const res = await submitProgrammeApplication({ data: parsed.data });
      if (!res.ok) setError(res.error); else setDone({ advice: res.advice, adviceError: "adviceError" in res ? res.adviceError : undefined });
    } catch { setError("Application submit nahi ho payi. Dobara try karein."); }
    setBusy(false);
  }

  if (done) return (
    <div className="programme-app-result">
      <h3>Application received ✓</h3>
      <p>Hamari Funding Programme team aapse jald contact karegi registration aur payment ke liye.</p>
      {done.advice ? <div className="programme-app-advice"><SimpleMarkdown text={done.advice} /><small>AI recommendation indicative hai — grant ya funding guaranteed nahi hai.</small></div>
        : <p className="programme-app-error">{done.adviceError}</p>}
    </div>
  );

  return (
    <form className="programme-app-form" onSubmit={onSubmit} noValidate>
      <label>Founder name<input name="founder_name" className={field} required maxLength={120} /></label>
      <label>Startup name<input name="startup_name" className={field} required maxLength={160} /></label>
      <label>Email<input name="email" type="email" className={field} required maxLength={200} /></label>
      <label>Phone<input name="phone" type="tel" className={field} required maxLength={20} /></label>
      <label>City<input name="city" className={field} maxLength={80} /></label>
      <label>Stage<select name="stage" className={field} defaultValue="idea">{Object.entries(STAGE_LABELS_PROG).map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>
      <label>Funding need (₹)<input name="funding_need" type="number" min={0} className={field} required defaultValue={1000000} /></label>
      <label>Funding interest<select name="funding_interest" className={field} defaultValue="both">{Object.entries(INTEREST_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>
      <label>Participants<input name="participants" type="number" min={1} max={10} className={field} value={participants} onChange={(e) => setParticipants(Math.max(1, Math.min(10, Number(e.target.value) || 1)))} /></label>
      <p className="programme-app-fee">Registration fee: <strong>₹{registrationTotal(participants).toLocaleString("en-IN")}</strong> incl. GST</p>
      <label className="programme-app-wide">Startup idea<textarea name="idea" className={field} rows={4} required minLength={20} maxLength={3000} placeholder="Aapka startup kya problem solve karta hai, kiske liye, aur kaise?" /></label>
      {error && <p className="programme-app-error programme-app-wide" role="alert">{error}</p>}
      <Button type="submit" variant="programme" size="lg" disabled={busy} className="programme-app-wide">{busy ? "Submitting & preparing AI recommendation…" : "Submit Application & Get AI Eligibility"}</Button>
    </form>
  );
}
