import { describe, expect, it } from "vitest";
import {
  calculateHotCarrierDegradationRate,
  hotCarrierDegradationRateExample,
  runHotCarrierDegradationRate,
} from "./tool.js";

describe("Hot Carrier Degradation Rate Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runHotCarrierDegradationRate(hotCarrierDegradationRateExample.input),
    ).toEqual({ ok: true, output: hotCarrierDegradationRateExample.output });
  });

  it("evaluates the calibrated coefficient times ratio to exponent N", () => {
    expect(
      calculateHotCarrierDegradationRate({
        coefficientPercentPerYear: 10,
        exponentN: 2,
        substrateToDrainCurrentRatio: 0.2,
      }).degradationPercentPerYear,
    ).toBeCloseTo(0.4, 14);
  });

  it("returns zero for a zero ratio or zero calibrated coefficient", () => {
    expect(
      calculateHotCarrierDegradationRate({
        coefficientPercentPerYear: 2,
        exponentN: 3,
        substrateToDrainCurrentRatio: 0,
      }).degradationPercentPerYear,
    ).toBe(0);
    expect(
      calculateHotCarrierDegradationRate({
        coefficientPercentPerYear: 0,
        exponentN: 3,
        substrateToDrainCurrentRatio: 0.5,
      }).degradationPercentPerYear,
    ).toBe(0);
  });

  it("supports positive fractional exponents", () => {
    expect(
      calculateHotCarrierDegradationRate({
        coefficientPercentPerYear: 1,
        exponentN: 0.5,
        substrateToDrainCurrentRatio: 4,
      }).degradationPercentPerYear,
    ).toBe(2);
  });

  it("rejects invalid or missing model parameters", () => {
    for (const input of [
      {
        coefficientPercentPerYear: 1,
        exponentN: 3,
        substrateToDrainCurrentRatio: -0.5,
      },
      {
        coefficientPercentPerYear: -1,
        exponentN: 3,
        substrateToDrainCurrentRatio: 0.5,
      },
      {
        coefficientPercentPerYear: 1,
        exponentN: 0,
        substrateToDrainCurrentRatio: 0.5,
      },
      { substrateToDrainCurrentRatio: 0.5 },
    ])
      expect(runHotCarrierDegradationRate(input).ok).toBe(false);
  });
});
