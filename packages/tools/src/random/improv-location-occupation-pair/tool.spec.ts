import {
  runImprovLocationOccupationPair as runFromIndex,
  example as exampleFromIndex,
} from "./index.js";
import { expect, it } from "vitest";
import index from "./index.js";
import tool, {
  calculateImprovLocationOccupationPair as calculate,
  improvLocationOccupationPairExample as example,
} from "./tool.js";
import { narrativeContract } from "../m500b-narrative-spec-support.js";
narrativeContract(tool, example, calculate, index);
it("lightweight independent no-repeat singleton and occurrence count", () => {
  const result = calculate({
    ...example.input,
    count: 1,
    repetition: "forbid",
  });
  if (!result.ok) throw new Error("success");
  expect(result.output.pairUsage).toEqual([
    { locationId: "dock", occupationId: "porter", count: 1 },
  ]);
});
it("lightweight repetition and tone infeasibility", () => {
  expect(calculate({ ...example.input, repetition: "forbid" })).toMatchObject({
    ok: false,
    error: { issues: [{ field: "count", code: "infeasible_count" }] },
  });
  expect(calculate({ ...example.input, tone: "somber" })).toMatchObject({
    ok: false,
    error: { issues: [{ field: "tone", code: "infeasible_pairing" }] },
  });
});
it("lightweight named index runner and canonical export", () => {
  expect(exampleFromIndex).toEqual(example);
  expect(runFromIndex(exampleFromIndex.input)).toEqual({
    ok: true,
    output: exampleFromIndex.output,
  });
});
