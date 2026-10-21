import { describe, expect, it } from "vitest";
import { achievementPct, gaugeBand, needleAngle, visibleMembers } from "@/lib/target-gauge";

describe("target gauges", () => {
  it("measures achievement against the assigned target", () => {
    expect(achievementPct(75000, 100000)).toBe(75);
    expect(achievementPct(150000, 100000)).toBe(150);
    expect(achievementPct(5000, 0)).toBe(0);
  });

  it("swings the needle from -120° at 0% to +120° at 120%", () => {
    expect(needleAngle(0)).toBe(-120);
    expect(needleAngle(60)).toBe(0);
    expect(needleAngle(500)).toBe(120);
  });

  it("colours by band", () => {
    expect(gaugeBand(49)).toBe("low");
    expect(gaugeBand(50)).toBe("mid");
    expect(gaugeBand(80)).toBe("good");
    expect(gaugeBand(100)).toBe("over");
  });

  const links = [
    { user_id: "e1", team_leader_id: "tl", manager_id: "m" },
    { user_id: "e2", team_leader_id: "tl", manager_id: "m" },
    { user_id: "e3", team_leader_id: "tl2", manager_id: "m" },
    { user_id: "tl", team_leader_id: null, manager_id: "m" },
  ];
  const all = ["e1", "e2", "e3", "tl", "tl2", "m", "x"];

  it("shows an employee only their own target", () => {
    expect(visibleMembers("e1", links, all, false)).toEqual(["e1"]);
  });
  it("shows a team leader their team", () => {
    expect(visibleMembers("tl", links, all, false).sort()).toEqual(["e1", "e2", "tl"]);
  });
  it("shows a manager their whole team", () => {
    expect(visibleMembers("m", links, all, false).sort()).toEqual(["e1", "e2", "e3", "m", "tl"]);
  });
  it("shows admins everyone", () => {
    expect(visibleMembers("m", links, all, true)).toEqual(all);
  });
});
