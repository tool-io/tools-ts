import { describe, expect, it } from "vitest";
import { runWeightedMean } from "./tool.js";
describe("Weighted Mean Calculator", () => {
  it("calculates a valid result", () => {
    expect(runWeightedMean({ values: [10, 20], weights: [1, 3] })).toEqual({
      ok: true,
      output: { weightedMean: 17.5 },
    });
  });
  it("rejects invalid input", () =>
    expect(runWeightedMean(null).ok).toBe(false));
});
