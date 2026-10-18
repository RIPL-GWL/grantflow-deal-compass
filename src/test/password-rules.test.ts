import { describe, expect, it } from "vitest";
import { validateNewPassword } from "../lib/password-rules";

describe("Secure password setup", () => {
  it("rejects fewer than 12 characters", () => {
    expect(validateNewPassword("short", "short")).toBe("Use at least 12 characters.");
  });
  it("requires matching confirmation", () => {
    expect(validateNewPassword("a-long-secret-value", "different-secret")).toBe("Passwords do not match.");
  });
  it("accepts a matching long password", () => {
    expect(validateNewPassword("a-long-secret-value", "a-long-secret-value")).toBeNull();
  });
});