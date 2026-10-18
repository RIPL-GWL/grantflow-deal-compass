import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const authPage = readFileSync(resolve(process.cwd(), "src/routes/auth.tsx"), "utf8");
const usersPage = readFileSync(resolve(process.cwd(), "src/routes/_authenticated/admin.users.tsx"), "utf8");
const bootstrap = readFileSync(resolve(process.cwd(), "drizzle/migrations/0007_verified_otp_admin_bootstrap.sql"), "utf8");

describe("Team authentication", () => {
  it("keeps email OTP alongside password sign-in", () => {
    expect(authPage).toContain("signInWithOtp");
    expect(authPage).toContain('type: "email"');
    expect(authPage).toContain("verifyOtp");
    expect(authPage).toContain("signInWithPassword");
    expect(authPage).toContain("resetPasswordForEmail");
  });

  it("does not create staff accounts with passwords", () => {
    expect(usersPage).not.toContain("createStaffUser");
    expect(usersPage).not.toContain("password");
  });

  it("grants Super Admin only after the named owner's email verification", () => {
    expect(bootstrap).toContain("NEW.email_confirmed_at IS NOT NULL");
    expect(bootstrap).toContain("lower(btrim(NEW.email)) = 'harsh@rishishwarindustry.in'");
    expect(bootstrap).toContain("INSERT INTO public.user_roles (user_id, role)");
    expect(bootstrap).toContain("'super_admin'");
  });
});
