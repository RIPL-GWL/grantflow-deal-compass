import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { nextSiteTheme, setSiteTheme, themeLabels, useSiteTheme } from "../lib/site-theme";

export function ThemeCycle() {
  const theme = useSiteTheme();
  const Icon = theme === "dark" ? Moon : Sun;
  return <Button variant="outline" size="icon" className="theme-cycle" aria-label="Change theme" title={`${themeLabels[theme]} → ${themeLabels[nextSiteTheme(theme)]}`} onClick={() => setSiteTheme(nextSiteTheme(theme))}><Icon /></Button>;
}
