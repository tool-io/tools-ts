import { describe, expect, it } from "vitest";
import {
  permutationsExample,
  calculatePermutations,
  runPermutations,
} from "./tool.js";

describe("list/permutations", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runPermutations(permutationsExample.input)).toEqual({
      ok: true,
      output: permutationsExample.output,
    });
  });
  it("rejects invalid input (empty_list)", () => {
    expect(runPermutations({ values: [] }).ok).toBe(false);
  });
  it("rejects invalid input (too_many_values)", () => {
    expect(runPermutations({ values: [1, 2, 3, 4, 5, 6, 7, 8] }).ok).toBe(
      false,
    );
  });
  it("yields 3! distinct orderings", () => {
    const result = runPermutations({ values: [1, 2, 3] });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.permutations).toHaveLength(6);
      expect(
        new Set(result.output.permutations.map((p) => p.join(","))).size,
      ).toBe(6);
    }
  });
});
