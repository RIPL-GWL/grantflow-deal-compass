import { createFileRoute } from "@tanstack/react-router";
import { districtFigure, totalStoreFigure } from "@/frontend/data/retail-network";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Store,
  MonitorPlay,
  Users,
  Truck,
  Globe,
  HandCoins,
  Handshake,
  CheckCircle2,
  MapPin,
  Search,
  ClipboardCheck,
  Rocket,
  LineChart,
  ShieldCheck,
  PackageCheck,
  Boxes,
  FileText,
  Landmark,
  type LucideIcon,
} from "lucide-react";
import { SiteHeader, SiteFooter } from "@/frontend/components/site-chrome";
import { Button } from "@/frontend/components/ui/button";
import servicesHero from "@/frontend/assets/services-hero.jpg";


export type Service = {
  id: string;
  icon: LucideIcon;
  title: string;
  tagline: string;
  text: string;
  points: string[];
};

export const services: Service[] = [
  {
    id: "retail-network",
    icon: Store,
    title: "Retail Network Access",
    tagline: `Direct shelf space in ${totalStoreFigure} retail stores`,
    text: "Getting your product into stores is the hardest step. Through our established retail relationships, your products reach real shelves in real stores — without waiting years to build a network from zero.",
    points: [
      `Access to ${totalStoreFigure} retail stores across ${districtFigure} Indian districts`,
      "Placement across grocery, kirana and modern trade counters",
      "Location and area-based store matching for your products",
      "Ongoing retail relationship management",
    ],
  },
  {
    id: "shop-advertising",
    icon: MonitorPlay,
    title: "Shop Network Advertising",
    tagline: "Reach shoppers at participating stores",
    text: "Show your product close to the point of purchase with shop-level advertising formats tailored to your campaign.",
    points: [
      "Silent 10–20 second video creatives without music or audio",
      "Static illuminated sign-board placements",
      "Locations, creative approval and commercial terms confirmed after enquiry",
    ],
  },
  {
    id: "distributor-dealer",
    icon: Users,
    title: "Distributor & Dealer Appointment",
    tagline: "The right partners in the right markets",
    text: "A wrong distributor can hold a brand back for years. We identify, verify and appoint distributors and dealers who match your product category, target market and growth plans.",
    points: [
      "Market-wise distributor and dealer identification",
      "Background and capability verification before appointment",
      "Territory mapping so partners don't clash over areas",
      "Onboarding support and expectation setting",
    ],
  },
  {
    id: "domestic-expansion",
    icon: Truck,
    title: "Domestic Market Expansion",
    tagline: "From one city to a national footprint",
    text: "We take your brand from local markets to new cities across India with a proven, structured expansion route — so growth happens market by market, not by guesswork.",
    points: [
      "City and state expansion planning for your category",
      "On-ground sales network across key Indian markets",
      "Supply route and stock flow planning",
      "Local demand and competition assessment",
    ],
  },
  {
    id: "import-export",
    icon: Globe,
    title: "Import & Export Support",
    tagline: "Take your brand beyond borders",
    text: "With presence in 8 countries, we help Indian manufacturers reach international buyers and help global brands enter Indian markets — with the paperwork and partners handled properly.",
    points: [
      "Market access across 8 countries including UAE, USA, UK, Australia and Singapore",
      "Buyer and importer introductions in target countries",
      "Export documentation and compliance guidance",
      "Product positioning for international shelves",
    ],
  },
  {
    id: "funding-support",
    icon: HandCoins,
    title: "Business Funding Assistance",
    tagline: "Capacity to produce, capital to grow",
    text: "Growth needs machinery, working capital and expansion money. We help eligible manufacturers and startups explore suitable funding options and prepare for assessment and documentation.",
    points: [
      "Machinery and equipment finance for manufacturers",
      "Working capital support for raw material and inventory",
      "Structured process: assessment, documentation, approval",
      "Manufacturers and startups — subject to funding-partner approval",
    ],
  },
  {
    id: "partnerships",
    icon: Handshake,
    title: "Manufacturer & Retailer Partnerships",
    tagline: "Two sides, one growing network",
    text: "Whether you manufacture products or run a retail store, we build the bridge between you — manufacturers get market reach, retailers get quality products and a steady rent-based partnership.",
    points: [
      "Manufacturer partner registrations with market access",
      "Retail store partner program with approximate rent calculation",
      "Long-term partnership approach, not one-off deals",
      "End-to-end support from registration to first order",
    ],
  },
];

export const howWeWork: { icon: LucideIcon; step: string; title: string; text: string }[] = [
  { icon: FileText, step: "01", title: "Share Your Requirement", text: "Tell us about your products, your markets and where you want to grow." },
  { icon: Search, step: "02", title: "Market & Partner Mapping", text: "We map the right stores, distributors, dealers or buyers for your category." },
  { icon: ClipboardCheck, step: "03", title: "Verification & Structuring", text: "Partners are verified, terms are structured and the route is finalized." },
  { icon: Rocket, step: "04", title: "Launch & Expansion", text: "Your products go on shelves — then we expand city by city, market by market." },
];

export const stats: { icon: LucideIcon; value: string; label: string }[] = [
  { icon: Store, value: totalStoreFigure, label: "Retail Stores" },
  { icon: MapPin, value: districtFigure, label: "Districts in India" },
  { icon: Globe, value: "8", label: "Countries" },
  { icon: PackageCheck, value: "End-to-End", label: "Support" },
];

export const whoWeServe: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Boxes, title: "FMCG Manufacturers", text: "Food, personal care, home care, health & wellness and packaged snacks brands looking for real market reach." },
  { icon: LineChart, title: "Growing Brands", text: "Businesses with production capacity that need distribution, partners and shelf space to scale." },
  { icon: Store, title: "Retail Stores", text: "Retailers who want quality products and a stable, rent-based store partnership." },
  { icon: ShieldCheck, title: "Global Buyers", text: "International importers and buyers looking for reliable Indian manufacturing partners." },
];

