import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState("otp");
  const [password, setPassword] = useState("");
  const [resetSent, setResetSent] = useState(false);

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

  async function sendCode(e?: React.FormEvent) {
    e?.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return;
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: normalizedEmail,
        options: { shouldCreateUser: true },
      });
      if (error) throw error;
      setEmail(normalizedEmail);
      setCode("");
      setCodeSent(true);
      toast.success("A sign-in code has been sent to your email.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send the email code.");
    } finally {
      setBusy(false);
    }
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: code.trim(),
        type: "email",
      });
      if (error) throw error;
      if (!data.session) throw new Error("The code could not sign you in. Request a new code and try again.");
      navigate({ to: safeNext(next), replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Code verification failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Team sign in</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={mode} onValueChange={(value) => { setMode(value); setCodeSent(false); setPassword(""); setResetSent(false); }} className="mb-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="otp" disabled={busy}>Email code</TabsTrigger>
              <TabsTrigger value="password" disabled={busy}>Password</TabsTrigger>
            </TabsList>
          </Tabs>
          {mode === "password" ? (
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
          ) : !codeSent ? (
            <form onSubmit={sendCode} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full" disabled={busy}>
                {busy ? "Sending code…" : "Send email code"}
              </Button>
            </form>
          ) : (
            <form onSubmit={verifyCode} className="space-y-4">
              <p className="text-sm text-muted-foreground">Enter the one-time code sent to <span className="font-medium text-foreground">{email}</span>.</p>
              <div className="space-y-1">
                <Label htmlFor="email-code">One-time code</Label>
                <Input id="email-code" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{4,8}" minLength={4} maxLength={8} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} required />
              </div>
              <Button type="submit" className="w-full" disabled={busy || code.length < 4}>
                {busy ? "Verifying…" : "Verify and sign in"}
              </Button>
              <div className="flex items-center justify-between text-sm">
                <Button type="button" variant="link" className="px-0" onClick={() => { setCodeSent(false); setCode(""); }}>Change email</Button>
                <Button type="button" variant="link" className="px-0" disabled={busy} onClick={() => void sendCode()}>{busy ? "Sending…" : "Resend code"}</Button>
              </div>
            </form>
          )}
          <p className="mt-4 text-center text-sm text-muted-foreground">Access is available only to approved team accounts.</p>
        </CardContent>
      </Card>
    </div>
  );
}
