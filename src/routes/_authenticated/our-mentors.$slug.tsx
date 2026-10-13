import { createFileRoute, notFound } from "@tanstack/react-router";
import { getMentors } from "@/lib/directory.functions";
import { MentorProfile } from "@/frontend/features/people/mentors";
export const Route = createFileRoute("/_authenticated/our-mentors/$slug")({
  loader: async ({ params }) => { const m = (await getMentors()).find((x) => x.slug === params.slug); if (!m) throw notFound(); return m; },
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.name} — ${loaderData.title} | Rishishwar Industry` : "Mentor Not Found — Rishishwar Industry";
    const description = loaderData ? `${loaderData.name} mentors founders on ${loaderData.focus.join(", ").toLowerCase()}.` : "This mentor profile is unavailable.";
    return { meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "profile" }, { name: "twitter:card", content: "summary_large_image" }] };
  },
  notFoundComponent: () => <p className="p-16 text-center">Mentor not found.</p>,
  errorComponent: ({ error }) => <p role="alert" className="p-16 text-center">{String((error as Error)?.message ?? error)}</p>,
  component: () => <MentorProfile mentor={Route.useLoaderData()} />,
});
