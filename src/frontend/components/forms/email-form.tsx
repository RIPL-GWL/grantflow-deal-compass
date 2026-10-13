import { useState } from "react";
import { CheckCircle2, LoaderCircle, Send } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { submitLead, leadTypeFromSubject } from "@/lib/leads.functions";
import { COMPANY } from "@/frontend/content/company";
import { Button } from "@/frontend/components/ui/button";
import type { FormField } from "@/frontend/content/forms";

const inputCls =
  "mt-2 w-full rounded-md border border-input bg-background px-4 text-base outline-none focus:border-primary focus:ring-1 focus:ring-primary";

type EmailFormProps = {
  fields: FormField[];
  subject: string;
  intro: string;
  submitLabel?: string;
  successText?: string;
  columns?: 1 | 2;
  className?: string;
};

/** Shared form: collects the fields and opens the visitor's email app with a pre-filled message. */
export function EmailForm({
  fields,
  subject,
  intro,
  submitLabel = "Submit Registration",
  successText = "Thank you! Your details have been received. Our team will contact you shortly.",
  columns = 2,
  className = "",
}: EmailFormProps) {
  const [v, setV] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hp, setHp] = useState("");
  const send = useServerFn(submitLead);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const clean = Object.fromEntries(Object.entries(v).map(([k, val]) => [k, val.trim()]));
      await send({ data: { leadType: leadTypeFromSubject(subject), subject: `${subject} — ${intro}`, fields: clean, sourcePage: window.location.pathname, website: hp } });
      setDone(true); setV({});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally { setLoading(false); }
  };

  const grid = columns === 2 ? "sm:grid-cols-2" : "";
  const span = columns === 2 ? "sm:col-span-2" : "";

  return (
    <form onSubmit={submit} className={`grid gap-5 ${grid} ${className}`} noValidate={false}>
      <input type="text" name="hp_field" tabIndex={-1} autoComplete="off" aria-hidden="true" value={hp} onChange={(e) => setHp(e.target.value)} className="hidden" />
      {fields.map((f) => {
        const common = {
          required: !f.optional,
          value: v[f.k] ?? "",
          placeholder: f.placeholder,
          onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
            setV({ ...v, [f.k]: e.target.value }),
        };
        return (
          <label key={f.k} className={`block text-sm font-semibold ${f.t === "textarea" || f.wide ? span : ""}`}>
            {f.l}{" "}
            {f.optional ? (
              <span className="font-normal text-muted-foreground">(optional)</span>
            ) : (
              <span className="text-primary">*</span>
            )}
            {f.t === "select" ? (
              <select {...common} className={`${inputCls} h-12`}>
                <option value="">Select…</option>
                {f.opts?.map((o) => <option key={o}>{o}</option>)}
              </select>
            ) : f.t === "textarea" ? (
              <textarea {...common} maxLength={1000} rows={f.rows ?? 3} className={`${inputCls} py-3`} />
            ) : (
              <input
                {...common}
                type={f.t}
                maxLength={f.t === "tel" ? 15 : 150}
                pattern={f.t === "tel" ? "[0-9+ ]{10,15}" : undefined}
                min={f.t === "number" ? 1 : undefined}
                className={`${inputCls} h-12`}
              />
            )}
          </label>
        );
      })}
      <div className={span}>
        <Button type="submit" size="lg" className="h-12 w-full" disabled={loading}>
          {loading ? <>Sending… <LoaderCircle className="animate-spin" aria-hidden="true" /></> : <>{submitLabel} <Send aria-hidden="true" /></>}
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">By submitting, you agree that Rishishwar Industry may contact you about this enquiry. We never sell your data. See our <a href="/privacy-policy" className="underline">Privacy Policy</a>.</p>
        {error && <p role="alert" className="mt-3 text-sm text-destructive">{error} You can also email <a className="underline" href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.</p>}
        {done && (
          <p role="status" className="mt-3 flex items-center gap-2 text-sm text-primary">
            <CheckCircle2 className="size-4" /> {successText}
          </p>
        )}
      </div>
    </form>
  );
}
