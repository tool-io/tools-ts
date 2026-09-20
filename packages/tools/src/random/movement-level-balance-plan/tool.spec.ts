import {
  runMovementLevelBalancePlan as runFromIndex,
  example as exampleFromIndex,
} from "./index.js";
import { expect, it } from "vitest";
import index from "./index.js";
import tool, {
  calculateMovementLevelBalancePlan as calculate,
  movementLevelBalancePlanExample as example,
} from "./tool.js";
import { narrativeContract } from "../m500b-narrative-spec-support.js";
narrativeContract(tool, example, calculate, index);
it("lightweight independent unequal quota multiset retains every occurrence", () => {
  const result = calculate({ ...example.input, lowQuota: 2, phraseCount: 3 });
  if (!result.ok) throw new Error("success");
  expect(result.output.phrases.filter((p) => p.level === "low")).toHaveLength(
    2,
  );
  expect(result.output.lowMidHighCounts).toEqual([2, 0, 1]);
  expect(result.output.balanceSpread).toBe(2);
  expect(result.output.phrases[2].remainingQuotas).toEqual([0, 0, 0]);
});
it("lightweight missing level and exact quota boundaries", () => {
  expect(
    calculate({ ...example.input, midQuota: 1, phraseCount: 3 }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ field: "movements", code: "missing_level" }] },
  });
  expect(calculate({ ...example.input, phraseCount: 3 })).toMatchObject({
    ok: false,
    error: { issues: [{ field: "phraseCount", code: "quota_mismatch" }] },
  });
});
it("lightweight named index runner and canonical export", () => {
  expect(exampleFromIndex).toEqual(example);
  expect(runFromIndex(exampleFromIndex.input)).toEqual({
    ok: true,
    output: exampleFromIndex.output,
  });
});
