export type FormField = {
  k: string;
  l: string;
  t: "text" | "tel" | "email" | "number" | "select" | "textarea";
  opts?: string[];
  optional?: boolean;
  placeholder?: string;
  wide?: boolean;
  rows?: number;
};

export const contactFields: FormField[] = [
  { k: "name", l: "Your Name", t: "text", placeholder: "Full name" },
  { k: "company", l: "Company", t: "text", optional: true, placeholder: "Company name" },
  { k: "phone", l: "Phone", t: "tel", placeholder: "+91 ..." },
  { k: "email", l: "Email", t: "email", placeholder: "you@company.com" },
  { k: "enquiryType", l: "Enquiry Type", t: "select", opts: ["Manufacturer", "Retailer", "Distributor", "Funding", "Global Expansion", "General"] },
  { k: "category", l: "Product Category", t: "select", optional: true, opts: ["Food & Packaged Goods", "Beverages", "Personal Care", "Household Essentials", "Other"] },
  { k: "currentMarket", l: "Current Market", t: "text", optional: true, placeholder: "e.g. Maharashtra" },
  { k: "targetMarket", l: "Target Market", t: "text", optional: true, placeholder: "e.g. Pan-India, UAE" },
  { k: "message", l: "Message", t: "textarea", rows: 5, placeholder: "Tell us about your products and the markets you want to reach." },
];

export const storeFields: FormField[] = [
  { k: "name", l: "Owner Name", t: "text" },
  { k: "phone", l: "Mobile Number", t: "tel" },
  { k: "store", l: "Store Name", t: "text" },
  { k: "city", l: "City / Town, State", t: "text" },
  { k: "area", l: "Store Area (sq.ft.)", t: "number" },
];

export const retailFields: FormField[] = [
  { k: "owner", l: "Owner Name", t: "text" },
  { k: "phone", l: "Mobile Number", t: "tel" },
  { k: "email", l: "Email", t: "email", optional: true },
  { k: "store", l: "Store Name", t: "text" },
  { k: "type", l: "Store Type", t: "select", opts: ["Kirana / General Store", "Supermarket", "Medical Store", "Cosmetic Store", "Other"] },
  { k: "state", l: "State", t: "text" },
  { k: "city", l: "District / City / Town", t: "text" },
  { k: "address", l: "Full Store Address", t: "textarea" },
  { k: "area", l: "Store Area (sq.ft.)", t: "number" },
  { k: "gst", l: "GST Number", t: "text", optional: true },
];

export const mfgFields: FormField[] = [
  { k: "company", l: "Company Name", t: "text" },
  { k: "contact", l: "Contact Person", t: "text" },
  { k: "designation", l: "Designation", t: "text", optional: true },
  { k: "phone", l: "Mobile Number", t: "tel" },
  { k: "email", l: "Business Email", t: "email" },
  { k: "category", l: "Product Category", t: "select", opts: ["Food & Beverages", "Personal Care", "Home Care", "Health & Wellness", "Packaged Snacks", "Other"] },
  { k: "brands", l: "Brand Names", t: "text" },
  { k: "location", l: "Factory Location (City, State)", t: "text" },
  { k: "capacity", l: "Production Capacity (per month)", t: "text", optional: true, placeholder: "e.g. 50,000 units" },
  { k: "currentMarket", l: "Current Market", t: "text", optional: true, placeholder: "States / countries you sell in today" },
  { k: "markets", l: "Target Markets", t: "select", opts: ["Domestic (India)", "International", "Both"] },
  { k: "compliance", l: "FSSAI / MCA / Other Licence No.", t: "text", optional: true },
  { k: "website", l: "Website", t: "text", optional: true, placeholder: "https://" },
  { k: "catalogue", l: "Catalogue Link", t: "text", optional: true, placeholder: "Drive / PDF link" },
  { k: "gst", l: "GST Number", t: "text", optional: true },
  { k: "message", l: "About Your Products / Requirement", t: "textarea", optional: true },
];

export const advertisingFields: FormField[] = [
  { k: "name", l: "Contact Name", t: "text" },
  { k: "company", l: "Company / Brand", t: "text" },
  { k: "phone", l: "Mobile Number", t: "tel" },
  { k: "email", l: "Business Email", t: "email" },
  { k: "product", l: "Product Category", t: "text" },
  { k: "format", l: "Preferred Format", t: "select", opts: ["Silent 10–20 second video", "Static illuminated sign board", "Both formats"] },
  { k: "markets", l: "Preferred States / Areas", t: "text", optional: true, wide: true },
  { k: "message", l: "Campaign Requirement", t: "textarea", rows: 4, wide: true },
];
