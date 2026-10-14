import { convertToModelMessages, createUIMessageStream, createUIMessageStreamResponse, generateText, type UIMessage } from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { answerQuestion } from "./ripl-assistant";
import { knowledgeText } from "./knowledge/faq";
import { getLanguage } from "./languages";
import { createResponsesCall } from "./chat-responses.server";
import { createLovableAiGatewayRunIdFetch } from "./chat-run-id.server";

const RULES = `You are "RIPL Assistant", the friendly client assistant on the Rishishwar Industry Pvt. Ltd. website. Answer client questions about what RIPL does, why, services, commercial models, pricing, process, payments, policies, network, markets, the Startup Funding Programme, website themes and getting started.
Rules:
- Use only the facts in the knowledge base below.
- Never promise guaranteed sales, profit, revenue numbers or funding approval.
- Describe the refund policy as "up to 50%, as per agreement terms", with the condition that the product was actually present in the market in that period.
- Never reveal or invent internal base prices, margins, staff discount authority or incentive formulas. Never quote minimum or discounted rental rates; say final terms depend on store count and are finalised by the RIPL team.
- Never give phone numbers or addresses. For account-specific, negotiation, complaint or unknown matters, direct to sales@rishishwarindustry.in or the Contact page.
- Professional, warm, honest tone. Short clear answers, bullets when helpful.
Language: ALWAYS reply in the client's chosen language given below, in its native script (Hinglish = Hindi in Roman letters mixed with English). Never switch to the language of the user's message, even if they write in another language; only an explicit in-message language request overrides the chosen language.`;

// Hybrid: AI Gateway first; any failure (no key, credits, network) falls back
// to the offline answers built from the bundled website data.
export async function handleRiplChat(request: Request) {
  let messages: UIMessage[] = [];
  let language = "";
  try {
    const raw = await request.text();
    if (raw.length > 180000)
      return new Response("Conversation is too long. Please start a new conversation.", { status: 413 });
    const body = JSON.parse(raw);
    messages = Array.isArray(body.messages) ? body.messages : [];
    language = typeof body.language === "string" ? body.language : "";
  } catch {
    return new Response("Invalid conversation", { status: 400 });
  }
  const lastUser = [...messages].reverse().find((m) => m?.role === "user");
  const text = (lastUser?.parts ?? [])
    .filter((p) => p?.type === "text")
    .map((p) => (p as { text?: string }).text ?? "")
    .join(" ")
    .trim();
  if (!text) return new Response("Invalid conversation", { status: 400 });

  const apiKey = process.env["LOVABLE_API_KEY"];
  if (apiKey) {
    try {
      const lang = getLanguage(language);
      const call = createResponsesCall(
        request,
        { baseURL: "https://ai.gateway.lovable.dev/v1", apiKey, model: "openai/gpt-6-astra" },
        await convertToModelMessages(messages),
        `${RULES}\nChosen language: ${lang?.name ?? (language || "auto")}.\n\nKNOWLEDGE BASE:\n${knowledgeText}`,
      );
      const res = await call.response(messages);
      if (res.ok) return res;
    } catch {
      /* fall through to offline */
    }
  }
  if (request.signal.aborted) return new Response(null, { status: 499 });
  const answer = await localizeAnswer(answerQuestion(text), language, apiKey);
  return streamTextResponse(answer, request.signal);
}

// Offline answers are authored in Hindi/Hinglish; translate them into the
// client's chosen language so the reply always matches the picker. If the
// gateway is unreachable (true offline), the original text is returned.
const translationCache = new Map<string, Promise<string>>();
function localizeAnswer(answer: string, language: string, apiKey?: string): Promise<string> {
  const lang = getLanguage(language);
  if (!lang || lang.code === "hi" || !apiKey) return Promise.resolve(answer);
  const key = `${lang.code}:${answer}`;
  let p = translationCache.get(key);
  if (!p) {
    const runIdFetch = createLovableAiGatewayRunIdFetch();
    const provider = createOpenAICompatible({
      name: "lovable",
      baseURL: "https://ai.gateway.lovable.dev/v1",
      headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
      fetch: runIdFetch.fetch,
    });
    p = generateText({
      model: provider("google/gemini-3-flash-preview"),
      maxRetries: 0,
      system: `Translate the user's text into ${lang.name} (code: ${lang.code}). Keep numbers, ₹ amounts, percentages, emails and brand names (RIPL, FMCG, GST) unchanged. Do not add or remove facts. Return only the translated text.${lang.code === "hinglish" ? " Hinglish means Hindi written in Roman letters mixed with English words." : ""}`,
      prompt: answer,
    }).then((r) => r.text.trim() || answer).catch(() => answer);
    translationCache.set(key, p);
  }
  return p;
}

function streamTextResponse(text: string, signal: AbortSignal) {
  const chunks = text.match(/.{1,80}(\s|$)/gs) ?? [text];
  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      const id = "t1";
      writer.write({ type: "text-start", id });
      for (const chunk of chunks) {
        if (signal.aborted) break;
        writer.write({ type: "text-delta", id, delta: chunk });
        await new Promise((r) => setTimeout(r, 15));
      }
      writer.write({ type: "text-end", id });
    },
  });
  return createUIMessageStreamResponse({ stream });
}
