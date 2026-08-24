import { describe, expect, it } from "vitest";
import { runTurnLoadFactorGust, turnLoadFactorGustExample } from "./tool.js";

describe("gust load factor calculator", () => {
  it("reproduces its canonical SI example", () => {
    expect(runTurnLoadFactorGust(turnLoadFactorGustExample.input)).toEqual({
      ok: true,
      output: turnLoadFactorGustExample.output,
    });
  });

  it("returns one g for zero gust velocity", () => {
    expect(
      runTurnLoadFactorGust({
        airDensityKgPerM3: 1.225,
        gustVelocityMPerS: 0,
        liftCurveSlopePerRad: 5.5,
        trueAirspeedMPerS: 60,
        wingLoadingNPerM2: 3000,
      }),
    ).toEqual({ ok: true, output: { loadFactorG: 1 } });
  });

  it("applies the gust alleviation factor", () => {
    const result = runTurnLoadFactorGust({
      airDensityKgPerM3: 1.225,
      gustAlleviationFactor: 0.8,
      gustVelocityMPerS: 10,
      liftCurveSlopePerRad: 5.5,
      trueAirspeedMPerS: 60,
      wingLoadingNPerM2: 3000,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.loadFactorG).toBeCloseTo(1.539, 12);
  });

  it("rejects non-positive denominators and out-of-range alleviation", () => {
    const base = {
      airDensityKgPerM3: 1.225,
      gustVelocityMPerS: 10,
      liftCurveSlopePerRad: 5.5,
      trueAirspeedMPerS: 60,
      wingLoadingNPerM2: 3000,
    };
    expect(runTurnLoadFactorGust({ ...base, wingLoadingNPerM2: 0 }).ok).toBe(
      false,
    );
    expect(
      runTurnLoadFactorGust({ ...base, gustAlleviationFactor: 1.1 }).ok,
    ).toBe(false);
  });
});
