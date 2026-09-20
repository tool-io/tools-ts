import {
  runPropOnlySceneChallenge as runFromIndex,
  example as exampleFromIndex,
} from "./index.js";
import { expect, it } from "vitest";
import index from "./index.js";
import tool, {
  calculatePropOnlySceneChallenge as calculate,
  propOnlySceneChallengeExample as example,
} from "./tool.js";
import { narrativeContract } from "../m500b-narrative-spec-support.js";
narrativeContract(tool, example, calculate, index);
it("lightweight independent singleton focus schedule", () => {
  const result = calculate({ ...example.input, propCount: 1, turnSeconds: 13 });
  if (!result.ok) throw new Error("success");
  expect(result.output.focusTurns).toEqual([
    { propId: "box", startSecond: 0, endSecond: 13 },
  ]);
  expect(result.output.noAdditionalProps).toBe(true);
});
it("lightweight prop count and duplicate boundaries", () => {
  expect(calculate({ ...example.input, propCount: 3 })).toMatchObject({
    ok: false,
    error: { issues: [{ field: "count", code: "infeasible_count" }] },
  });
  expect(
    calculate({
      ...example.input,
      props: [example.input.props[0], example.input.props[0]],
    }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ field: "props", code: "duplicate_entries" }] },
  });
});
it("lightweight named index runner and canonical export", () => {
  expect(exampleFromIndex).toEqual(example);
  expect(runFromIndex(exampleFromIndex.input)).toEqual({
    ok: true,
    output: exampleFromIndex.output,
  });
});
