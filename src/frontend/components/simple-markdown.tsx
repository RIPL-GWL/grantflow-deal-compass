/** Minimal renderer for AI text: headings, bullets, paragraphs, bold. */
function inline(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((p, i) => (p.startsWith("**") && p.endsWith("**") ? <strong key={i}>{p.slice(2, -2)}</strong> : p));
}
export function SimpleMarkdown({ text }: { text: string }) {
  const out: React.ReactNode[] = [];
  let list: string[] = [];
  const flush = () => { if (list.length) { out.push(<ul key={out.length} className="list-disc pl-5">{list.map((l, i) => <li key={i}>{inline(l)}</li>)}</ul>); list = []; } };
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (/^[-*•]\s+/.test(line) || /^\d+\.\s+/.test(line)) { list.push(line.replace(/^([-*•]|\d+\.)\s+/, "")); continue; }
    flush();
    if (!line) continue;
    const h = line.match(/^#{1,4}\s+(.*)/);
    out.push(h ? <h4 key={out.length} className="mt-3 font-semibold">{inline(h[1] ?? "")}</h4> : <p key={out.length}>{inline(line)}</p>);
  }
  flush();
  return <div className="space-y-2">{out}</div>;
}
