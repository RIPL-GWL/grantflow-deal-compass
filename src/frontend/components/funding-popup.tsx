import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { ArrowRight, X } from "lucide-react";
import { Dialog, DialogClose, DialogDescription, DialogOverlay, DialogPortal, DialogTitle } from "./ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button } from "./ui/button";
import poster from "@/assets/funding-popup.webp.asset.json";
import "./funding-popup.css";

const fundingPaths = new Set([
  "/",
  "/fund-your-business", "/fund-your-startup", "/funding-programme",
  "/startup-with-ripl", "/scale-your-startup", "/our-services/funding-support",
]);

export function FundingPopup() {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
    if (!fundingPaths.has((pathname.replace(/\/$/, "") || "/")) || hash === "register") return;
    const timer = window.setTimeout(() => setOpen(true), 700);
    return () => window.clearTimeout(timer);
  }, [pathname, hash]);

  async function register() {
    setOpen(false);
    await navigate({ to: "/funding-programme", hash: "register" });
    window.requestAnimationFrame(() => {
      document.getElementById("register")?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
        block: "start",
      });
    });
  }

  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogPortal>
      <DialogOverlay className="funding-popup-overlay" />
      <DialogPrimitive.Content className="funding-popup" onCloseAutoFocus={(event) => event.preventDefault()}>
        <DialogTitle className="sr-only">RIPL Startup Funding Programme — Registrations Open</DialogTitle>
        <DialogDescription className="sr-only">29–31 December 2026, Gwalior. Top two startups can receive grants up to ₹10 lakhs and ₹5 lakhs, subject to evaluation, eligibility and terms.</DialogDescription>
        <div className="funding-popup-poster">
          <img src={poster.url} alt="RIPL Startup Funding Programme: Pitch. Connect. Raise. Grow. Gwalior summit, 29–31 December 2026. Grants for the top two startups, subject to selection and terms." width={789} height={680} />
          <Button variant="ghost" className="funding-popup-registration" onClick={register} aria-label="Register Your Startup Now"><span className="sr-only">Register Your Startup Now</span></Button>
        </div>
        <Button className="funding-popup-mobile-register" onClick={register}>Register Your Startup Now <ArrowRight /></Button>
        <DialogClose asChild><Button variant="ghost" size="icon" className="funding-popup-close" aria-label="Close funding popup"><X /></Button></DialogClose>
      </DialogPrimitive.Content>
    </DialogPortal>
  </Dialog>;
}