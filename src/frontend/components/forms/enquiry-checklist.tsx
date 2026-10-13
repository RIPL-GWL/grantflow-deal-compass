import { useState, type FormEvent } from "react";
import { Check, Clipboard, LoaderCircle, Mail, WandSparkles } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { Textarea } from "@/frontend/components/ui/textarea";
import { openEmail } from "@/frontend/content/company";
import { createEnquiryChecklist } from "@/lib/enquiry-checklist.functions";

export function EnquiryChecklist() {
  const generate = createEnquiryChecklist;
  const [requirements, setRequirements] = useState("");
  const [checklist, setChecklist] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setChecklist("");
    setCopied(false);
    setLoading(true);
    try {
      setChecklist(await generate({ data: { requirements } }));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The checklist could not be prepared. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="border-t border-border bg-secondary/40 py-14 sm:py-20" aria-labelledby="checklist-title">
      <div className="page-shell grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <p className="royal-label">Before You Write</p>
          <h2 id="checklist-title" className="mt-5 max-w-md text-3xl leading-tight sm:text-4xl">Prepare Your Enquiry</h2>
          <p className="mt-4 max-w-md leading-7 text-muted-foreground">Tell us what your business needs. Get a tailored list of details to include when you contact our sales team.</p>
        </div>
        <div className="min-w-0">
          <form onSubmit={submit}>
            <label htmlFor="industrial-needs" className="block text-sm font-semibold">Your industrial requirements</label>
            <Textarea id="industrial-needs" required minLength={15} maxLength={3000} rows={5} value={requirements} onChange={(event) => setRequirements(event.target.value)} placeholder="e.g. We manufacture packaged snacks and want to reach retail stores in three new cities…" className="mt-3 min-h-32 resize-y bg-background p-4 text-base leading-6" />
            <Button type="submit" size="lg" disabled={loading} className="mt-4 w-full sm:w-auto">
              {loading ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <WandSparkles aria-hidden="true" />}
              {loading ? "Preparing…" : "Create enquiry list"}
            </Button>
          </form>
          {error && <p role="alert" className="mt-5 border-l-2 border-destructive pl-4 text-sm text-destructive">{error}</p>}
          {checklist && (
            <div className="mt-8 border-t border-border pt-6" aria-live="polite">
              <h3 className="text-xl">Your enquiry list</h3>
              <p className="mt-4 whitespace-pre-wrap break-words leading-7 text-foreground">{checklist}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button type="button" variant="outline" onClick={async () => { await navigator.clipboard.writeText(checklist); setCopied(true); }}><span aria-hidden="true">{copied ? <Check /> : <Clipboard />}</span>{copied ? "Copied" : "Copy list"}</Button>
                <Button type="button" onClick={() => openEmail(`Hello Rishishwar Industry,\n\n${requirements}\n\n${checklist}`, "Industrial Enquiry")}><Mail aria-hidden="true" />Email sales</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}