import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { validateNewPassword } from "@/lib/password-rules";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [
    { title: "Set Password — Rishishwar Industry" },
    { name: "description", content: "Securely set your Rishishwar Industry team account password." },
    { property: "og:title", content: "Set Password — Rishishwar Industry" },
    { property: "og:description", content: "Secure password recovery for Rishishwar Industry team accounts." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const [ready, setReady] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const isRecovery = hash.get("type") === "recovery";
    let active = true;
    void supabase.auth.getUser().then(({ data, error: authError }) => {
      if (!active) return;
      setReady(isRecovery && !!data.user && !authError);
      setChecking(false);
      // Remove recovery tokens from the address bar after the client consumes them.
      if (isRecovery) window.history.replaceState(null, "", window.location.pathname);
    });
    return () => { active = false; };
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const validation = validateNewPassword(password, confirmation);
    if (validation) { setError(validation); return; }
    if (!ready) return;
    setBusy(true);
    setError("");
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setPassword(""); setConfirmation(""); setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update password.");
    } finally { setBusy(false); }
  }

  return <div className="flex min-h-screen items-center justify-center bg-background px-4">
    <Card className="w-full max-w-sm">
      <CardHeader><CardTitle>Set password</CardTitle></CardHeader>
      <CardContent>
        {checking ? <p role="status">Checking secure link…</p> : done ? <div className="space-y-4"><p role="status">Password saved.</p><Button asChild className="w-full"><Link to="/auth">Back to sign in</Link></Button></div> : !ready ? <div className="space-y-4"><p>This password link is missing or expired. Request a new link from the sign-in page.</p><Button asChild className="w-full"><Link to="/auth">Back to sign in</Link></Button></div> : <form onSubmit={save} className="space-y-4">
          <div className="space-y-1"><Label htmlFor="new-password">New password</Label><Input id="new-password" type="password" autoComplete="new-password" minLength={12} value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
          <div className="space-y-1"><Label htmlFor="confirm-password">Confirm password</Label><Input id="confirm-password" type="password" autoComplete="new-password" minLength={12} value={confirmation} onChange={(e) => setConfirmation(e.target.value)} required /></div>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={busy}>{busy ? "Saving…" : "Save password"}</Button>
        </form>}
      </CardContent>
    </Card>
  </div>;
}