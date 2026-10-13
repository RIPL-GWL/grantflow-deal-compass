import { Link } from "@tanstack/react-router";
import { ArrowRight, Sun } from "lucide-react";
import artworkSrcAsset from "@/assets/navratri-dark-vision.webp.asset.json";
const artworkSrc = artworkSrcAsset.url;
const artwork = { url: artworkSrc };
import { isNavratri, setSiteTheme, useSiteTheme } from "../lib/site-theme";
import { Button } from "./ui/button";

export function SeasonalPageBanner({ title }: { title: string }) {
  const theme = useSiteTheme();
  if (!isNavratri(theme)) return null;
  return <section className="seasonal-page-banner">
    <img src={artwork.url} alt="Navratri lamps and decorated business warehouse" width={1536} height={512} />
    <div className="page-shell relative"><p>॥ शुभ नवरात्रि ॥</p><h2>{title}</h2><div className="flex flex-wrap gap-3 mt-5"><Button asChild variant="festival"><Link to="/our-services">Explore Services <ArrowRight /></Link></Button><Button variant="festivalOutline" size="icon" title="Light theme" aria-label="Light theme" onClick={() => setSiteTheme("light")}><Sun /></Button></div></div>
  </section>;
}