import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/frontend/components/ui/button";
import { Loader2, Search } from "lucide-react";
import { LanguageSelect } from "@/frontend/components/language-select";
import { getTranslatedFaq } from "@/lib/faq-translate.functions";
import type { FaqGroup } from "@/lib/knowledge/business-facts";
import { SiteFooter, SiteHeader } from "@/frontend/components/site-chrome";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/frontend/components/ui/accordion";
import { allFaqGroups } from "@/lib/knowledge/faq";
import { useEffect } from "react";
import { useSiteContent } from "@/lib/site-content";
import { SeasonalPageBanner } from "@/frontend/components/seasonal-page-banner";

export const Route = createFileRoute("/faq")({
  head: () => ({ links: [{ rel: "canonical", href: "/faq" }],
    meta: [
      { title: "FAQ — Rishishwar Industry | Sawaal aur Jawab" },
      {
        name: "description",
        content:
          "RIPL ki services, rental plans, revenue share, payments, settlement aur refund policy ke sabhi sawaalon ke jawab.",
      },
      { property: "og:title", content: "FAQ — Rishishwar Industry" },
      {
        property: "og:description",
        content: "RIPL ki services, rates, process aur policies ke sawaal-jawab ek jagah.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  const translateFaq = useServerFn(getTranslatedFaq);
  const requestId = useRef(0);
  const [active, setActive] = useState(0);
  const [query, setQuery] = useState("");
  const [lang, setLang] = useState("hi");
  const [source, setSource] = useState<FaqGroup[]>(allFaqGroups);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const edited = useSiteContent("faq");
  const hindi = edited ?? allFaqGroups;
  useEffect(() => { if (edited && lang === "hi") setSource(edited); }, [edited, lang]);

  const changeLang = async (code: string) => {
    const id = ++requestId.current;
    setFailed(false);
    setQuery("");
    if (code === "hi") {
      setLang(code);
      setLoading(false);
      setSource(hindi);
      return;
    }
    setLoading(true);
    try {
      const res = await translateFaq({ data: { lang: code } });
      if (id !== requestId.current) return;
      if (res.ok && res.groups) {
        setSource(res.groups);
        setLang(code);
      } else setFailed(true);
    } catch {
      if (id === requestId.current) setFailed(true);
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  };

  const q = query.trim().toLowerCase();
  const groups = q
    ? source
        .map((g) => ({
          ...g,
          items: g.items.filter((i) => `${i.q} ${i.a}`.toLowerCase().includes(q)),
        }))
        .filter((g) => g.items.length)
    : source.slice(active, active + 1);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <SeasonalPageBanner title="Clarity for Every New Beginning." />
        <section className="border-b border-border bg-muted/40">
          <div className="page-shell py-12 sm:py-16">
            <p className="text-xs font-semibold uppercase text-primary">RIPL · Help Centre</p>
            <h1 className="mt-4 text-3xl sm:text-5xl">Frequently Asked Questions</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              आपके सवाल, सीधे जवाब — अपनी भाषा चुनें / Choose your language.
            </p>
          </div>
        </section>
        <section className="page-shell grid gap-8 py-12 lg:grid-cols-[260px_1fr]">
          <aside className="space-y-4">
            <LanguageSelect value={lang} onChange={changeLang} disabled={loading} />
            {loading && (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Translating…
              </p>
            )}
            {failed && (
              <p className="text-sm text-destructive">
                Translation unavailable. Please try again; the previous language is still displayed.
              </p>
            )}
            <label className="flex items-center gap-2 border border-border bg-card px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search / खोजें…"
                className="w-full bg-transparent text-sm outline-none"
              />
            </label>
            <nav className="flex flex-wrap gap-2 lg:flex-col">
              {source.map((g, i) => (
                <Button variant="outline"
                  key={g.title}
                  onClick={() => {
                    setActive(i);
                    setQuery("");
                  }}
                  className={`border px-3 py-2 text-left text-sm transition-colors ${
                    !q && active === i
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:border-primary"
                  }`}
                >
                  {g.title}
                </Button>
              ))}
            </nav>
          </aside>
          <div className="space-y-10" dir={lang === "ur" ? "rtl" : undefined}>
            {groups.length === 0 && (
              <p className="text-muted-foreground">कोई सवाल नहीं मिला।</p>
            )}
            {groups.map((g) => (
              <div key={g.title}>
                <h2 className="text-2xl">{g.title}</h2>
                <Accordion type="single" collapsible className="mt-4">
                  {g.items.map((item) => (
                    <AccordionItem key={item.q} value={item.q}>
                      <AccordionTrigger className="text-left">{item.q}</AccordionTrigger>
                      <AccordionContent className="leading-7 text-muted-foreground">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
