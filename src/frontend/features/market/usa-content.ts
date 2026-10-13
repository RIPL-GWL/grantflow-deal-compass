import {
  BarChart3,
  ClipboardCheck,
  FileCheck2,
  Handshake,
  HeartHandshake,
  Network,
  Search,
  ShoppingCart,
  Store,
  TrendingUp,
} from "lucide-react";

import babyCareAssetSrc from "@/frontend/assets/usa-market/baby-care-optimized.webp";
const babyCareAsset = { url: babyCareAssetSrc };
import foodBeverageAssetSrc from "@/frontend/assets/usa-market/food-beverage-optimized.webp";
const foodBeverageAsset = { url: foodBeverageAssetSrc };
import homeCareAssetSrc from "@/frontend/assets/usa-market/home-care-optimized.webp";
const homeCareAsset = { url: homeCareAssetSrc };
import oralCareAssetSrc from "@/frontend/assets/usa-market/oral-care-optimized.webp";
const oralCareAsset = { url: oralCareAssetSrc };
import personalCareAssetSrc from "@/frontend/assets/usa-market/personal-care-optimized.webp";
const personalCareAsset = { url: personalCareAssetSrc };
import heroAssetSrc from "@/frontend/assets/usa-market/usa-india-trade-hero-optimized.webp";
const heroAsset = { url: heroAssetSrc };

export const usaHeroImage = heroAsset.url;

export const usaSupportHighlights = [
  { icon: BarChart3, title: "Market-entry strategy", note: "Category, demand and channel assessment" },
  { icon: FileCheck2, title: "Import preparation", note: "Documentation and compliance coordination" },
  { icon: Network, title: "Retail connections", note: "Distributor and channel introductions" },
];

export const usaOpportunityPoints = [
  { icon: ShoppingCart, title: "Large consumer market", note: "Reach a broad, diverse base of Indian consumers." },
  { icon: TrendingUp, title: "Evolving categories", note: "Explore premium, specialist and everyday FMCG demand." },
  { icon: Store, title: "Multiple sales channels", note: "Plan for retail, distribution and e-commerce routes." },
  { icon: HeartHandshake, title: "Local-market support", note: "Build with partners who understand Indian channels." },
];

export const usaCategories = [
  {
    title: "Personal care",
    note: "Skin care, hair care, bath and body products",
    image: personalCareAsset.url,
    alt: "Personal care bottles and skin care products",
  },
  {
    title: "Home care",
    note: "Surface cleaners, dishwash, laundry and air care",
    image: homeCareAsset.url,
    alt: "Household cleaning products in a modern kitchen",
  },
  {
    title: "Packaged food & beverages",
    note: "Snacks, drinks, condiments and pantry products",
    image: foodBeverageAsset.url,
    alt: "Packaged foods, beverages and pantry products",
  },
  {
    title: "Oral care",
    note: "Toothpaste, mouthwash and dental care products",
    image: oralCareAsset.url,
    alt: "Toothbrushes, toothpaste and mouthwash",
  },
  {
    title: "Baby care",
    note: "Baby hygiene, skin care and related products",
    image: babyCareAsset.url,
    alt: "Baby care products arranged in a nursery",
  },
];

export const usaProcess = [
  {
    icon: Search,
    number: "01",
    title: "Market research",
    note: "We review the product, target customer, category and competitive context.",
  },
  {
    icon: ClipboardCheck,
    number: "02",
    title: "Import preparation",
    note: "We help organise the documentation and specialist compliance work needed for market entry.",
  },
  {
    icon: Network,
    number: "03",
    title: "Distributor & retail access",
    note: "We identify suitable routes to distributors, retailers and relevant sales channels.",
  },
  {
    icon: TrendingUp,
    number: "04",
    title: "Launch support",
    note: "We coordinate positioning, introductions and the next practical steps for growth.",
  },
];

export const usaSources = [
  {
    label: "U.S. FDA — Food Export Library",
    year: "Updated 2026",
    url: "https://www.fda.gov/food/exporting-food-products-united-states/food-export-library",
  },
  {
    label: "USDA FAS — India Exporter Guide",
    year: "2024",
    url: "https://apps.fas.usda.gov/newgainapi/api/Report/DownloadReportByFileName?fileName=Exporter+Guide+Annual_New+Delhi_India_IN2024-0027.pdf",
  },
];