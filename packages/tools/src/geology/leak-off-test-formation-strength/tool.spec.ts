import { describe, expect, it } from "vitest";
import {
  leakOffTestFormationStrengthExample,
  runLeakOffTestFormationStrength,
} from "./tool.js";

describe("leak-off-test-formation-strength", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runLeakOffTestFormationStrength(
        leakOffTestFormationStrengthExample.input,
      ),
    ).toEqual({
      ok: true,
      output: leakOffTestFormationStrengthExample.output,
    });
  });

  it("recovers the mud density when no surface pressure is applied", () => {
    const result = runLeakOffTestFormationStrength({
      mudDensityKgPerCubicMetre: 1150,
      shoeDepthMetres: 1800,
      surfaceLeakOffPressurePa: 0,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.equivalentMudDensityKgPerCubicMetre).toBeCloseTo(
      1150,
      6,
    );
  });

  it("rejects non-positive depths", () => {
    expect(
      runLeakOffTestFormationStrength({
        mudDensityKgPerCubicMetre: 1150,
        shoeDepthMetres: 0,
        surfaceLeakOffPressurePa: 1000000,
      }).ok,
    ).toBe(false);
  });
});
