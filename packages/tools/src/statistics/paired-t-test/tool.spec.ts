import { describe, expect, it } from "vitest";
import { calculatePairedTTest } from "./tool.js";

describe("paired t-test", () => {
  it("calculates a matched-pairs statistic", () => {
    const result = calculatePairedTTest({
      first: [10, 12, 9, 11, 13],
      second: [8, 11, 10, 9, 12],
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.meanDifference).toBe(1);
      expect(result.output.tStatistic).toBeCloseTo(1.82574185835);
    }
  });

  it("rejects samples of different lengths", () => {
    expect(calculatePairedTTest({ first: [1, 2], second: [1] })).toMatchObject({
      error: { code: "invalid_input" },
      ok: false,
    });
  });
});
