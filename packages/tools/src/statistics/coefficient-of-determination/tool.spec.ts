import { describe, expect, it } from "vitest";
import {
  calculateCoefficientOfDetermination,
  coefficientOfDeterminationExample,
  runCoefficientOfDetermination,
} from "./tool.js";

describe("Coefficient of Determination Calculator", () => {
  it("calculates R²", () => {
    expect(
      calculateCoefficientOfDetermination([3, -0.5, 2, 7], [2.5, 0, 2, 8]),
    ).toBeCloseTo(0.948608137, 9);
    expect(calculateCoefficientOfDetermination([1, 2, 3], [1, 2, 3])).toBe(1);
    expect(
      calculateCoefficientOfDetermination([1, 2, 3], [3, 2, 1]),
    ).toBeLessThan(0);
  });

  it("rejects unequal and constant observed values", () => {
    expect(calculateCoefficientOfDetermination([1, 2], [1])).toBeNull();
    expect(calculateCoefficientOfDetermination([2, 2], [2, 2])).toBeNull();
  });

  it("publishes an executable example", () =>
    expect(
      runCoefficientOfDetermination(coefficientOfDeterminationExample.input),
    ).toEqual({
      ok: true,
      output: coefficientOfDeterminationExample.output,
    }));
});
