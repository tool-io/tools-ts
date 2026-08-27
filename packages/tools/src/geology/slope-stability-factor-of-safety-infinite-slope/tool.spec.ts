import { describe, expect, it } from "vitest";
import {
  slopeStabilityFactorOfSafetyInfiniteSlopeExample,
  runSlopeStabilityFactorOfSafetyInfiniteSlope,
} from "./tool.js";

describe("slope-stability-factor-of-safety-infinite-slope", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runSlopeStabilityFactorOfSafetyInfiniteSlope(
        slopeStabilityFactorOfSafetyInfiniteSlopeExample.input,
      ),
    ).toEqual({
      ok: true,
      output: slopeStabilityFactorOfSafetyInfiniteSlopeExample.output,
    });
  });

  it("reduces to tan(phi)/tan(beta) for dry cohesionless soil", () => {
    const result = runSlopeStabilityFactorOfSafetyInfiniteSlope({
      slopeAngleDeg: 30,
      frictionAngleDeg: 30,
      cohesionKPa: 0,
      porePressureRatioRu: 0,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.factorOfSafety as number).toBeCloseTo(1, 12);
  });

  it("rejects pore pressure ratios of one or more", () => {
    expect(
      runSlopeStabilityFactorOfSafetyInfiniteSlope({
        slopeAngleDeg: 30,
        frictionAngleDeg: 30,
        porePressureRatioRu: 1,
      }).ok,
    ).toBe(false);
  });
});
