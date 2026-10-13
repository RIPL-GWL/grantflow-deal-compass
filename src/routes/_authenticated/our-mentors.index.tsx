import { createFileRoute } from "@tanstack/react-router";
import { MentorsPage } from "@/frontend/features/people/mentors";
import { getMentors } from "@/lib/directory.functions";
const title = "Our Mentors Network — Rishishwar Industry";
const description = "Connect with experienced mentors for strategy, sales, finance, technology, operations, branding and market expansion.";
export const Route = createFileRoute("/_authenticated/our-mentors/")({
  head: () => ({ meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  loader: () => getMentors(),
  component: () => <MentorsPage mentors={Route.useLoaderData()} />,
});
