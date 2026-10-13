import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { investors as staticInvestors, type Investor } from "@/frontend/features/investors/data";
import { mentors as staticMentors, team as staticTeam, type Mentor, type TeamMember } from "@/frontend/features/people/data";

export type DirectoryKind = "investor" | "mentor" | "team";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = { slug: string; data: any };

const fallback = { investor: staticInvestors, mentor: staticMentors, team: staticTeam };

/** Fills missing fields so edited profiles always render, even when only basic fields were filled in. */
function complete(kind: DirectoryKind, r: Row) {
  const d = { ...r.data, slug: r.slug };
  const name = String(d.name ?? "");
  if (kind === "mentor") {
    const focus = (d.focus as string[]) ?? [];
    return {
      title: "", regions: [], portrait: 0, years: "15+", guided: "100+", investments: "25+", countries: "8", quote: "", expertise: [],
      bio: d.bio || `${name} helps founders and businesses with ${focus.slice(0, 3).join(", ").toLowerCase()}.`,
      journey: [], ...d, focus,
    } as unknown as Mentor;
  }
  if (kind === "team") {
    return {
      employeeId: "", designation: "", department: "", team: "", location: "Gwalior, Madhya Pradesh", portrait: 0,
      reportingTo: `Head - ${d.department ?? "Management"}`, responsibilities: [], skills: [],
      education: { degree: "", school: "" }, languages: ["Hindi", "English"], ...d,
    } as unknown as TeamMember;
  }
  return { type: "", sectors: [], regions: [], stages: [], portrait: 0, ...d } as unknown as Investor;
}

async function load(kind: DirectoryKind) {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["SUPABASE_ANON_KEY"];
  if (!url || !key) return null;
  const client = createClient(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: key.startsWith("sb_") ? { fetch: (i, init) => { const h = new Headers(init?.headers); h.delete("Authorization"); h.set("apikey", key); return fetch(i, { ...init, headers: h }); } } : {},
  });
  const { data, error } = await client.from("directory_profiles").select("slug, data").eq("kind", kind).eq("is_published", true).order("sort_order").order("created_at");
  if (error || !data?.length) return null;
  return data.map((r) => complete(kind, r as Row));
}

const kindSchema = z.object({ kind: z.enum(["investor", "mentor", "team"]) });

export const listDirectory = createServerFn({ method: "GET" })
  .inputValidator((i: unknown) => kindSchema.parse(i))
  .handler(async ({ data }) => ((await load(data.kind).catch(() => null)) ?? fallback[data.kind]) as Array<Investor | Mentor | TeamMember>);

export const getInvestors = async () => (await listDirectory({ data: { kind: "investor" } })) as Investor[];
export const getMentors = async () => (await listDirectory({ data: { kind: "mentor" } })) as Mentor[];
export const getTeam = async () => (await listDirectory({ data: { kind: "team" } })) as TeamMember[];
