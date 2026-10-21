import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { nextSiteTheme, setSiteTheme, siteThemes, themeLabels, useSiteTheme } from "../lib/site-theme";

export function ThemeCycle() {
  const theme = useSiteTheme();
  const Icon = theme === "dark" ? Moon : Sun;
  return <Button variant="outline" size="icon" className="theme-cycle hidden md:inline-flex" aria-label="Change theme" title={`${themeLabels[theme]} → ${themeLabels[nextSiteTheme(theme)]}`} onClick={() => setSiteTheme(nextSiteTheme(theme))}><Icon /></Button>;
}

export function ThemeMenuOptions() {
  const theme = useSiteTheme();
  return (
    <div className="mb-3 grid gap-2 border-b border-border pb-4">
      <span className="px-1 font-display text-xs font-semibold uppercase tracking-wider text-foreground/60">Theme</span>
      <div className="grid grid-cols-2 gap-2">
        {siteThemes.map((t) => (
          <button key={t} type="button" aria-pressed={theme === t} onClick={() => setSiteTheme(t)} className={`rounded-md border px-2 py-2 font-display text-[11px] font-semibold uppercase tracking-wide transition-colors ${theme === t ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground"}`}>{themeLabels[t]}</button>
        ))}
      </div>
    </div>
  );
}
