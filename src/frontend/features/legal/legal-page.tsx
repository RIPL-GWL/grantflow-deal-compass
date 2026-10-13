import type { ReactNode } from "react";
import { SiteHeader, SiteFooter } from "@/frontend/components/site-chrome";

export function LegalPage({ title, updated, children }: { title: string; updated?: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="page-shell py-14 sm:py-20">
        <article className="mx-auto max-w-3xl">
          <p className="royal-label">Legal</p>
          <h1 className="mt-4 text-4xl sm:text-5xl">{title}</h1>
          {updated && <p className="mt-3 text-sm text-muted-foreground">Last updated: {updated}</p>}
          <div className="legal-body mt-10 space-y-6 leading-7 text-foreground/85 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:text-foreground [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_a]:text-primary [&_a]:underline">{children}</div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
