import {
  runStageTableauComposition as runFromIndex,
  example as exampleFromIndex,
} from "./index.js";
import { expect, it } from "vitest";
import index from "./index.js";
import tool, {
  calculateStageTableauComposition as calculate,
  stageTableauCompositionExample as example,
} from "./tool.js";
import { narrativeContract } from "../m500b-narrative-spec-support.js";
narrativeContract(tool, example, calculate, index);
it("lightweight independent one-zone occupancy includes all performers", () => {
  const result = calculate({
    ...example.input,
    zones: [{ id: "left", capacity: 2 }],
    poses: [example.input.poses[0]],
  });
  if (!result.ok) throw new Error("success");
  expect(result.output.occupancy).toEqual([
    { zoneId: "left", count: 2, capacity: 2 },
  ]);
  expect(result.output.assignments.every((a) => a.zoneId === "left")).toBe(
    true,
  );
});
it("lightweight capacity and unreachable pose boundaries", () => {
  expect(
    calculate({
      ...example.input,
      zones: example.input.zones.map((z) => ({ ...z, capacity: 0 })),
    }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ field: "zones", code: "infeasible_capacity" }] },
  });
  expect(
    calculate({ ...example.input, poses: [example.input.poses[0]] }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ field: "poses", code: "infeasible_tableau" }] },
  });
});
it("lightweight named index runner and canonical export", () => {
  expect(exampleFromIndex).toEqual(example);
  expect(runFromIndex(exampleFromIndex.input)).toEqual({
    ok: true,
    output: exampleFromIndex.output,
  });
});
