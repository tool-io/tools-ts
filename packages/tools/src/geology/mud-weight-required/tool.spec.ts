import { describe, expect, it } from "vitest";
import { mudWeightRequiredExample, runMudWeightRequired } from "./tool.js";

describe("mud-weight-required", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runMudWeightRequired(mudWeightRequiredExample.input)).toEqual({
      ok: true,
      output: mudWeightRequiredExample.output,
    });
  });

  it("balances exactly without a trip margin", () => {
    const result = runMudWeightRequired({
      porePressureMegapascals: 19.6133,
      trueVerticalDepthMetres: 2000,
      tripMarginKgPerCubicMetre: 0,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.requiredMudDensityKgPerCubicMetre).toBeCloseTo(
      1000,
      6,
    );
    expect(result.output.requiredPressureGradientPaPerMetre).toBeCloseTo(
      9806.65,
      4,
    );
  });

  it("rejects non-positive depths", () => {
    expect(
      runMudWeightRequired({
        porePressureMegapascals: 30,
        trueVerticalDepthMetres: 0,
      }).ok,
    ).toBe(false);
  });
});
