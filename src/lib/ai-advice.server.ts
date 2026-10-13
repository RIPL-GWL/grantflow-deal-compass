import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

const MODEL = "openai/gpt-6-astra";

export class AdviceError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

/** One-shot streamed AI call through Lovable AI Gateway; returns final text or throws AdviceError with a user-safe message. */
export async function generateAdvice(system: string, prompt: string): Promise<string> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new AdviceError("AI abhi configure nahi hai.", 401);
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
  });
  let failure: unknown;
  const result = streamText({
    model: provider.responses(MODEL),
    system,
    prompt,
    onError: ({ error }) => { failure = error; },
    providerOptions: { openai: { store: false, forceReasoning: true, reasoningEffort: "low", reasoningSummary: "auto", include: ["reasoning.encrypted_content"] } },
  });
  let text = "";
  try { text = await result.text; } catch (e) { failure ??= e; }
  if (!text) {
    const status = (failure as { statusCode?: number })?.statusCode ?? 500;
    const msg = status === 402 ? "AI credits khatam ho gaye hain. Workspace mein credits add karein."
      : status === 429 ? "Abhi bahut requests aa rahi hain, thodi der baad try karein."
      : status === 403 ? "AI access is workspace ke liye abhi available nahi hai."
      : "AI response abhi nahi mil paya. Kripya baad mein try karein.";
    throw new AdviceError(msg, status);
  }
  return text;
}
