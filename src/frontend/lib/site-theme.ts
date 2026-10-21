import { useEffect, useState } from "react";

export const siteThemes = ["navratri", "dark", "light", "sharad"] as const;
export type SiteTheme = typeof siteThemes[number];
export const themeLabels: Record<SiteTheme, string> = { navratri: "Navratri Light", dark: "Dark", light: "Light", sharad: "Sharad Purnima" };
export function resolveTheme(value: string | null): SiteTheme {
  if (value === "navratri-dark" || value === "bome" || value === "moonlight") return "dark";
  return siteThemes.find((theme) => theme === value) ?? "navratri";
}
export function isNavratri(theme: SiteTheme) { return theme === "navratri"; }
export function nextSiteTheme(theme: SiteTheme): SiteTheme {
  return siteThemes[(siteThemes.indexOf(theme) + 1) % siteThemes.length] ?? "navratri";
}
export function setSiteTheme(theme: SiteTheme) {
  document.documentElement.classList.remove(...siteThemes, "navratri-dark", "bome", "moonlight");
  document.documentElement.classList.add(theme);
  sessionStorage.setItem("rishishwar-theme", theme);
  window.dispatchEvent(new CustomEvent("site-theme", { detail: theme }));
}
export function useSiteTheme() {
  const [theme, setTheme] = useState<SiteTheme>("navratri");
  useEffect(() => {
    const saved = resolveTheme(sessionStorage.getItem("rishishwar-theme"));
    setSiteTheme(saved);
    setTheme(saved);
    const update = (event: Event) => setTheme(resolveTheme((event as CustomEvent<string>).detail));
    window.addEventListener("site-theme", update);
    return () => window.removeEventListener("site-theme", update);
  }, []);
  return theme;
}