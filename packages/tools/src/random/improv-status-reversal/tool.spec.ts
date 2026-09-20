import {
  runImprovStatusReversal as runFromIndex,
  example as exampleFromIndex,
} from "./index.js";
import { expect, it } from "vitest";
import index from "./index.js";
import tool, {
  calculateImprovStatusReversal as calculate,
  improvStatusReversalExample as example,
} from "./tool.js";
import { narrativeContract } from "../m500b-narrative-spec-support.js";
narrativeContract(tool, example, calculate, index);
it("lightweight independent two-scene cumulative clock", () => {
  const result = calculate({
    ...example.input,
    sceneCount: 2,
    segmentSeconds: 7,
  });
  if (!result.ok) throw new Error("success");
  expect(result.output.totalSeconds).toBe(28);
  expect(
    result.output.scenes[1].segments.map((s) => [s.startSecond, s.endSecond]),
  ).toEqual([
    [14, 21],
    [21, 28],
  ]);
  expect(result.output.rounds).toEqual([[1, 2]]);
});
it("lightweight contrasting cues and safe timing aggregates", () => {
  expect(
    calculate({
      ...example.input,
      cuePairs: [{ id: "same", high: "x", low: "x" }],
    }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ field: "cuePairs", code: "identical_status_cues" }] },
  });
  expect(
    calculate({ ...example.input, segmentSeconds: Number.MAX_SAFE_INTEGER }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ field: "segmentSeconds", code: "unsafe_aggregate" }] },
  });
});
it("lightweight named index runner and canonical export", () => {
  expect(exampleFromIndex).toEqual(example);
  expect(runFromIndex(exampleFromIndex.input)).toEqual({
    ok: true,
    output: exampleFromIndex.output,
  });
});
