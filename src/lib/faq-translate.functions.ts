import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { languages } from "./languages";

const codes = languages.map((l) => l.code) as [string, ...string[]];

export const getTranslatedFaq = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ lang: z.enum(codes) }).parse(d))
  .handler(async ({ data }) => {
    const { translatedFaq } = await import("./faq-translate.server");
    try {
      return { ok: true as const, groups: await translatedFaq(data.lang) };
    } catch {
      return { ok: false as const, groups: null };
    }
  });
