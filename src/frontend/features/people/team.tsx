import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, BadgeCheck, Building2, CalendarDays, ClipboardList, Globe, GraduationCap, IdCard, KeyRound, Mail, MapPin, Search, ShieldCheck, ShieldX, UserRound, Users, BarChart3 } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/frontend/components/site-chrome";
import { Button } from "@/frontend/components/ui/button";
import { Portrait, SectionHeading } from "@/frontend/features/investors/shared";
import { verifyEmployee, type VerifiedEmployee } from "@/lib/employee-verify.functions";
import { DEPARTMENTS, filterTeam, team, type TeamMember } from "./data";

export function TeamPage({ members = team }: { members?: TeamMember[] }) {
  const [query, setQuery] = useState("");
  const [dept, setDept] = useState("");
  const results = filterTeam(query, dept, members);
  return <><SiteHeader /><main className="investor-page people-page">
    <section className="people-hero"><div className="page-shell">
      <nav className="investor-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><span>›</span><b>Our Team</b></nav>
      <p className="investor-eyebrow">Our Team</p>
      <h1>The People Behind <em>Our Purpose</em></h1>
      <p className="people-lead">A passionate team working together to empower businesses and build a better tomorrow.</p>
      <dl className="people-stats">{[[Users, "75+", "Team Members"], [MapPin, "6+", "Cities"], [Building2, "Multiple", "Departments"], [BarChart3, "One", "Vision"]].map(([I, v, l]) => { const Icon = I as typeof Users; return <div key={String(l)}><Icon /><dt>{String(v)}</dt><dd>{String(l)}</dd></div>; })}</dl>
    </div></section>
    <div className="page-shell people-section">
      <VerifyEmployee />
      <div className="people-team-head">
        <SectionHeading eyebrow="Our Team">Meet Our <em>Team Members</em></SectionHeading>
        <label className="people-search"><Search /><input aria-label="Search team" placeholder="Search by name, department or designation..." value={query} onChange={(e) => setQuery(e.target.value.slice(0, 80))} /></label>
      </div>
      <div className="people-chips">{["", ...DEPARTMENTS].map((d) => <Button key={d || "all"} size="sm" variant={dept === d ? "default" : "outline"} onClick={() => setDept(d)}>{d || "All"}</Button>)}</div>
      <div className="people-team-grid">{results.map((p) => <Link key={p.slug} to="/our-team/$slug" params={{ slug: p.slug }} className="people-team-card">
        <Portrait index={p.portrait} name={p.name} />
        <div><h3>{p.name}</h3><p>{p.designation}</p><small>{p.department}</small><span className="people-link">View Profile<ArrowRight /></span></div>
      </Link>)}</div>
      {!results.length && <p className="people-empty">No team members match your search.</p>}
    </div>
  </main><SiteFooter /></>;
}

function VerifyEmployee() {
  const [employeeId, setId] = useState("");
  const [employeeCode, setCode] = useState("");
  const verify = useServerFn(verifyEmployee);
  const m = useMutation({ mutationFn: () => verify({ data: { employeeId, employeeCode } }) });
  const ready = employeeId.trim().length >= 3 && employeeCode.trim().length >= 3;
  return <section className="people-verify" aria-labelledby="verify-title">
    <div className="people-verify-main">
      <div className="people-verify-title"><ShieldCheck /><div><h2 id="verify-title">Verify Our Employee</h2><p>Enter Employee ID and Employee Code to verify the authenticity of a Rishishwar Industry team member.</p></div></div>
      <form className="people-verify-form" onSubmit={(e) => { e.preventDefault(); if (ready) m.mutate(); }}>
        <label><UserRound /><input aria-label="Employee ID" placeholder="Enter Employee ID" value={employeeId} maxLength={40} onChange={(e) => { setId(e.target.value); m.reset(); }} /></label>
        <label><KeyRound /><input aria-label="Employee Code" type="password" autoComplete="off" placeholder="Enter Employee Code" value={employeeCode} maxLength={40} onChange={(e) => { setCode(e.target.value); m.reset(); }} /></label>
        <Button type="submit" disabled={!ready || m.isPending}>{m.isPending ? "Verifying..." : "Verify Employee"}<ArrowRight /></Button>
      </form>
      {m.data?.verified && <IdCardResult e={m.data.employee} />}
      {m.data && !m.data.verified && <p className="people-verify-fail" role="alert"><ShieldX />Not verified. The Employee ID and Employee Code do not match any active Rishishwar Industry employee.</p>}
      {m.isError && <p className="people-verify-fail" role="alert"><ShieldX />Please check the details and try again.</p>}
    </div>
    <aside><ShieldCheck /><h3>Secure Verification</h3><p>Employee details will be shown only when both Employee ID and Code match.</p></aside>
  </section>;
}

