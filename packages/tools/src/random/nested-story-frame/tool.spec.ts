import {
  runNestedStoryFrame as runFromIndex,
  example as exampleFromIndex,
} from "./index.js";
import { expect, it } from "vitest";
import index from "./index.js";
import tool, {
  calculateNestedStoryFrame as calculate,
  nestedStoryFrameExample as example,
} from "./tool.js";
import { narrativeContract } from "../m500b-narrative-spec-support.js";
narrativeContract(tool, example, calculate, index);
it("lightweight independent one-level balanced markers", () => {
  const result = calculate({ ...example.input, depth: 1 });
  if (!result.ok) throw new Error("success");
  expect(
    result.output.markers.map((m) => [m.kind, m.frameId, m.depth]),
  ).toEqual([
    ["enter", "mountain", 1],
    ["exit", "mountain", 1],
  ]);
});
it("lightweight depth and duplicate identity boundaries", () => {
  expect(calculate({ ...example.input, depth: 3 })).toMatchObject({
    ok: false,
    error: { issues: [{ field: "count", code: "infeasible_count" }] },
  });
  expect(
    calculate({
      ...example.input,
      frames: [example.input.frames[0], example.input.frames[0]],
    }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ field: "frames", code: "duplicate_entries" }] },
  });
});
it("lightweight named index runner and canonical export", () => {
  expect(exampleFromIndex).toEqual(example);
  expect(runFromIndex(exampleFromIndex.input)).toEqual({
    ok: true,
    output: exampleFromIndex.output,
  });
});
