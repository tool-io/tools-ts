import { expect, it } from "vitest";
import tool, {
  calculateWorldbuildingHistoryTimeline,
  worldbuildingHistoryTimelineExample as example,
} from "./tool.js";
import { fictionCraftContractTests } from "../m250-fiction-craft-testing.js";
fictionCraftContractTests(tool, calculateWorldbuildingHistoryTimeline, example);
it("reserves all slack for a forced leap-year predecessor chain", () => {
  const r = tool.execute({
    ...example.input,
    startDate: "0000-02-28",
    endDate: "0000-03-01",
    minimumPredecessorGapDays: 2,
  });
  if (!r.ok) throw new Error("Expected early Gregorian dates");
  expect(r.output.events.map((e) => e.date)).toEqual([
    "0000-02-28",
    "0000-03-01",
  ]);
  expect(r.output.predecessorGaps[0].days).toBe(2);
});
it("rejects cycles, insufficient calendar slack, invalid dates and oversized sets", () => {
  expect(
    tool.execute({ ...example.input, minimumPredecessorGapDays: 4 }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ code: "infeasible_timeline" }] },
  });
  expect(
    tool.execute({ ...example.input, startDate: "2024-02-30" }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ code: "invalid_calendar_date" }] },
  });
  expect(
    tool.execute({
      ...example.input,
      events: [{ id: "loop", text: "loop", predecessorIds: ["loop"] }],
    }),
  ).toMatchObject({ ok: false, error: { issues: [{ code: "cyclic_graph" }] } });
  expect(
    tool.execute({
      ...example.input,
      events: Array(33).fill(example.input.events[0]),
    }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ code: "invalid_field", field: "events" }] },
  });
});
