import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { draftFollowupMessage } from "@/lib/programme.functions";

const input = "mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground";

export function AiFollowup({ dealId }: { dealId: string }) {
  const [open, setOpen] = useState(false);
  const [channel, setChannel] = useState<"whatsapp" | "email" | "sms">("whatsapp");
  const [language, setLanguage] = useState<"hinglish" | "english" | "hindi">("hinglish");
  const [context, setContext] = useState("");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  async function generate() {
    setBusy(true);
    try {
      const r = await draftFollowupMessage({ data: { dealId, channel, language, context } });
      if (r.ok) setText(r.text); else toast.error(r.error);
    } catch { toast.error("Message tayyar nahi ho paya."); }
    setBusy(false);
  }

  return (
    <section className="rounded-lg border bg-card p-4">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="mr-auto text-lg font-semibold text-foreground">AI follow-up message</h2>
        <Button variant="outline" onClick={() => setOpen(!open)}>{open ? "Close" : "AI follow-up message"}</Button>
      </div>
      {open && (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="text-xs text-muted-foreground">Channel<select className={input} value={channel} onChange={(e) => setChannel(e.target.value as typeof channel)}><option value="whatsapp">WhatsApp</option><option value="email">Email</option><option value="sms">SMS</option></select></label>
          <label className="text-xs text-muted-foreground">Language<select className={input} value={language} onChange={(e) => setLanguage(e.target.value as typeof language)}><option value="hinglish">Hinglish</option><option value="english">English</option><option value="hindi">Hindi</option></select></label>
          <label className="text-xs text-muted-foreground sm:col-span-2">Extra info (optional)<textarea className={input} rows={2} maxLength={2000} value={context} onChange={(e) => setContext(e.target.value)} /></label>
          <div className="sm:col-span-2"><Button onClick={generate} disabled={busy}>{busy ? "Writing…" : text ? "Write again" : "Write message"}</Button></div>
          {text && (
            <div className="sm:col-span-2">
              <textarea className={input} rows={6} value={text} onChange={(e) => setText(e.target.value)} aria-label="Drafted message" />
              <Button className="mt-2" size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(text); toast.success("Copied"); }}>Copy</Button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
