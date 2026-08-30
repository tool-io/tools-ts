import { describe, expect, it } from "vitest";
import {
  calculateSpecificGrowthRate,
  example,
  runSpecificGrowthRate,
} from "./tool.js";

describe("aquaculture/specific-growth-rate", () => {
  it("calculates the published example", () => {
    expect(calculateSpecificGrowthRate(example.input)).toEqual(example.output);
    expect(runSpecificGrowthRate(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runSpecificGrowthRate({
      ...example.input,
      initialWeightGrams: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("checks an independent value or domain boundary", () => {
    expect(
      calculateSpecificGrowthRate({
        initialWeightGrams: 100,
        finalWeightGrams: 200,
        elapsedDays: 10,
      }).specificGrowthRatePercentPerDay,
    ).toBeCloseTo(6.9314718, 6);
  });
});
