import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

const MODEL = "openai/gpt-6-astra";

export class AdvisorError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

export async function explainValuation(summary: string): Promise<string> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new AdvisorError("AI advisor abhi configure nahi hai.", 401);
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
  });
  let failure: unknown;
  const result = streamText({
    model: provider.responses(MODEL),
    system:
      "You are a senior Indian SME business valuation advisor for Rishishwar Industry. Reply in simple Hinglish (Roman script), using markdown headings and bullets, under 350 words. Sections: '## Aapki Valuation Range ka Matlab' (explain why the range came out this way, referencing the method numbers), '## Valuation Badhane ke Personalised Sujhav' (5-7 specific, actionable tips tied to the user's weakest scores and numbers, with expected impact), '## Agle Kadam'. Never promise funding, approval or a certified valuation; say it is indicative and subject to due diligence.",
    prompt: summary,
    onError: ({ error }) => { failure = error; },
    providerOptions: {
      openai: {
        store: false,
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        include: ["reasoning.encrypted_content"],
      },
    },
  });
  let text = ""; try { text = await result.text; } catch (e) { failure ??= e; }
  if (!text) {
    const status = (failure as { statusCode?: number })?.statusCode ?? 500;
    const msg =
      status === 402 ? "AI credits khatam ho gaye hain. Workspace mein credits add karein."
      : status === 429 ? "Abhi bahut requests aa rahi hain, thodi der baad try karein."
      : status === 403 ? "AI access is workspace ke liye abhi available nahi hai."
      : "AI salah abhi nahi mil payi. Kripya baad mein try karein.";
    throw new AdvisorError(msg, status);
  }
  return text;
}
