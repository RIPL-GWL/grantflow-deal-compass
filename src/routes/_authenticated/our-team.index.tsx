import { createFileRoute } from "@tanstack/react-router";
import { TeamPage } from "@/frontend/features/people/team";
import { getTeam } from "@/lib/directory.functions";
const title = "Our Team & Employee Verification — Rishishwar Industry";
const description = "Meet the Rishishwar Industry team and verify any employee using their Employee ID and Employee Code.";
export const Route = createFileRoute("/_authenticated/our-team/")({
  head: () => ({ meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  loader: () => getTeam(),
  component: () => <TeamPage members={Route.useLoaderData()} />,
});
