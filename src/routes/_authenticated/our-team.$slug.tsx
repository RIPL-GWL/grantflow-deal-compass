import { createFileRoute, notFound } from "@tanstack/react-router";
import { getTeam } from "@/lib/directory.functions";
import { TeamProfile } from "@/frontend/features/people/team";
export const Route = createFileRoute("/_authenticated/our-team/$slug")({
  loader: async ({ params }) => { const p = (await getTeam()).find((x) => x.slug === params.slug); if (!p) throw notFound(); return p; },
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.name} — ${loaderData.designation} | Rishishwar Industry` : "Team Member Not Found — Rishishwar Industry";
    const description = loaderData ? `${loaderData.name}, ${loaderData.designation} in ${loaderData.department} at Rishishwar Industry.` : "This team profile is unavailable.";
    return { meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "profile" }, { name: "twitter:card", content: "summary_large_image" }] };
  },
  notFoundComponent: () => <p className="p-16 text-center">Team member not found.</p>,
  errorComponent: ({ error }) => <p role="alert" className="p-16 text-center">{String((error as Error)?.message ?? error)}</p>,
  component: () => <TeamProfile member={Route.useLoaderData()} />,
});
