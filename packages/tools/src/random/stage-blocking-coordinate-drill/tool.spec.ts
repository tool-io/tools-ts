import {
  runStageBlockingCoordinateDrill as runFromIndex,
  example as exampleFromIndex,
} from "./index.js";
import { expect, it } from "vitest";
import index from "./index.js";
import tool, {
  calculateStageBlockingCoordinateDrill as calculate,
  stageBlockingCoordinateDrillExample as example,
} from "./tool.js";
import { narrativeContract } from "../m500b-narrative-spec-support.js";
narrativeContract(tool, example, calculate, index);
it("lightweight independent context sequence moves both performers and normalizes zero", () => {
  const { seed: _seed, ...input } = example.input;
  let i = 0;
  const draws = [0, 0, 0.9, 0];
  const result = calculate(
    { ...input, marks: input.marks.map((m) => ({ ...m, y: -0 })) },
    { random: () => draws[i++] ?? 0 },
  );
  if (!result.ok) throw new Error("success");
  expect(
    result.output.cues.map((c) => c.assignments.map((a) => a.toMarkId)),
  ).toEqual([
    ["l", "r"],
    ["r", "l"],
  ]);
  expect(Object.is(result.output.cues[0].assignments[0].y, -0)).toBe(false);
});
it("lightweight occupancy and product bounds before generation", () => {
  expect(
    calculate({
      ...example.input,
      marks: example.input.marks.map((m) => ({ ...m, capacity: 0 })),
    }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ field: "marks", code: "infeasible_capacity" }] },
  });
  expect(
    calculate({
      ...example.input,
      performers: Array.from({ length: 5 }, (_, i) => "p" + i),
      cueCount: 32,
    }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ field: "cueCount", code: "resource_limit_exceeded" }] },
  });
});
it("lightweight named index runner and canonical export", () => {
  expect(exampleFromIndex).toEqual(example);
  expect(runFromIndex(exampleFromIndex.input)).toEqual({
    ok: true,
    output: exampleFromIndex.output,
  });
});
