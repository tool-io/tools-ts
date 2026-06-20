import { describe, expect, it } from "vitest";
import { calculateTwoSampleTTest } from "./tool.js";

describe("two-sample t-test", () => {
  it("calculates Welch's statistic by default", () => {
    const result = calculateTwoSampleTTest({
      first: [1, 2, 3],
      second: [4, 5, 6],
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.tStatistic).toBeCloseTo(-3.67423461417);
      expect(result.output.degreesOfFreedom).toBeCloseTo(4);
    }
  });

  it("supports the equal-variance calculation", () => {
    const result = calculateTwoSampleTTest({
      equalVariance: true,
      first: "1, 2, 3",
      second: "4, 5, 6",
    });
    expect(result).toMatchObject({ ok: true, output: { degreesOfFreedom: 4 } });
  });

  it("rejects undersized samples", () => {
    expect(calculateTwoSampleTTest({ first: [1], second: [2] })).toMatchObject({
      error: { code: "invalid_input" },
      ok: false,
    });
  });
});
