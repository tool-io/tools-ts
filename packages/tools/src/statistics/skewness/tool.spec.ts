import { describe, expect, it } from "vitest";
import {
  calculateSampleSkewness,
  runSkewness,
  skewnessExample,
} from "./tool.js";

describe("Sample Skewness Calculator", () => {
  it.each([
    [1, 2, 3, 4, 5],
    [10, 20, 30],
    [-1, -2, -3, -4, -5],
  ])("returns zero for a symmetric dataset", (...values) => {
    expect(calculateSampleSkewness(values)).toBeCloseTo(0, 12);
  });

  it("calculates a positively skewed dataset", () =>
    expect(calculateSampleSkewness([1, 1, 2, 8])).toBeGreaterThan(0));

  it("rejects short, constant, and non-finite datasets", () => {
    expect(calculateSampleSkewness([1, 2])).toBeNull();
    expect(calculateSampleSkewness([2, 2, 2])).toBeNull();
    expect(calculateSampleSkewness([1, 2, Number.NaN])).toBeNull();
  });

  it("publishes an executable example", () =>
    expect(runSkewness(skewnessExample.input)).toEqual({
      ok: true,
      output: skewnessExample.output,
    }));
});
