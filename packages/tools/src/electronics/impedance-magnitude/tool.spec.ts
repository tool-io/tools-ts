import { describe, expect, it } from "vitest";
import {
  calculateImpedanceMagnitude,
  impedanceMagnitudeExample,
  runImpedanceMagnitude,
} from "./tool.js";

describe("impedance magnitude calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runImpedanceMagnitude(impedanceMagnitudeExample.input)).toEqual({
      ok: true,
      output: impedanceMagnitudeExample.output,
    });
  });

  it("reduces to pure resistance at resonance", () => {
    // L * C = 1e-8 -> f0 = 15915.494... Hz where XL = XC.
    const atResonance = calculateImpedanceMagnitude({
      capacitanceF: 1e-6,
      frequencyHz: 1 / (2 * Math.PI * Math.sqrt(0.01 * 1e-6)),
      inductanceH: 0.01,
      resistanceOhms: 50,
    }).impedanceOhms;
    expect(atResonance).toBeCloseTo(50, 9);
    expect(
      calculateImpedanceMagnitude({
        capacitanceF: 1e-6,
        frequencyHz: 1000,
        inductanceH: 0,
        resistanceOhms: 40,
      }).impedanceOhms,
    ).toBeGreaterThan(40);
  });

  it("rejects invalid inputs through execution", () => {
    for (const bad of [
      {
        capacitanceF: 0,
        frequencyHz: 1000,
        inductanceH: 0.01,
        resistanceOhms: 50,
      },
      {
        capacitanceF: 1e-6,
        frequencyHz: -1000,
        inductanceH: 0.01,
        resistanceOhms: 50,
      },
      {
        capacitanceF: 1e-6,
        frequencyHz: 1000,
        inductanceH: 0.01,
        resistanceOhms: -50,
      },
    ])
      expect(runImpedanceMagnitude(bad).ok).toBe(false);
  });
});
