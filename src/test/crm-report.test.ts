import { describe, expect, it } from "vitest";
import { conversionSummary, stageFunnel } from "@/lib/crm-report";

const deals = [
  { stage: "new", value: 100 }, { stage: "proposal", value: 200 },
  { stage: "won", value: 1000 }, { stage: "won", value: "500" }, { stage: "lost", value: 300 },
];

describe("CRM report", () => {
  it("conversion rate is won over won+lost", () => expect(conversionSummary(deals).conversionRate).toBe(67));
  it("won amount sums only won deals", () => expect(conversionSummary(deals).wonAmount).toBe(1500));
  it("no closed deals gives 0% conversion", () => expect(conversionSummary([{ stage: "new", value: 1 }]).conversionRate).toBe(0));
  it("funnel counts deals at or past each stage", () => {
    const f = stageFunnel(deals);
    expect(f.find((s) => s.stage === "qualified")?.reached).toBe(3);
    expect(f.find((s) => s.stage === "won")?.value).toBe(1500);
  });
});
