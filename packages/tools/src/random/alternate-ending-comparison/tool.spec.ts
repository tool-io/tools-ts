import {
  runAlternateEndingComparison as runFromIndex,
  example as exampleFromIndex,
} from "./index.js";
import { expect, it } from "vitest";
import index from "./index.js";
import tool, {
  calculateAlternateEndingComparison as calculate,
  alternateEndingComparisonExample as example,
} from "./tool.js";
import { narrativeContract } from "../m500b-narrative-spec-support.js";
narrativeContract(tool, example, calculate, index);
it("lightweight independently retains shared consequence tags", () => {
  const result = calculate({
    ...example.input,
    endings: example.input.endings.map((e) => ({
      ...e,
      consequenceTags: ["choice"],
    })),
  });
  if (!result.ok) throw new Error("success");
  expect(result.output.comparison).toEqual([
    { tag: "choice", endingIds: ["return", "leave"] },
  ]);
});
it("lightweight exact comparison count and distinct ending identity", () => {
  expect(calculate({ ...example.input, count: 3 })).toMatchObject({
    ok: false,
    error: { issues: [{ field: "count", code: "infeasible_count" }] },
  });
  expect(calculate({ ...example.input, count: 1 })).toMatchObject({
    ok: false,
    error: { issues: [{ field: "count", code: "invalid_field" }] },
  });
});
it("lightweight named index runner and canonical export", () => {
  expect(exampleFromIndex).toEqual(example);
  expect(runFromIndex(exampleFromIndex.input)).toEqual({
    ok: true,
    output: exampleFromIndex.output,
  });
});
