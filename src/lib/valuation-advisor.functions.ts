import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getValuationAdvice = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ summary: z.string().min(20).max(6000) }).parse(d))
  .handler(async ({ data }) => {
    const { explainValuation, AdvisorError } = await import("./valuation-advisor.server");
    try {
      return { ok: true as const, text: await explainValuation(data.summary) };
    } catch (e) {
      return { ok: false as const, error: e instanceof AdvisorError ? e.message : "AI salah abhi nahi mil payi." };
    }
  });
