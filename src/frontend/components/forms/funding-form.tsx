import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Lock } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import locations from "@/frontend/data/locations.json";
import { COMPANY } from "@/frontend/content/company";
import { useServerFn } from "@tanstack/react-start";
import { submitLead } from "@/lib/leads.functions";
import { categoryOptions, turnoverOptions, amountOptions, loanOptions, inputCls, allStates } from "@/frontend/features/fund-your-business/content";

function Field({ label, optional, children }: { label: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-semibold">
      {label} {optional ? <span className="font-normal text-muted-foreground">(optional)</span> : <span className="text-primary">*</span>}
      {children}
    </label>
  );
}

export function FundingForm() {
  const [v, setV] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const send = useServerFn(submitLead);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setV({ ...v, [k]: e.target.value });

  const cities = useMemo(
    () => [...new Set((locations as [string, string, string, ...unknown[]][]).filter((r) => r[0] === v["state"]).map((r) => r[2]))].sort(),
    [v["state"]],
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await send({ data: { leadType: "funding", subject: "Business Funding Requirement", fields: v, sourcePage: window.location.pathname } });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
      <h3 className="funding-application-heading">01 · Business & Contact</h3>
      <Field label="Business / Company Name">
        <input required maxLength={150} value={v["company"] ?? ""} onChange={set("company")} placeholder="Enter company name" className={`${inputCls} h-12`} />
      </Field>
      <Field label="Founder / Promoter Name">
        <input required maxLength={150} value={v["founder"] ?? ""} onChange={set("founder")} placeholder="Enter founder name" className={`${inputCls} h-12`} />
      </Field>
      <Field label="Mobile Number">
        <input required type="tel" maxLength={15} pattern="[0-9+ ]{10,15}" value={v["phone"] ?? ""} onChange={set("phone")} placeholder="Enter mobile number" className={`${inputCls} h-12`} />
      </Field>
      <Field label="Email ID">
        <input required type="email" maxLength={150} value={v["email"] ?? ""} onChange={set("email")} placeholder="Enter email address" className={`${inputCls} h-12`} />
      </Field>
      <Field label="State">
        <select required value={v["state"] ?? ""} onChange={e => setV({ ...v, state: e.target.value, city: "" })} className={`${inputCls} h-12`}>
          <option value="">Select state</option>
          {allStates.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </Field>
      <Field label="City">
        <select required value={v["city"] ?? ""} onChange={set("city")} className={`${inputCls} h-12`} disabled={!v["state"]}>
          <option value="">Select city</option>
          {cities.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </Field>
      <h3 className="funding-application-heading">02 · Business Profile & Funding</h3>
      <Field label="Business Category">
        <select required value={v["category"] ?? ""} onChange={set("category")} className={`${inputCls} h-12`}>
          <option value="">Select category</option>
          {categoryOptions.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </Field>
      <Field label="Years in Business">
        <select required value={v["years"] ?? ""} onChange={set("years")} className={`${inputCls} h-12`}>
          <option value="">Select years</option>
          {["Less than 1 year", "1–3 years", "3–5 years", "5–10 years", "More than 10 years"].map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>
      </Field>
      <Field label="Annual Turnover (₹)">
        <select required value={v["turnover"] ?? ""} onChange={set("turnover")} className={`${inputCls} h-12`}>
          <option value="">Select turnover range</option>
          {turnoverOptions.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </Field>
      <Field label="Required Funding Amount (₹)">
        <select required value={v["amount"] ?? ""} onChange={set("amount")} className={`${inputCls} h-12`}>
          <option value="">Select amount</option>
          {amountOptions.map((a) => (
            <option key={a}>{a}</option>
          ))}
        </select>
      </Field>
      <fieldset className="sm:col-span-2">
        <legend className="text-sm font-semibold">Funding Purpose <span className="text-primary">*</span></legend>
        <div className="mt-3 flex flex-wrap gap-3">
          {["Machinery", "Working Capital", "Machinery + Working Capital", "Startup / Prototype", "Business Expansion"].map((p) => (
            <label
              key={p}
              className={`flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium transition-colors ${
                v["purpose"] === p ? "border-primary bg-accent text-primary" : "border-border text-muted-foreground hover:border-primary/50"
              }`}
            >
              <input
                type="radio"
                name="purpose"
                value={p}
                checked={v["purpose"] === p}
                onChange={set("purpose")}
                className="accent-primary"
                required
              />
              {p}
            </label>
          ))}
        </div>
      </fieldset>
      <h3 className="funding-application-heading">03 · Additional Details</h3>
      <Field label="Existing Loans / Funding">
        <select required value={v["loans"] ?? ""} onChange={set("loans")} className={`${inputCls} h-12`}>
          <option value="">Select option</option>
          {loanOptions.map((l) => (
            <option key={l}>{l}</option>
          ))}
        </select>
      </Field>
      <Field label="GST / Registration Details" optional>
        <input maxLength={150} value={v["gst"] ?? ""} onChange={set("gst")} placeholder="Enter GST number / registration details" className={`${inputCls} h-12`} />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Message" optional>
          <textarea maxLength={1000} rows={4} value={v["message"] ?? ""} onChange={set("message")} placeholder="Tell us more about your business and requirement..." className={`${inputCls} py-3`} />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" size="lg" disabled={loading} className="h-12 w-full sm:w-auto sm:px-10">
          {loading ? "Submitting…" : "Submit Funding Requirement"} <ArrowRight aria-hidden="true" />
        </Button>
        {error && <p role="alert" className="mt-3 text-sm text-destructive">{error} You can also email <a className="underline" href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.</p>}
        {done && (
          <p role="status" className="mt-3 flex items-center gap-2 text-sm text-primary">
             <CheckCircle2 className="size-4" /> Thank you! Your funding requirement has been received. Our team will contact you after an initial review.
          </p>
        )}
        <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <Lock className="size-3.5 shrink-0 text-primary" /> No account needed. Your details are stored securely and used only to assess your enquiry. Funding is subject to eligibility, assessment and funding-partner approval — approval is never guaranteed.
        </p>
      </div>
    </form>
  );
}

