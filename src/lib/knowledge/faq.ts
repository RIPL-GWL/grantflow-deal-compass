import { faqGroups, type FaqGroup } from "./business-facts";
import { COMPANY } from "@/frontend/content/company";
import { PLAN_RATES, RENT_CAP, RENT_RATES } from "@/lib/ripl-pricing";

// Single source of truth: the FAQ page and the chatbot both read this list,
// so the same fact is never written twice or stated differently.
const ratesGroup: FaqGroup = {
  title: "दरें और संपर्क",
  items: [
    {
      q: "Manufacturer rental plans की दरें क्या हैं?",
      a: `Local ₹${PLAN_RATES.local}/माह, Next Level ₹${PLAN_RATES.next}/माह, Domestic ₹${PLAN_RATES.domestic}/माह। रेवेन्यू शेयर 5–10% आपसी सहमति से तय; 18% GST अलग से।`,
    },
    {
      q: "Retailer को store rent कितना मिलता है?",
      a: `Location class के अनुसार प्रति sq.ft.: ${Object.entries(RENT_RATES)
        .map(([k, v]) => `Class ${k} ₹${v}`)
        .join(", ")}; अधिकतम ₹${RENT_CAP.toLocaleString("en-IN")}/माह। स्टोर निरीक्षण और अंतिम स्वीकृति आवश्यक।`,
    },
    {
      q: "RIPL से संपर्क कैसे करें?",
      a: `Sales: ${COMPANY.email} · General enquiries: ${COMPANY.infoEmail}`,
    },
  ],
};

function dedupe(groups: FaqGroup[]): FaqGroup[] {
  const seen = new Set<string>();
  return groups
    .map((g) => ({
      ...g,
      items: g.items.filter((i) => {
        const key = i.q.trim().toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      }),
    }))
    .filter((g) => g.items.length);
}

export const allFaqGroups: FaqGroup[] = dedupe([...faqGroups, ratesGroup]);

export const knowledgeText = allFaqGroups
  .flatMap((g) => g.items.map((i) => `[${g.title}] Q: ${i.q}\nA: ${i.a}`))
  .join("\n\n");
