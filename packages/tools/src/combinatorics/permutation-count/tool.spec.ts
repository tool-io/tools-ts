import { describe, expect, it } from "vitest";
import { runPermutationCount } from "./tool.js";
describe("Permutation Count Calculator", () => {
  it("calculates a valid result", () =>
    expect(runPermutationCount({ n: 5, k: 2 })).toEqual({
      ok: true,
      output: { permutations: 20 },
    }));
  it("rejects invalid input", () =>
    expect(runPermutationCount(null).ok).toBe(false));
});
