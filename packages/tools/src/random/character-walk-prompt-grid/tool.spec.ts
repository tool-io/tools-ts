import {
  runCharacterWalkPromptGrid as runFromIndex,
  example as exampleFromIndex,
} from "./index.js";
import { expect, it } from "vitest";
import index from "./index.js";
import tool, {
  calculateCharacterWalkPromptGrid as calculate,
  characterWalkPromptGridExample as example,
} from "./tool.js";
import { narrativeContract } from "../m500b-narrative-spec-support.js";
narrativeContract(tool, example, calculate, index);
it("lightweight independently covers Cartesian board without duplicates", () => {
  const result = calculate({ ...example.input, rows: 2 });
  if (!result.ok) throw new Error("success");
  expect(
    new Set(result.output.grid.flat().map((c) => c.movement + "/" + c.goal))
      .size,
  ).toBe(4);
  expect(result.output.grid[1].map((c) => c.row)).toEqual([2, 2]);
});
it("lightweight preflights cells and finite population overdraw", () => {
  expect(calculate({ ...example.input, rows: 16, columns: 16 })).toMatchObject({
    ok: false,
    error: { issues: [{ field: "rows", code: "resource_limit_exceeded" }] },
  });
  expect(calculate({ ...example.input, rows: 3 })).toMatchObject({
    ok: false,
    error: { issues: [{ field: "count", code: "infeasible_count" }] },
  });
});
it("lightweight named index runner and canonical export", () => {
  expect(exampleFromIndex).toEqual(example);
  expect(runFromIndex(exampleFromIndex.input)).toEqual({
    ok: true,
    output: exampleFromIndex.output,
  });
});
