import { describe, expect, it } from "vitest";
import {
  calculateDimensionalWeightDivisorCalculator,
  dimensionalWeightDivisorCalculatorExample,
  runDimensionalWeightDivisorCalculator,
} from "./tool.js";

describe("dimensional-weight-divisor-calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runDimensionalWeightDivisorCalculator(
        dimensionalWeightDivisorCalculatorExample.input,
      ),
    ).toEqual({
      ok: true,
      output: dimensionalWeightDivisorCalculatorExample.output,
    });
  });

  it("applies a road divisor of 3000 when supplied", () => {
    const result = runDimensionalWeightDivisorCalculator({
      lengthCm: 100,
      widthCm: 100,
      heightCm: 60,
      volumetricDivisorCm3PerKg: 3000,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.volumetricWeightKg as number).toBe(200);
  });
  it("rejects a non-positive divisor", () => {
    expect(
      runDimensionalWeightDivisorCalculator({
        lengthCm: 60,
        widthCm: 40,
        heightCm: 40,
        volumetricDivisorCm3PerKg: 0,
      }).ok,
    ).toBe(false);
  });
  it("rejects overflowing volume", () => {
    expect(() =>
      calculateDimensionalWeightDivisorCalculator({
        heightCm: Number.MAX_VALUE,
        lengthCm: Number.MAX_VALUE,
        widthCm: 2,
      }),
    ).toThrow("outside the representable range");
  });
});
