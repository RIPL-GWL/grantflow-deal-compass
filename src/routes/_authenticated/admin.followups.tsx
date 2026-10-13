import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchDeals, fetchPeople, followupState, inr, STAGE_LABELS } from "@/lib/crm";

export const Route = createFileRoute("/_authenticated/admin/followups")({
  head: () => ({ meta: [{ title: "Follow-ups — RIPL Admin" }, { name: "robots", content: "noindex" }] }),
  component: FollowupsPage,
});

function FollowupsPage() {
  const { data: deals = [], isLoading } = useQuery({ queryKey: ["crm-deals"], queryFn: fetchDeals });
  const { data: people = {} } = useQuery({ queryKey: ["crm-people"], queryFn: fetchPeople });
  const open = deals.filter((d) => d.next_followup_at && !["won", "lost"].includes(d.stage))
    .sort((a, b) => a.next_followup_at!.localeCompare(b.next_followup_at!));
  const groups = [
    { key: "overdue", title: "Overdue", cls: "text-destructive" },
    { key: "today", title: "Today", cls: "text-primary" },
    { key: "upcoming", title: "Upcoming", cls: "text-foreground" },
  ] as const;
  const noFollowup = deals.filter((d) => !d.next_followup_at && !["won", "lost"].includes(d.stage));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Follow-ups</h1>
        <p className="text-sm text-muted-foreground">Calls and meetings you planned on deals. Set a follow-up from any deal page.</p>
      </div>
      {isLoading && <p>Loading…</p>}
      {groups.map((g) => {
        const list = open.filter((d) => followupState(d.next_followup_at) === g.key);
        return (
          <section key={g.key} className="rounded-lg border bg-card p-4">
            <h2 className={`mb-2 text-lg font-semibold ${g.cls}`}>{g.title} ({list.length})</h2>
            {list.length === 0 ? <p className="text-sm text-muted-foreground">Nothing here.</p> : (
              <ul className="divide-y text-sm">
                {list.map((d) => (
                  <li key={d.id} className="flex flex-wrap items-center gap-3 py-2">
                    <span className="w-40 text-muted-foreground">{new Date(d.next_followup_at!).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span>
                    <Link to="/admin/deals/$id" params={{ id: d.id }} className="font-medium text-primary">{d.title}</Link>
                    <span className="text-muted-foreground">{d.followup_note}</span>
                    <span className="ml-auto text-muted-foreground">{STAGE_LABELS[d.stage]} · {inr(Number(d.value))} · {people[d.owner_id] ?? ""}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
      {noFollowup.length > 0 && (
        <section className="rounded-lg border bg-card p-4">
          <h2 className="mb-2 text-lg font-semibold text-foreground">Open deals with no follow-up ({noFollowup.length})</h2>
          <div className="flex flex-wrap gap-2 text-sm">
            {noFollowup.map((d) => <Link key={d.id} to="/admin/deals/$id" params={{ id: d.id }} className="rounded border px-2 py-1 text-primary">{d.title}</Link>)}
          </div>
        </section>
      )}
    </div>
  );
}
