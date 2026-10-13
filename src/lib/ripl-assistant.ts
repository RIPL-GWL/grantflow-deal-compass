import { faqGroups } from "@/lib/knowledge/business-facts";
import { RENT_CAP, rentalQuote, storeRent } from "./ripl-pricing";

export const money = (n: number) => `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
const faqs = faqGroups.flatMap(g => g.items);
const find = (phrase: string) => faqs.find(f => f.q.includes(phrase))?.a ?? "Please email sales@rishishwarindustry.in for the agreed terms.";
export function answerQuestion(text: string): string {
  const t = text.toLowerCase().normalize("NFKC");
  if (/calculat|कैलकु|गणना|हिसाब|estimate|कितना.*किराया|किराया.*कितना|rent.*total|total.*rent|rent.*\d|\d.*rent/.test(t)) return "Chatbot में calculation उपलब्ध नहीं है। Final rent और commercial terms की पुष्टि के लिए sales@rishishwarindustry.in से संपर्क करें। Published rates, refund, onboarding या revenue share के बारे में पूछ सकते हैं।";
  if (/refund|रिफ़?ंड|वापसी/.test(t)) return find("रिफ़ंड नीति");
  if (/onboard|ऑनबोर्ड|शुरू करने|getting started|start.*process/.test(t)) return find("शुरू करने की प्रक्रिया");
  if (/why.*share|share.*why|क्यों.*शेयर|share.*kyu|kyu.*share|against|बदले|provide|kya.*dete/.test(t)) return find("क्यों लेता");
  if (/revenue|रेवेन्यू|share|शेयर/.test(t) && !/calculat|calculate|कैलकु|rent|किराया/.test(t)) return find("रेवेन्यू शेयर मॉडल") + "\n\n" + find("क्यों लेता");
  if (/rent|rental|rates?|दरें|किराया|रेंट/.test(t)) return "Manufacturer rental plans: Local ₹750/month; Next Level ₹1,000/month; Domestic ₹1,250/month. Revenue share is 5–10%, mutually agreed; 18% GST is shown separately. These are published plan rates; final rent and commercial terms require confirmation in the written proposal.\n\n" + find("क्यों लेता");
  if (/transport|delivery|ट्रांसपोर्ट/.test(t)) return find("ट्रांसपोर्ट की सीमा");
  if (/payment|settle|भुगतान|पेमेंट|gst/.test(t)) return find("GST") + "\n\n" + find("सेटलमेंट");
  if (/markup|मार्कअप/.test(t)) return find("मार्कअप आधारित");
  if (/guarantee|profit|गारंटी|मुनाफ़ा/.test(t)) return find("गारंटीड बिक्री");
  if (/contact|email|team|संपर्क/.test(t)) return "RIPL sales: sales@rishishwarindustry.in\nGeneral enquiries: info@rishishwarindustry.in. No live team chat is available here.";
  if (/language|हिन्दी में|hinglish|english|मराठीत|bengali|tamil|telugu|kannada|malayalam|gujarati|odia|punjabi|urdu|assamese|bhojpuri/.test(t)) return "नमस्ते! RIPL की published जानकारी यहाँ उपलब्ध है। Rates, refund, onboarding या revenue share के बारे में पूछें।";
  const words = t.split(/\s+/).filter(w => w.length > 2);
  const ranked = faqs.map(f => ({ f, score: words.filter(w => f.q.toLowerCase().includes(w)).length })).sort((a,b) => b.score - a.score);
  if (ranked[0]?.score) return ranked[0].f.a;
  if (/ripl|services|service|क्या करता|kya karta/.test(t)) return find("RIPL क्या करता") + "\n\n" + find("कितने तरीके");
  return "यह जानकारी published जानकारी में नहीं मिली। Rates, refund, onboarding या revenue share के बारे में पूछ सकते हैं। Account-specific terms के लिए sales@rishishwarindustry.in से संपर्क करें।";
}
export function explainRental(plan: "local" | "next" | "domestic", months: number, sales: number, share?: number) {
  const quotes = rentalQuote(plan, months, sales, share);
  return `Manufacturer rental estimate · ${plan} · ${months} month(s)\nSales for the same period: ${money(sales)} (entered by you, not a forecast)\n\n` + quotes.map(q => `Share ${q.percent}%\nRent: ${money(q.rent)}\nRevenue share: ${money(sales)} × ${q.percent}% = ${money(q.revenueShare)}\nBase charges: ${money(q.base)}\nGST 18%: ${money(q.gst)}\nTotal estimated charges: ${money(q.total)}`).join("\n\n") + "\n\n" + (share === undefined ? "Range shown because the final 5–10% share is mutually agreed. " : "Entered share must match the signed agreement. ") + "Final rent basis, taxes and commercial terms need written confirmation. No sales or profit guarantee.";
}
export function explainStore(area: number, classification: number, location: string) {
  const q = storeRent(area, classification);
  return `Retailer store income estimate · ${location}\n${area} sq.ft. × ${money(q.rate)}/sq.ft. = ${money(q.areaRent)}\nMonthly cap: ${money(RENT_CAP)}\nEstimated monthly rent: ${money(q.rent)}\n\nIndicative only: physical store inspection, location assessment and final commercial approval are required. Manufacturer revenue-share/GST charges are not applied to this retailer income estimate.`;
}