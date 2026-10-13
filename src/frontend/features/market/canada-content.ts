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

import heroImage from "@/frontend/assets/canada-market/canada-india-trade-hero.jpg";
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

export const canadaHeroImage = heroImage;

export const canadaSupportHighlights = [
  { icon: BarChart3, title: "Market-entry strategy", note: "Category, demand and channel assessment" },
  { icon: FileCheck2, title: "Import preparation", note: "Documentation and compliance coordination" },
  { icon: Network, title: "Retail connections", note: "Distributor and channel introductions" },
];

export const canadaOpportunityPoints = [
  { icon: ShoppingCart, title: "Large consumer market", note: "Reach a broad, diverse base of Indian consumers." },
  { icon: TrendingUp, title: "Growing trade ties", note: "Canada–India CEPA negotiations relaunched in November 2025." },
  { icon: Store, title: "Multiple sales channels", note: "Plan for retail, distribution and e-commerce routes." },
  { icon: HeartHandshake, title: "Local-market support", note: "Build with partners who understand Indian channels." },
];

export const canadaCategories = [
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

export const canadaProcess = [
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

export const canadaSources = [
  {
    label: "Global Affairs Canada — Canada–India CEPA negotiations",
    year: "2025",
    url: "https://www.international.gc.ca/trade-commerce/trade-agreements-accords-commerciaux/agr-acc/india-inde/cepa-apeg/negotiations.aspx?lang=eng",
  },
  {
    label: "Agriculture and Agri-Food Canada — bilateral agri-food trade",
    year: "2024",
    url: "https://search.open.canada.ca/qpnotes/record/aafc-aac%2CAAFC-2025-QP-00026",
  },
];
