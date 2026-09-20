import {
  runSceneDurationLadder as runFromIndex,
  example as exampleFromIndex,
} from "./index.js";
import { expect, it } from "vitest";
import index from "./index.js";
import tool, {
  calculateSceneDurationLadder as calculate,
  sceneDurationLadderExample as example,
} from "./tool.js";
import { narrativeContract } from "../m500b-narrative-spec-support.js";
narrativeContract(tool, example, calculate, index);
it("lightweight independent increasing ladder conserves total", () => {
  const result = calculate({ ...example.input, direction: "increasing" });
  if (!result.ok) throw new Error("success");
  expect(
    result.output.scenes.map((s) => [s.seconds, s.startSecond, s.endSecond]),
  ).toEqual([
    [15, 0, 15],
    [25, 15, 40],
  ]);
});
it("lightweight session and integer arithmetic boundaries", () => {
  expect(
    calculate({ ...example.input, sessionLimitSeconds: 39 }),
  ).toMatchObject({
    ok: false,
    error: {
      issues: [
        { field: "sessionLimitSeconds", code: "session_limit_exceeded" },
      ],
    },
  });
  expect(
    calculate({ ...example.input, baseSeconds: Number.MAX_SAFE_INTEGER }),
  ).toMatchObject({
    ok: false,
    error: {
      issues: [{ field: "incrementSeconds", code: "unsafe_aggregate" }],
    },
  });
});
it("lightweight named index runner and canonical export", () => {
  expect(exampleFromIndex).toEqual(example);
  expect(runFromIndex(exampleFromIndex.input)).toEqual({
    ok: true,
    output: exampleFromIndex.output,
  });
});
