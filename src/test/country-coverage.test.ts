import { describe, expect, it } from "vitest";
import { countries, stats, solveAnswer, trustPoints } from "@/frontend/features/about/content";
import { countries as marketCountries } from "@/frontend/features/global-presence/content";
import { stats as manufacturerStats } from "@/frontend/features/manufacturers/content";
import { services, stats as serviceStats } from "@/frontend/features/our-services/content";

describe("eight-country coverage", () => {
  it("keeps both complete lists in sync without Netherlands", () => {
    expect(countries).toHaveLength(8);
    expect(countries).not.toContain("Netherlands");
    expect(marketCountries).toHaveLength(8);
    expect(marketCountries.find((country) => country.slug === "netherlands")).toBeUndefined();
  });
  it("uses eight in all shared country statistics", () => {
    expect(stats.find((stat) => stat.label === "Global Presence")?.value).toBe("8 Countries");
    for (const group of [manufacturerStats, serviceStats]) {
      expect(group.find((stat) => stat.label === "Countries")?.value).toBe("8");
    }
  });
  it("does not retain outdated About and Services copy", () => {
    expect(JSON.stringify([solveAnswer, trustPoints, services])).not.toMatch(/9 countries/i);
  });
});
