import { Parser } from "htmlparser2";

export const publicPages = [
  "/",
  "/about",
  "/our-services",
  "/manufacturers",
  "/retailer-partner",
  "/fund-your-business",
  "/advertise-your-product",
  "/global-presence",
  "/contact",
  "/payment",
  "/store-list",
  "/register-your-store",
  "/partner-with-us",
  "/business-valuation-calculator",
  "/global-presence/usa",
  "/global-presence/canada",
];
export function mainText(html: string) {
  let depth = 0;
  let ignored = 0;
  const pieces: string[] = [];
  const parser = new Parser(
    {
      onopentag(name) {
        if (name === "main") depth++;
        if (depth && ["script", "style", "form", "nav"].includes(name)) ignored++;
      },
      ontext(text) {
        if (depth && !ignored) pieces.push(text);
      },
      onclosetag(name) {
        if (depth && ["script", "style", "form", "nav"].includes(name))
          ignored = Math.max(0, ignored - 1);
        if (name === "main") depth = Math.max(0, depth - 1);
      },
    },
    { decodeEntities: true },
  );
  parser.write(html);
  parser.end();
  return pieces.join(" ").replace(/\s+/g, " ").trim();
}
let cached: { origin: string; until: number; text: string } | undefined;
let pending: Promise<string> | undefined;
export async function websiteContext(origin: string) {
  if (cached?.origin === origin && cached.until > Date.now()) return cached.text;
  if (pending) return pending;
  pending = (async () => {
    const pages = await Promise.all(
      publicPages.map(async (path) => {
        try {
          const r = await fetch(new URL(path, origin), { redirect: "error" });
          if (!r.ok) return "";
          const text = mainText(await r.text());
          return text ? `SOURCE ${path}\n${text}` : "";
        } catch {
          return "";
        }
      }),
    );
    const text = pages.filter(Boolean).join("\n\n");
    if (!text) throw new Error("Website information could not be loaded. Please try again later.");
    cached = { origin, until: Date.now() + 300000, text };
    return text;
  })();
  try {
    return await pending;
  } finally {
    pending = undefined;
  }
}
