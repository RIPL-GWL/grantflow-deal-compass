import { districtFigure, totalStoreFigure } from "@/frontend/data/retail-network";
import {
  ArrowRight,
  Box,
  Handshake,
  Truck,
  ClipboardList,
  BarChart3,
  Headset,
  Globe,
  Users,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import heroGlobe from "@/frontend/assets/gp-india-globe.webp";
import shipImg from "@/frontend/assets/gp-ship.webp";
import imgIndia from "@/frontend/assets/gp-india-gate.webp";
import imgAustralia from "@/frontend/assets/gp-australia.webp";
import imgUsa from "@/frontend/assets/gp-usa.webp";
import imgCanada from "@/frontend/assets/gp-canada.webp";
import imgUae from "@/frontend/assets/gp-uae.webp";
import imgSingapore from "@/frontend/assets/gp-singapore.webp";
import imgUk from "@/frontend/assets/gp-uk.webp";
import imgEurope from "@/frontend/assets/gp-europe.webp";
import worldMap from "@/frontend/assets/gp-world-map.webp";


export const heroStats = [
  { icon: Globe, value: "8", label: "Countries" },
  { icon: Users, value: totalStoreFigure, label: "Retail Stores" },
  { icon: MapPin, value: districtFigure, label: "Districts in India" },
  { icon: BarChart3, value: "Growing", label: "Global Network" },
];

export const countries = [
  { name: "India", slug: "india", flag: "🇮🇳", img: imgIndia, note: `${totalStoreFigure} retail stores across ${districtFigure} districts` },
  { name: "Australia", slug: "australia", flag: "🇦🇺", img: imgAustralia, note: "Growing FMCG market opportunities" },
  { name: "USA", slug: "usa", flag: "🇺🇸", img: imgUsa, note: "Expanding Indian brands in key cities" },
  { name: "Canada", slug: "canada", flag: "🇨🇦", img: imgCanada, note: "Building retail and distribution networks" },
  { name: "UAE", slug: "uae", flag: "🇦🇪", img: imgUae, note: "Supporting market entry and distribution" },
  { name: "Singapore", slug: "singapore", flag: "🇸🇬", img: imgSingapore, note: "Partnerships with leading distributors" },
  { name: "UK", slug: "uk", flag: "🇬🇧", img: imgUk, note: "Connecting with retail and e-commerce" },
  { name: "Europe (Region)", slug: "europe", flag: "🇪🇺", img: imgEurope, note: "Exploring new markets across the European region" },
];

export const support = [
  { icon: Box, title: "Market Research", note: "Insights on market demand and trends" },
  { icon: Handshake, title: "Local Partnerships", note: "Connect with trusted distributors and dealers" },
  { icon: Truck, title: "Logistics Support", note: "End-to-end shipping and delivery solutions" },
  { icon: ClipboardList, title: "Regulatory Guidance", note: "Support for compliance and documentation" },
  { icon: BarChart3, title: "Sales & Marketing", note: "Brand positioning and retail network setup" },
  { icon: Headset, title: "Ongoing Support", note: "Continuous assistance for long-term growth" },
];

export const trustPoints = [
  { icon: ShieldCheck, label: "Trusted Network" },
  { icon: Users, label: "Local Expertise" },
  { icon: Globe, label: "Reliable Logistics" },
  { icon: BarChart3, label: "Long-Term Growth" },
];

