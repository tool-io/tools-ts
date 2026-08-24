import { describe, expect, it } from "vitest";
import {
  BOLTZMANN_EV_PER_K,
  calculateElectromigrationBlackEquation,
  electromigrationBlackEquationExample,
  runElectromigrationBlackEquation,
} from "./tool.js";

describe("Black Equation MTTF Calculator", () => {
  it("reproduces its canonical example exactly with defaults", () => {
    expect(
      runElectromigrationBlackEquation(
        electromigrationBlackEquationExample.input,
      ),
    ).toEqual({
      ok: true,
      output: electromigrationBlackEquationExample.output,
    });
  });

  it("uses the stated Boltzmann constant and inverse current-density law", () => {
    expect(BOLTZMANN_EV_PER_K).toBe(8.617333262e-5);
    const high = calculateElectromigrationBlackEquation({
      blackPrefactor: 1_000_000,
      currentDensityAPerCm2: 1_000_000,
      temperatureKelvin: 378,
    });
    const low = calculateElectromigrationBlackEquation({
      blackPrefactor: 1_000_000,
      currentDensityAPerCm2: 500_000,
      temperatureKelvin: 378,
    });
    expect(low.medianTimeToFailureHours).toBe(
      4 * high.medianTimeToFailureHours,
    );
  });

  it("accepts explicit exponent and activation energy", () => {
    expect(
      calculateElectromigrationBlackEquation({
        activationEnergyEv: 0.4,
        blackPrefactor: 1_000_000,
        currentDensityAPerCm2: 100_000,
        exponentN: 1,
        temperatureKelvin: 398,
      }),
    ).toEqual({ medianTimeToFailureHours: 1161725.9859558379 });
  });

  it("recovers a representable result when intermediate powers underflow", () => {
    expect(
      calculateElectromigrationBlackEquation({
        activationEnergyEv: 0.01,
        blackPrefactor: 1e300,
        currentDensityAPerCm2: 1e200,
        exponentN: 2,
        temperatureKelvin: 1000,
      }).medianTimeToFailureHours,
    ).toBeGreaterThan(0);
  });

  it.each([
    [
      "blackPrefactor",
      { blackPrefactor: 0, currentDensityAPerCm2: 1, temperatureKelvin: 378 },
    ],
    [
      "currentDensityAPerCm2",
      { blackPrefactor: 1, currentDensityAPerCm2: 0, temperatureKelvin: 378 },
    ],
    [
      "exponentN",
      {
        blackPrefactor: 1,
        currentDensityAPerCm2: 1,
        exponentN: 0,
        temperatureKelvin: 378,
      },
    ],
    [
      "activationEnergyEv",
      {
        activationEnergyEv: Number.NaN,
        blackPrefactor: 1,
        currentDensityAPerCm2: 1,
        temperatureKelvin: 378,
      },
    ],
    [
      "temperatureKelvin",
      { blackPrefactor: 1, currentDensityAPerCm2: 1, temperatureKelvin: 0 },
    ],
  ] as const)("rejects an invalid %s", (field, input) => {
    expect(() => calculateElectromigrationBlackEquation(input)).toThrow();
    expect(runElectromigrationBlackEquation(input)).toMatchObject({
      error: { issues: [{ field }] },
      ok: false,
    });
  });

  it("rejects missing and unknown fields", () => {
    expect(runElectromigrationBlackEquation({} as never).ok).toBe(false);
    expect(
      runElectromigrationBlackEquation({
        blackPrefactor: 1,
        currentDensityAPerCm2: 1,
        extra: true,
        temperatureKelvin: 378,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    });
  });
});
