import { describe, expect, it } from "vitest";
import {
  calculateCoefficientOfVariation,
  coefficientOfVariationExample,
  runCoefficientOfVariation,
} from "./tool.js";

describe("Coefficient of Variation Calculator", () => {
  it.each([
    [[1, 2, 3, 4, 5], (Math.sqrt(2) / 3) * 100],
    [[10, 20, 30], (Math.sqrt(200 / 3) / 20) * 100],
    [[5, 5, 5, 5], 0],
  ])("calculates the population coefficient", (values, expected) => {
    expect(calculateCoefficientOfVariation(values)).toBeCloseTo(expected, 12);
  });

  it("rejects empty and zero-mean input", () => {
    expect(calculateCoefficientOfVariation([])).toBeNull();
    expect(calculateCoefficientOfVariation([0, 0, 0])).toBeNull();
    expect(calculateCoefficientOfVariation([-1, 0, 1])).toBeNull();
  });

  it("publishes an executable example", () =>
    expect(
      runCoefficientOfVariation(coefficientOfVariationExample.input),
    ).toEqual({
      ok: true,
      output: coefficientOfVariationExample.output,
    }));
});
