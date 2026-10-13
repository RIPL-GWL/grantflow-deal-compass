import { describe, expect, it } from "vitest";
import { programmeRules, registrationTotal } from "@/frontend/features/funding-programme/rules";

describe("Funding programme terms", () => {
  it("charges 2999 plus 18 percent GST for two people", () => {
    expect(programmeRules.registrationFee).toBe(2999);
    expect(programmeRules.includedParticipants).toBe(2);
    expect(programmeRules.gstPercent).toBe(18);
    expect(registrationTotal(2)).toBe(3538.82);
  });
  it("charges 2000 plus GST for each extra person", () => {
    expect(programmeRules.additionalParticipantFee).toBe(2000);
    expect(registrationTotal(3)).toBe(5898.82);
    expect(registrationTotal(4)).toBe(8258.82);
  });
  it("offers ten and five lakh awards without guaranteeing funding", () => {
    expect(programmeRules.firstAward).toBe(1000000);
    expect(programmeRules.secondAward).toBe(500000);
    expect(programmeRules.fundingGuaranteed).toBe(false);
  });
  it("scans startups within fifteen days", () => {
    expect(programmeRules.scanningDays).toBe(15);
  });
  it("holds the summit from 29 through 31 December 2026", () => {
    expect(programmeRules.eventStart).toBe("2026-12-29");
    expect(programmeRules.eventEnd).toBe("2026-12-31");
  });
});