function IdCardResult({ e }: { e: VerifiedEmployee }) {
  const rows: [typeof IdCard, string, string | null][] = [
    [IdCard, "Employee ID", e.employeeId], [Building2, "Department", e.department], [UserRound, "Designation", e.designation],
    [MapPin, "Work Location", e.workLocation], [CalendarDays, "Date of Joining", e.dateOfJoining ? new Date(e.dateOfJoining).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : null], [Mail, "Official Email", e.officialEmail],
  ];
  return <div className="people-verified" role="status">
    <p className="people-badge"><BadgeCheck />Verified Employee</p>
    <h3>{e.name}</h3>
    <table><tbody>{rows.filter(([, , v]) => v).map(([I, l, v]) => <tr key={l}><th><I />{l}</th><td>{v}</td></tr>)}</tbody></table>
  </div>;
}

export function TeamProfile({ member: p }: { member: TeamMember }) {
  const [first, ...rest] = p.name.split(" ");
  const rows: [typeof IdCard, string, string][] = [[IdCard, "Employee ID", p.employeeId], [Building2, "Department", p.department], [UserRound, "Designation", p.designation], [MapPin, "Work Location", p.location], [Users, "Reporting To", p.reportingTo]];
  return <><SiteHeader /><main className="investor-page people-page">
    <div className="page-shell people-section">
      <nav className="investor-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><span>›</span><Link to="/our-team">Our Team</Link><span>›</span><b>Employee Profile</b></nav>
      <p className="investor-eyebrow">Employee Profile</p>
      <h1>{first} <em>{rest.join(" ")}</em></h1><h2 className="people-sub">{p.designation}</h2><p className="people-lead">{p.department}</p>
      <section className="people-employee">
        <div className="people-profile-photo"><Portrait index={p.portrait} name={p.name} large /></div>
        <div className="people-card-box"><h3><ClipboardList />Employee Details</h3><table><tbody>{rows.map(([I, l, v]) => <tr key={l}><th><I />{l}</th><td>{v}</td></tr>)}</tbody></table>
          <p className="people-note"><ShieldCheck />To confirm this person works with us, use <Link to="/our-team">Verify Our Employee</Link> with their Employee ID and Code.</p></div>
      </section>
      <dl className="people-facts">{[[Building2, "Department", p.department], [Users, "Team", p.team], [MapPin, "Work Location", p.location]].map(([I, l, v]) => { const Icon = I as typeof Users; return <div key={String(l)}><Icon /><dt>{String(l)}</dt><dd>{String(v)}</dd></div>; })}</dl>
      <div className="people-two">
        <section className="people-card-box"><h3><ClipboardList />Role & Responsibilities</h3><ul className="people-bullets">{p.responsibilities.map((r) => <li key={r}>{r}</li>)}</ul></section>
        <section className="people-card-box"><h3><BarChart3 />Skills & Expertise</h3><div className="people-pills">{p.skills.map((s) => <span key={s}>{s}</span>)}</div></section>
        <section className="people-card-box"><h3><GraduationCap />Education</h3><p><b>{p.education.degree}</b><br />{p.education.school}</p></section>
        <section className="people-card-box"><h3><Globe />Languages</h3><div className="people-pills">{p.languages.map((s) => <span key={s}>{s}</span>)}</div></section>
      </div>
      <Button asChild variant="outline" className="mt-8"><Link to="/our-team"><ArrowLeft />Back to Team Members</Link></Button>
    </div>
  </main><SiteFooter /></>;
}

export { team };
