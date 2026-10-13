import { describe, expect, it } from "vitest";
import { filterTeam, mentors, team } from "./data";
describe("people data", () => {
  it("every mentor and team member has a unique profile link", () => {
    expect(new Set(mentors.map((m) => m.slug)).size).toBe(mentors.length);
    expect(new Set(team.map((t) => t.slug)).size).toBe(team.length);
  });
  it("public team data never contains employee codes", () => {
    expect(JSON.stringify(team)).not.toContain("7F3A9");
  });
  it("filters team by department", () => {
    expect(filterTeam("", "Finance").map((t) => t.name)).toEqual(["Sneha Jain"]);
  });
});
