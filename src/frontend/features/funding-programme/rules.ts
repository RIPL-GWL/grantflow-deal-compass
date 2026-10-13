import { z } from "zod";
export const programmeRules = {
  registrationFee: 2999,
  includedParticipants: 2,
  additionalParticipantFee: 2000,
  gstPercent: 18,
  firstAward: 1000000,
  secondAward: 500000,
  fundingGuaranteed: false,
  scanningDays: 15,
  eventStart: "2026-12-29",
  eventEnd: "2026-12-31",
} as const;

export function registrationTotal(participants: number) {
  const base = programmeRules.registrationFee + Math.max(0, participants - programmeRules.includedParticipants) * programmeRules.additionalParticipantFee;
  return Math.round(base * (1 + programmeRules.gstPercent / 100) * 100) / 100;
}

export const STAGE_LABELS_PROG = { idea: "Idea stage", prototype: "Prototype / MVP", early_revenue: "Early revenue", growth: "Growth / scaling" } as const;
export const INTEREST_LABELS = { grant: "Non-refundable grant", investor: "Investor funding", both: "Grant + investor funding" } as const;

export const applicationSchema = z.object({
  founder_name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().regex(/^[+\d][\d\s-]{6,19}$/),
  startup_name: z.string().trim().min(1).max(160),
  city: z.string().trim().max(80).optional(),
  idea: z.string().trim().min(20).max(3000),
  stage: z.enum(["idea", "prototype", "early_revenue", "growth"]),
  funding_need: z.coerce.number().min(0).max(1e12),
  funding_interest: z.enum(["grant", "investor", "both"]),
  participants: z.coerce.number().int().min(1).max(10),
});
export type ProgrammeApplication = z.infer<typeof applicationSchema>;
