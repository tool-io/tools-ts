import {
  runSilentSceneConstraint as runFromIndex,
  example as exampleFromIndex,
} from "./index.js";
import { expect, it } from "vitest";
import index from "./index.js";
import tool, {
  calculateSilentSceneConstraint as calculate,
  silentSceneConstraintExample as example,
} from "./tool.js";
import { narrativeContract } from "../m500b-narrative-spec-support.js";
narrativeContract(tool, example, calculate, index);
it("lightweight independent partial final round", () => {
  const result = calculate({ ...example.input, count: 3, seconds: 9 });
  if (!result.ok) throw new Error("success");
  expect(result.output.rounds).toEqual([[1, 2], [3]]);
  expect(result.output.totalSeconds).toBe(27);
  expect(result.output.cards.every((c) => !c.spokenWordsAllowed)).toBe(true);
});
it("lightweight scene bank and clock bounds", () => {
  expect(calculate({ ...example.input, constraints: [] })).toMatchObject({
    ok: false,
    error: { issues: [{ field: "constraints", code: "invalid_field" }] },
  });
  expect(
    calculate({ ...example.input, seconds: Number.MAX_SAFE_INTEGER }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ field: "seconds", code: "unsafe_aggregate" }] },
  });
});
it("lightweight named index runner and canonical export", () => {
  expect(exampleFromIndex).toEqual(example);
  expect(runFromIndex(exampleFromIndex.input)).toEqual({
    ok: true,
    output: exampleFromIndex.output,
  });
});
