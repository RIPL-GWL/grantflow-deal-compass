import { describe, expect, it } from "vitest";
import { isNavratri, nextSiteTheme, resolveTheme, siteThemes } from "@/frontend/lib/site-theme";
import { publicPages } from "@/frontend/content/site-pages";
import { HIDDEN_PAGES_LIVE, lockHiddenPage } from "@/frontend/lib/hidden-pages";

describe("imported site navigation and themes", () => {
  it("offers only three themes while recovering removed saved selections", () => {
    expect(siteThemes).toEqual(["navratri", "dark", "light"]);
    expect(resolveTheme("navratri-dark")).toBe("dark");
    expect(resolveTheme("bome")).toBe("dark");
    expect(resolveTheme("moonlight")).toBe("dark");
    expect(nextSiteTheme("navratri")).toBe("dark");
    expect(nextSiteTheme("dark")).toBe("light");
    expect(nextSiteTheme("light")).toBe("navratri");
    expect(isNavratri("dark")).toBe(false);
  });
  it("lists all new family and startup pages but not Products", () => {
    const paths = publicPages.map(page => page.path);
    expect(paths).not.toContain("/products");
    for (const path of ["/our-investors", "/our-mentors", "/our-team"]) expect(paths).toContain(path);
    for (const path of ["/fund-your-startup", "/startup-with-ripl", "/scale-your-startup"]) expect(paths).toContain(path);
  });
  it("keeps all existing family pages publicly unlocked", () => {
    expect(HIDDEN_PAGES_LIVE).toBe(true);
    expect(() => lockHiddenPage()).not.toThrow();
  });
  it("uses the agreed page titles", () => {
    const labels = Object.fromEntries(publicPages.map(page => [page.path, page.label]));
    expect(labels["/fund-your-startup"]).toBe("Fund Your Startup");
    expect(labels["/startup-with-ripl"]).toBe("Startup with RIPL");
    expect(labels["/business-valuation-calculator"]).toBe("Business Valuation Calculator");
    expect(labels["/scale-your-startup"]).toBe("Scale Your Startup");
  });
});