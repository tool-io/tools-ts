import { describe, expect, it } from "vitest";
import {
  combinationsExample,
  calculateCombinations,
  runCombinations,
} from "./tool.js";

describe("list/combinations", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runCombinations(combinationsExample.input)).toEqual({
      ok: true,
      output: combinationsExample.output,
    });
  });
  it("rejects invalid input (invalid_size)", () => {
    expect(runCombinations({ values: [1, 2, 3], size: 4 }).ok).toBe(false);
  });
  it("rejects invalid input (empty_list)", () => {
    expect(runCombinations({ values: [], size: 0 }).ok).toBe(false);
  });
  it("yields six ordered pairs from four values", () => {
    const result = runCombinations({ values: [1, 2, 3, 4], size: 2 });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.combinations).toEqual([
        [1, 2],
        [1, 3],
        [1, 4],
        [2, 3],
        [2, 4],
        [3, 4],
      ]);
  });
});
