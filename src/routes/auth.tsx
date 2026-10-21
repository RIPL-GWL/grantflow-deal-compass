import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { validateNewPassword } from "@/lib/password-rules";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/auth")({
  validateSearch: z.object({ next: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Team Sign In — Rishishwar Industry" },
      { name: "description", content: "Sign in to the Rishishwar Industry admin panel and sales CRM." },
      { property: "og:title", content: "Team Sign In — Rishishwar Industry" },
      { property: "og:description", content: "Staff access to enquiries, roles and CRM." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function safeNext(n?: string) {
  return n && n.startsWith("/") && !n.startsWith("//") ? n : "/admin";
}

function AuthPage() {
  const { next } = Route.useSearch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [password, setPassword] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [signUpMode, setSignUpMode] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [signUpSent, setSignUpSent] = useState(false);

  async function signUp(e: React.FormEvent) {
    e.preventDefault();
    const problem = validateNewPassword(password, confirm);
    if (problem) { toast.error(problem); return; }
    setBusy(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth` },
      });
      if (error) throw error;
      setPassword(""); setConfirm("");
      if (data.session) { await navigate({ to: safeNext(next), replace: true }); return; }
      setSignUpSent(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign-up failed.");
    } finally { setBusy(false); }
  }


  async function signInWithPassword(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
      if (error) throw error;
      setPassword("");
      await navigate({ to: safeNext(next), replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign-in failed.");
    } finally { setBusy(false); }
  }

  async function sendPasswordLink() {
    if (!z.string().email().safeParse(email.trim()).success) {
      toast.error("Enter your email first.");
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setResetSent(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send password email.");
    } finally { setBusy(false); }
  }


  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{signUpMode ? "Create team account" : "Team sign in"}</CardTitle>
        </CardHeader>
        <CardContent>
          {signUpMode ? (
            <form onSubmit={signUp} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="signup-email">Email</Label>
                <Input id="signup-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="signup-password">Password (min 12 characters)</Label>
                <Input id="signup-password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="signup-confirm">Confirm password</Label>
                <Input id="signup-confirm" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full" disabled={busy}>{busy ? "Creating account…" : "Create account"}</Button>
              {signUpSent && <p role="status" className="text-sm text-muted-foreground">Account created. Check your email to confirm it. An admin must approve your access before you can use the admin panel.</p>}
            </form>
          ) : (
            <form onSubmit={signInWithPassword} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="password-email">Email</Label>
                <Input id="password-email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</Button>
              <Button type="button" variant="link" className="w-full" disabled={busy} onClick={sendPasswordLink}>Set / reset password by email</Button>
              {resetSent && <p role="status" className="text-sm text-muted-foreground">If this email has an account, a secure password link has been sent. Check your inbox and spam folder.</p>}
            </form>
          )}
          <Button type="button" variant="link" className="mt-2 w-full" disabled={busy} onClick={() => { setSignUpMode(!signUpMode); setPassword(""); setConfirm(""); setSignUpSent(false); setResetSent(false); }}>
            {signUpMode ? "Already have an account? Sign in" : "New team member? Create an account"}
          </Button>
          <p className="mt-4 text-center text-sm text-muted-foreground">Access is available only to approved team accounts.</p>
        </CardContent>
      </Card>
    </div>
  );
}
