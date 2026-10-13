import { z } from "zod";
import type { FaqGroup } from "./knowledge/business-facts";

const groupSchema = z.object({ title: z.string().min(1), items: z.array(z.object({ q: z.string().min(1), a: z.string().min(1) })) });
const facts = (text: string) => (text.match(/\d+(?:[,.]\d+)*|[\w.+-]+@[\w.-]+\.[A-Za-z]+/g) ?? []).sort();

export function validateFaqTranslation(value: unknown, original: FaqGroup): FaqGroup {
  const group = groupSchema.parse(value);
  if (group.items.length !== original.items.length) throw new Error("Incomplete translation");
  group.items.forEach((item, i) => {
    const source = original.items[i];
    if (!source || JSON.stringify(facts(source.a)) !== JSON.stringify(facts(item.a))) throw new Error("Translation changed business facts");
  });
  return group;
}