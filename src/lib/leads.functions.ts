import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const leadTypes = ["manufacturer", "retailer", "distributor", "funding", "global", "general", "contact"] as const;

const LeadSchema = z.object({
  leadType: z.enum(leadTypes),
  subject: z.string().max(200),
  fields: z.record(z.string().max(2000)).refine((f) => Object.keys(f).length <= 40),
  sourcePage: z.string().max(200).optional(),
  website: z.string().max(0).optional(), // honeypot: must stay empty
});

const recent = new Map<string, number[]>();

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => LeadSchema.parse(input))
  .handler(async ({ data }) => {
    const f = data.fields;
    const name = (f['name'] || f['owner'] || f['contact'] || f['founder'] || f['company'] || "").trim();
    const phone = (f['phone'] || "").replace(/[^\d+]/g, "");
    const email = (f['email'] || "").trim();
    if (name.length < 2) throw new Error("Please enter your name.");
    if (phone.length < 10 || phone.length > 15) throw new Error("Please enter a valid mobile number.");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Please enter a valid email address.");

    const key = `${phone}`;
    const now = Date.now();
    const hits = (recent.get(key) ?? []).filter((t) => now - t < 10 * 60_000);
    if (hits.length >= 5) throw new Error("Too many submissions. Please try again in a few minutes.");
    recent.set(key, [...hits, now]);

    const url = process.env['SUPABASE_URL'];
    const publishableKey = process.env['SUPABASE_PUBLISHABLE_KEY'] ?? process.env['SUPABASE_ANON_KEY'];
    if (!url || !publishableKey) throw new Error("Enquiry service is temporarily unavailable.");
    const supabase = createClient(url, publishableKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (publishableKey.startsWith('sb_') && headers.get('Authorization') === `Bearer ${publishableKey}`) headers.delete('Authorization');
        headers.set('apikey', publishableKey);
        return fetch(input, { ...init, headers });
      } },
    });
    const { message, ...details } = f;
    const { error } = await supabase.from("leads").insert({
      lead_type: data.leadType,
      name: name.slice(0, 120),
      company: (f['company'] || f['store'] || null)?.slice(0, 200) ?? null,
      phone,
      email: email || "not-provided@lead.local",
      details: { subject: data.subject, ...details },
      message: message?.slice(0, 4000) ?? null,
      source_page: data.sourcePage ?? null,
    });
    if (error) {
      console.error("lead insert failed", error.message);
      throw new Error("We couldn't save your enquiry. Please try again or email us.");
    }
    return { ok: true };
  });

export function leadTypeFromSubject(subject: string): (typeof leadTypes)[number] {
  const s = subject.toLowerCase();
  if (s.includes("manufactur")) return "manufacturer";
  if (s.includes("retail") || s.includes("store")) return "retailer";
  if (s.includes("distributor") || s.includes("dealer")) return "distributor";
  if (s.includes("fund")) return "funding";
  if (s.includes("global") || s.includes("export")) return "global";
  if (s.includes("contact") || s.includes("partnership")) return "contact";
  return "general";
}
