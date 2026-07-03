import { describe, expect, it } from "vitest";
import { runCumulativeSum } from "./tool.js";
describe("Cumulative Sum Calculator", () => {
  it("calculates a valid result", () => {
    expect(runCumulativeSum({ values: [2, 3, 4] })).toEqual({
      ok: true,
      output: { sums: [2, 5, 9] },
    });
  });
  it("rejects invalid input", () =>
    expect(runCumulativeSum(null).ok).toBe(false));
});
