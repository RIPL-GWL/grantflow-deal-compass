import { useState, type FormEvent } from "react";
import { ArrowRight, Bot, LoaderCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/frontend/components/ui/button";
import { Textarea } from "@/frontend/components/ui/textarea";
import { getServiceRecommendation } from "@/lib/service-guide.functions";

export function ServiceGuide() {
  const recommend = getServiceRecommendation;
  const [idea, setIdea] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setError(""); setAnswer(""); setLoading(true);
    try { setAnswer(await recommend({ data: { idea } })); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "The service guide could not respond."); }
    finally { setLoading(false); }
  };
  return <section className="cinematic-section bg-secondary" aria-labelledby="service-guide-title"><div className="page-shell grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16"><div><p className="royal-label">Business Guide</p><h2 id="service-guide-title" className="mt-5 max-w-lg text-3xl leading-tight sm:text-5xl">Which service fits your next move?</h2><p className="mt-4 max-w-md leading-7 text-muted-foreground">Share your business idea or challenge. The guide will point you to the most relevant Rishishwar Industry service.</p></div><div className="min-w-0"><form onSubmit={submit}><label htmlFor="business-idea" className="block text-sm font-semibold">Your business idea or support need</label><Textarea id="business-idea" required minLength={15} maxLength={3000} rows={5} value={idea} onChange={(event) => setIdea(event.target.value)} placeholder="e.g. I manufacture packaged foods and want to enter retail markets in North India…" className="mt-3 min-h-32 resize-y bg-background p-4 text-base leading-6"/><Button type="submit" size="lg" disabled={loading} className="mt-4 w-full sm:w-auto">{loading ? <LoaderCircle className="animate-spin"/> : <Bot/>}{loading ? "Finding the right service…" : "Recommend a service"}</Button></form>{error && <p role="alert" className="mt-5 border-l-2 border-destructive pl-4 text-sm text-destructive">{error}</p>}{answer && <div className="mt-8 border-t border-border pt-6" aria-live="polite"><h3 className="text-xl">Your recommended route</h3><p className="mt-4 whitespace-pre-wrap break-words leading-7">{answer}</p><Button asChild className="mt-6"><Link to="/contact">Discuss this route <ArrowRight/></Link></Button></div>}</div></div></section>;
}
