import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { streamText } from "ai";
import { allFaqGroups } from "./knowledge/faq";
import type { FaqGroup } from "./knowledge/business-facts";
import { getLanguage } from "./languages";
import { createLovableAiGatewayRunIdFetch } from "./chat-run-id.server";
import { validateFaqTranslation } from "./faq-validation";

const cache = new Map<string, Promise<FaqGroup[]>>();

async function translate(lang: string): Promise<FaqGroup[]> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("not configured");
  const name = getLanguage(lang)?.name ?? lang;
  const runIdFetch = createLovableAiGatewayRunIdFetch();
  const provider = createOpenAICompatible({
    name: "lovable",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });
  const groups: FaqGroup[] = [];
  for (const group of allFaqGroups) {
      const result = streamText({
        model: provider("google/gemini-3-flash-preview"),
        maxRetries: 0,
        system: `Translate this FAQ JSON object into ${name} (code: ${lang}). Keep exactly the same keys, order and number of items. Keep numbers, ₹ amounts, percentages, emails and brand names (RIPL, FMCG) unchanged. Do not add or remove facts. Return only JSON.`,
        prompt: JSON.stringify(group),
      });
      const text = await result.text;
      groups.push(validateFaqTranslation(JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1)), group));
  }
  return groups;
}

export function translatedFaq(lang: string): Promise<FaqGroup[]> {
  if (lang === "hi") return Promise.resolve(allFaqGroups);
  let p = cache.get(lang);
  if (!p) {
    p = translate(lang);
    cache.set(lang, p);
    p.catch(() => cache.delete(lang));
  }
  return p;
}
