import {
  runImprovEmotionTransition as runFromIndex,
  example as exampleFromIndex,
} from "./index.js";
import { expect, it } from "vitest";
import index from "./index.js";
import tool, {
  calculateImprovEmotionTransition as calculate,
  improvEmotionTransitionExample as example,
} from "./tool.js";
import { narrativeContract } from "../m500b-narrative-spec-support.js";
narrativeContract(tool, example, calculate, index);
it("lightweight independent repeated path accumulates unequal holds", () => {
  const result = calculate({
    ...example.input,
    segmentCount: 3,
    transitions: [
      ...example.input.transitions,
      { id: "settle", from: "wonder", to: "calm", cue: "Breathe" },
    ],
  });
  if (!result.ok) throw new Error("success");
  expect(result.output.segments.map((s) => [s.startCount, s.endCount])).toEqual(
    [
      [0, 2],
      [2, 5],
      [5, 7],
    ],
  );
});
it("lightweight absent path and self-edge diagnostics", () => {
  expect(calculate({ ...example.input, segmentCount: 3 })).toMatchObject({
    ok: false,
    error: {
      issues: [{ field: "transitions", code: "infeasible_emotion_path" }],
    },
  });
  expect(
    calculate({
      ...example.input,
      transitions: [{ id: "x", from: "calm", to: "calm", cue: "x" }],
    }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ field: "transitions", code: "self_transition" }] },
  });
});
it("lightweight named index runner and canonical export", () => {
  expect(exampleFromIndex).toEqual(example);
  expect(runFromIndex(exampleFromIndex.input)).toEqual({
    ok: true,
    output: exampleFromIndex.output,
  });
});
