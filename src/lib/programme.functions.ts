import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { applicationSchema, STAGE_LABELS_PROG, INTEREST_LABELS } from "@/frontend/features/funding-programme/rules";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const SYSTEM = `You advise startup founders applying to the RIPL Startup Funding Programme (29–31 December 2026, Gwalior).
Facts: total ₹15 lakh non-refundable grant pool — only 2 startups receive the grant (₹10 lakh and ₹5 lakh). Other startups can still raise investor funding through the investor pitch stage. Journey: Registration → Startup Scanning (15 days) → First Pitch → Senior Jury Pitch → Investor Pitch. Fee ₹2,999 + 18% GST for up to 2 participants, ₹2,000 + GST per extra participant.
Never guarantee a grant, funding, or selection. Reply in simple Hinglish (Roman script), markdown, under 300 words, with sections:
## Grant Eligibility (indicative fit: Strong / Moderate / Early, with reasons)
## Investor Funding Recommendations (what investors will look for, a realistic ask, 3-4 specific prep steps)
## Agle Kadam`;

export const submitProgrammeApplication = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => applicationSchema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin.from("programme_applications").insert({ ...data, city: data.city ?? null }).select("id").single();
    if (error || !row) { console.error(error); return { ok: false as const, error: "Application save nahi ho payi. Kripya dobara try karein." }; }
    const { generateAdvice, AdviceError } = await import("./ai-advice.server");
    const prompt = `Startup: ${data.startup_name} (${data.city ?? "city not given"})\nStage: ${STAGE_LABELS_PROG[data.stage]}\nFunding need: ₹${data.funding_need}\nInterest: ${INTEREST_LABELS[data.funding_interest]}\nIdea: ${data.idea}`;
    try {
      const text = await generateAdvice(SYSTEM, prompt);
      await supabaseAdmin.from("programme_applications").update({ ai_recommendation: text }).eq("id", row.id);
      return { ok: true as const, advice: text };
    } catch (e) {
      return { ok: true as const, advice: null, adviceError: e instanceof AdviceError ? e.message : "AI salah abhi nahi mil payi." };
    }
  });

const FOLLOWUP_SYSTEM = `You write personalised sales follow-up messages for Rishishwar Industry Private Limited (RIPL) sales staff in India.
Use the deal details and past conversation history. Output only the message (no preamble), ready to send on the requested channel, in the requested language. Keep it warm, specific, under 120 words, with one clear next step. Never invent prices, discounts, or promises not present in the input.`;

export const draftFollowupMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({
    dealId: z.string().uuid(),
    channel: z.enum(["whatsapp", "email", "sms"]),
    language: z.enum(["hinglish", "english", "hindi"]),
    context: z.string().max(2000).default(""),
  }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: deal } = await context.supabase.from("crm_deals").select("title, company, contact_name, value, stage, pipeline, notes, followup_note").eq("id", data.dealId).maybeSingle();
    if (!deal) return { ok: false as const, error: "Deal nahi mila ya access nahi hai." };
    const { data: acts } = await context.supabase.from("crm_deal_activities").select("kind, body, created_at").eq("deal_id", data.dealId).order("created_at", { ascending: false }).limit(15);
    const history = (acts ?? []).reverse().map((a) => `- ${a.created_at.slice(0, 10)} [${a.kind}] ${a.body}`).join("\n") || "No previous conversations logged.";
    const prompt = `Channel: ${data.channel}\nLanguage: ${data.language}\nDeal: ${deal.title}\nCompany: ${deal.company ?? "-"}\nContact: ${deal.contact_name ?? "-"}\nValue: ₹${deal.value}\nStage: ${deal.stage}\nPipeline: ${deal.pipeline}\nNotes: ${deal.notes ?? "-"}\nNext follow-up note: ${deal.followup_note ?? "-"}\nExtra info from salesperson: ${data.context || "-"}\nPast conversations:\n${history}`;
    const { generateAdvice, AdviceError } = await import("./ai-advice.server");
    try { return { ok: true as const, text: await generateAdvice(FOLLOWUP_SYSTEM, prompt) }; }
    catch (e) { return { ok: false as const, error: e instanceof AdviceError ? e.message : "Message tayyar nahi ho paya." }; }
  });
