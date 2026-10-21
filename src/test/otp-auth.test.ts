import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const authPage = readFileSync(resolve(process.cwd(), "src/routes/auth.tsx"), "utf8");
const usersPage = readFileSync(resolve(process.cwd(), "src/routes/_authenticated/admin.users.tsx"), "utf8");
const bootstrap = readFileSync(resolve(process.cwd(), "drizzle/migrations/0001_restore_signup_trigger_and_employees.sql"), "utf8");

describe("Team authentication", () => {
  it("uses password sign-in only, with no email code login", () => {
    expect(authPage).toContain("signInWithPassword");
    expect(authPage).toContain("resetPasswordForEmail");
    expect(authPage).not.toContain("signInWithOtp");
    expect(authPage).not.toContain("verifyOtp");
  });

  it("does not create staff accounts with passwords", () => {
    expect(usersPage).not.toContain("createStaffUser");
    expect(usersPage).not.toContain("password");
  });

  it("runs the signup role setup on every new account", () => {
    expect(bootstrap).toContain("AFTER INSERT ON auth.users");
    expect(bootstrap).toContain("EXECUTE FUNCTION public.handle_new_user()");
  });

});
