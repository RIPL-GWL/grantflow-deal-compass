import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Globe2, Mail, Menu, X } from "lucide-react";
import headerLogoSrcAsset from "@/assets/header-wordmark.webp.asset.json";
const headerLogoSrc = headerLogoSrcAsset.url;
const headerLogo = { url: headerLogoSrc };
import headerDarkLogoSrcAsset from "@/assets/header-wordmark-dark.webp.asset.json";
const headerDarkLogoSrc = headerDarkLogoSrcAsset.url;
const headerDarkLogo = { url: headerDarkLogoSrc };
import footerLogoSrcAsset from "@/assets/footer-logo.webp.asset.json";
const footerLogoSrc = footerLogoSrcAsset.url;
const footerLogo = { url: footerLogoSrc };
import { isNavratri, useSiteTheme } from "@/frontend/lib/site-theme";
import { Button } from "@/frontend/components/ui/button";
import { COMPANY } from "@/frontend/content/company";
import { countries } from "@/frontend/features/global-presence/content";
import { ThemeCycle, ThemeMenuOptions } from "./theme-controls";

export const navLinks = [
  { to: "/", label: "Home" },
  { to: "/our-services", label: "Our Services" },
  { to: "/business-valuation-calculator", label: "Business Valuation Calculator" },
  { to: "/global-presence", label: "Global Presence" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact Us" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const theme = useSiteTheme();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  return (
    <header className={`site-header sticky top-0 z-50 border-b border-border backdrop-blur-xl ${isNavratri(theme) ? "site-header-seasonal" : ""}`}>
      <div className="page-shell grid h-[72px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-between sm:gap-6">
        <Link to="/" aria-label="Rishishwar Industry home" className="min-w-0 sm:shrink-0" onClick={() => setOpen(false)}>
          <img src={theme === "light" || theme === "navratri" ? headerLogo.url : headerDarkLogo.url} alt="Rishishwar Industry" width={789} height={214} decoding="async" className="header-logo" />
        </Link>
        <nav aria-label="Primary navigation" className="hidden items-center gap-4 2xl:flex">
          {navLinks.map((link) => {
            const active = link.to === "/" ? pathname === "/" : pathname.startsWith(link.to);
            
            return <Link key={link.to} to={link.to} aria-current={active ? "page" : undefined} className={`border-b py-2 font-display text-[11px] font-semibold uppercase tracking-wider transition-colors ${active ? "border-primary text-primary" : "border-transparent text-ink-foreground/70 hover:text-primary"}`}>{link.label}</Link>;
          })}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <ThemeCycle />
          <Button asChild size="sm" className="px-2 text-[9px] sm:px-3 sm:text-xs"><Link to="/funding-programme" onClick={() => setOpen(false)}>Funding Programme</Link></Button>
          <Button asChild size="sm" variant="outline" className="hidden lg:inline-flex"><Link to="/partner-with-us">Partner With Us</Link></Button>
          <Button variant="outline" size="icon" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((value) => !value)} className="border-ink-foreground/25 text-ink-foreground 2xl:hidden">
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {open && (
        <nav aria-label="Mobile navigation" className="max-h-[calc(100svh-72px)] overflow-y-auto border-t border-border bg-background px-4 py-5 shadow-2xl 2xl:hidden">
          <div className="mx-auto grid max-w-7xl gap-1">
            <ThemeMenuOptions />
            <Button asChild className="mb-2 lg:hidden"><Link to="/partner-with-us" onClick={() => setOpen(false)}>Partner With Us</Link></Button>
            {navLinks.map((link) => <Link key={link.to} to={link.to} onClick={() => setOpen(false)} className={`border-l px-4 py-3 font-display text-sm font-medium uppercase tracking-wider ${pathname === link.to ? "border-primary bg-primary/10 text-primary" : "border-transparent text-foreground/75"}`}>{link.label}</Link>)}
          </div>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer border-t border-border bg-ink text-ink-foreground">
      <div className="footer-layout page-shell grid grid-cols-2 gap-x-4 gap-y-6 py-7 sm:gap-x-6 sm:gap-y-10 sm:py-16 lg:grid-cols-3 xl:grid-cols-6">
        <div className="footer-brand col-span-2 lg:col-span-1">
          <img src={footerLogo.url} alt="RiPL — Rishishwar Industry Private Limited" width={866} height={288} decoding="async" loading="lazy" className="footer-logo" />

          <p className="footer-description mt-3 max-w-sm text-sm leading-6 text-ink-foreground/75 sm:mt-5 sm:leading-7">FMCG manufacturers ko retail networks, reliable partners aur global markets se jodne wala business growth platform.</p>
          <p className="footer-reach mt-3 flex items-center gap-2 font-display text-[10px] font-semibold uppercase tracking-widest text-primary sm:mt-6"><Globe2 className="size-4" /> Domestic · International</p>
        </div>
        <div className="footer-company col-span-2 lg:col-span-1">
          <nav aria-label="Company links">

            <h3 className="text-sm uppercase tracking-wider text-accent-foreground">Company</h3>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-ink-foreground/75 sm:mt-5 sm:gap-y-3 md:block md:space-y-3">
              {navLinks.filter((link) => link.to !== "/business-valuation-calculator").map((link) => <li key={link.to}><Link to={link.to} className="transition-colors hover:text-primary">{link.label}</Link></li>)}
              <li><Link to="/faq" className="transition-colors hover:text-primary">FAQ</Link></li>
              <li><Link to="/payment" className="transition-colors hover:text-primary">Payment Details</Link></li>
              <li><Link to="/auth" className="inline-flex items-center rounded-md border border-primary px-3 py-1 font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground">Login</Link></li>
            </ul>
          </nav>
        </div>
        <nav aria-label="Partnership links" className="footer-partnerships col-span-2 lg:col-span-1">
          <h3 className="text-sm uppercase tracking-wider text-accent-foreground">Partnerships</h3>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-ink-foreground/75 sm:mt-5 sm:gap-y-3">

            <li><Link to="/manufacturers" className="hover:text-primary">For Manufacturers</Link></li>
            <li><Link to="/partner-with-us" className="hover:text-primary">Partner With Us</Link></li>
            <li><Link to="/fund-your-business" className="hover:text-primary">Fund Your Business</Link></li>
            <li><Link to="/retailer-partner" className="hover:text-primary">Retail Partner</Link></li>
            <li><Link to="/register-your-store" className="hover:text-primary">Register Your Store</Link></li>
            <li><Link to="/store-list" search={{ state: "", area: "", district: "" }} className="hover:text-primary">Retail Network List</Link></li>
            <li><Link to="/advertise-your-product" className="hover:text-primary">Advertise Your Product</Link></li>
          </ul>
        </nav>
        <nav aria-label="Our Family links" className="footer-family col-span-2 lg:col-span-1 sm:col-span-1">
          <h3 className="text-sm uppercase tracking-wider text-accent-foreground">Our Family</h3>
          <ul className="mt-3 grid grid-cols-1 gap-y-2 text-sm text-ink-foreground/75 sm:mt-5 sm:gap-y-3">
            <li><Link to="/our-investors" className="hover:text-primary">Our Investors</Link></li>
            <li><Link to="/our-mentors" className="hover:text-primary">Our Mentors</Link></li>
            <li><Link to="/our-team" className="hover:text-primary">Our Team</Link></li>
          </ul>
        </nav>
        <nav aria-label="Startups and Investments links" className="footer-startups col-span-1">
          <h3 className="text-sm uppercase tracking-wider text-accent-foreground">Startups and Investments</h3>
          <ul className="mt-3 grid gap-3 text-sm text-ink-foreground/75 sm:mt-5">
            <li><Link to="/funding-programme" className="hover:text-primary">Funding Programme</Link></li>
            <li><Link to="/fund-your-startup" className="hover:text-primary">Fund Your Startup</Link></li>
            <li><Link to="/startup-with-ripl" className="hover:text-primary">Startup with RIPL</Link></li>
            <li><Link to="/business-valuation-calculator" className="hover:text-primary">Business Valuation Calculator</Link></li>
            <li><Link to="/scale-your-startup" className="hover:text-primary">Scale Your Startup</Link></li>
          </ul>
        </nav>
        <div className="footer-contact-markets col-span-2 flex flex-col gap-6 sm:gap-10 lg:col-span-1">
          <div className="footer-contact">
            <h3 className="text-sm uppercase tracking-wider text-accent-foreground">Contact</h3>
            <ul className="mt-3 space-y-3 text-sm text-ink-foreground/75 sm:mt-5 sm:space-y-4">
              <li><a href={`mailto:${COMPANY.email}`} className="flex items-start gap-3 break-all hover:text-primary"><Mail className="mt-0.5 size-4 shrink-0 text-primary" />{COMPANY.email}</a></li>
            </ul>
          </div>
          <nav aria-label="Global market links" className="footer-markets">
            <h3 className="text-sm uppercase tracking-wider text-accent-foreground">Global Markets</h3>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-ink-foreground/75 sm:mt-5 sm:gap-y-3">
              {countries.map((country) => <li key={country.slug}><Link to="/global-presence/$market" params={{ market: country.slug }} className="transition-colors hover:text-primary">{country.name}</Link></li>)}
            </ul>
          </nav>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="page-shell flex flex-col gap-2 py-5 text-xs text-ink-foreground/65 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Rishishwar Industry. All rights reserved.</p>
          <nav aria-label="Legal links" className="flex flex-wrap gap-x-5 gap-y-2">
            <Link to="/privacy-policy" className="hover:text-primary">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary">Terms &amp; Conditions</Link>
            <Link to="/disclaimer" className="hover:text-primary">Disclaimer</Link>
            <Link to="/sitemap" className="hover:text-primary">Sitemap</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}