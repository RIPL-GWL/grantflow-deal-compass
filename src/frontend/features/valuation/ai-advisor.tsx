import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, MessageSquareText } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { getValuationAdvice } from "@/lib/valuation-advisor.functions";

function inline(t: string) {
  return t.split(/(\*\*[^*]+\*\*)/g).map((p, i) => (p.startsWith("**") ? <strong key={i}>{p.slice(2, -2)}</strong> : p));
}

function Rendered({ text }: { text: string }) {
  return (
    <div className="space-y-2 text-sm leading-relaxed">
      {text.split("\n").filter((l) => l.trim()).map((l, i) => {
        if (/^#{1,4}\s/.test(l)) return <h4 key={i} className="pt-2 text-base font-bold text-primary">{l.replace(/^#+\s/, "")}</h4>;
        if (/^\s*([-*]|\d+\.)\s/.test(l)) return <p key={i} className="flex gap-2 pl-1"><span className="text-primary">•</span><span>{inline(l.replace(/^\s*([-*]|\d+\.)\s/, ""))}</span></p>;
        return <p key={i}>{inline(l)}</p>;
      })}
    </div>
  );
}

export function AiAdvisor({ summary }: { summary: string }) {
  const ask = useServerFn(getValuationAdvice);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState("");

  const run = async () => {
    setLoading(true); setError(""); setText("");
    try {
      const r = await ask({ data: { summary: `${summary}\n\nOwner ke extra notes / sawal: ${notes || "—"}` } });
      if (r.ok) setText(r.text); else setError(r.error);
    } catch { setError("AI salah abhi nahi mil payi. Kripya baad mein try karein."); }
    finally { setLoading(false); }
  };

  return (
    <div className="rounded-md border border-primary/40 bg-card p-5 sm:p-6 print:border-border">
      <h3 className="flex items-center gap-2 text-lg"><MessageSquareText className="size-5 text-primary" /> AI Valuation Advisor</h3>
      <p className="mt-1 text-sm text-muted-foreground">AI aapki valuation range samjhayega aur use badhane ke personalised sujhav dega.</p>
      <textarea rows={2} maxLength={600} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional: koi khaas sawal ya plan (e.g. 2 saal mein 5 naye states)" className="mt-3 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm print:hidden" />
      <Button className="mt-3 w-full print:hidden" onClick={run} disabled={loading}>
        {loading ? <><Loader2 className="animate-spin" /> Analysis ho raha hai…</> : text ? "Dobara Salah Lein" : "AI se Salah Lein"}
      </Button>
      {error && <p className="mt-3 text-sm font-medium text-destructive">{error}</p>}
      {text && <div className="mt-4 border-t border-border pt-3"><Rendered text={text} /><p className="mt-3 text-xs text-muted-foreground">AI-generated salah — indicative hai, professional advice ka vikalp nahi.</p></div>}
    </div>
  );
}
