import {
  runDanceCanonEntryPlan as runFromIndex,
  example as exampleFromIndex,
} from "./index.js";
import { expect, it } from "vitest";
import index from "./index.js";
import tool, {
  calculateDanceCanonEntryPlan as calculate,
  danceCanonEntryPlanExample as example,
} from "./tool.js";
import { narrativeContract } from "../m500b-narrative-spec-support.js";
narrativeContract(tool, example, calculate, index);
it("lightweight independent touching intervals exit before entry", () => {
  const result = calculate({
    ...example.input,
    offsets: [0, 4],
    availableCounts: 8,
  });
  if (!result.ok) throw new Error("success");
  expect(
    result.output.events.filter((e) => e.count === 4).map((e) => e.kind),
  ).toEqual(["exit", "enter"]);
  expect(result.output.peakActiveGroups).toBe(1);
  expect(result.output.latestEndCount).toBe(8);
});
it("lightweight offset distinctness and full-motif fit", () => {
  expect(calculate({ ...example.input, offsets: [0, 0] })).toMatchObject({
    ok: false,
    error: { issues: [{ field: "offsets", code: "invalid_offsets" }] },
  });
  expect(calculate({ ...example.input, availableCounts: 5 })).toMatchObject({
    ok: false,
    error: { issues: [{ field: "offsets", code: "infeasible_canon" }] },
  });
});
it("lightweight named index runner and canonical export", () => {
  expect(exampleFromIndex).toEqual(example);
  expect(runFromIndex(exampleFromIndex.input)).toEqual({
    ok: true,
    output: exampleFromIndex.output,
  });
});
