import { describe, expect, it } from "vitest";
import {
  calculateDailyGrowthCoefficient,
  example,
  runDailyGrowthCoefficient,
} from "./tool.js";

describe("aquaculture/daily-growth-coefficient", () => {
  it("calculates the published example", () => {
    expect(calculateDailyGrowthCoefficient(example.input)).toEqual(
      example.output,
    );
    expect(runDailyGrowthCoefficient(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runDailyGrowthCoefficient({
      ...example.input,
      initialWeightGrams: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
});
