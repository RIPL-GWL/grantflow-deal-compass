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

const programmeGroup: FaqGroup = {
  title: "Startup Funding Programme",
  items: [
    { q: "RIPL Startup Funding Programme क्या है?", a: "RIPL Startup Funding Programme 29–31 दिसंबर 2026 को Gwalior में होगा। कुल ₹15 लाख non-refundable grant pool है — केवल 2 startups को grant मिलेगा (₹10 लाख और ₹5 लाख)। बाकी startups investor pitch stage के ज़रिए investor funding जुटा सकते हैं। Grant, funding या selection की कोई गारंटी नहीं है।" },
    { q: "Funding Programme की प्रक्रिया और fee क्या है?", a: "Journey: Registration → Startup Scanning (15 दिन) → First Pitch → Senior Jury Pitch → Investor Pitch। Fee ₹2,999 + 18% GST (2 participants तक), हर अतिरिक्त participant ₹2,000 + GST। Apply करने के लिए website पर Funding Programme page खोलें।" },
  ],
};

const themeGroup: FaqGroup = {
  title: "Website",
  items: [
    { q: "Website का theme कैसे बदलें?", a: "Website हर बार Navratri theme में खुलती है। Desktop पर header के theme button से, और mobile पर menu खोलकर Navratri Light, Dark या Light चुनें।" },
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

export const allFaqGroups: FaqGroup[] = dedupe([...faqGroups, programmeGroup, ratesGroup, themeGroup]);

export const knowledgeText = allFaqGroups
  .flatMap((g) => g.items.map((i) => `[${g.title}] Q: ${i.q}\nA: ${i.a}`))
  .join("\n\n");
