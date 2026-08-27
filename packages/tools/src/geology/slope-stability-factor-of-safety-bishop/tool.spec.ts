import { describe, expect, it } from "vitest";
import {
  slopeStabilityFactorOfSafetyBishopExample,
  runSlopeStabilityFactorOfSafetyBishop,
} from "./tool.js";

describe("slope-stability-factor-of-safety-bishop", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runSlopeStabilityFactorOfSafetyBishop(
        slopeStabilityFactorOfSafetyBishopExample.input,
      ),
    ).toEqual({
      ok: true,
      output: slopeStabilityFactorOfSafetyBishopExample.output,
    });
  });

  it("raises the factor of safety when cohesion increases", () => {
    const baseline = runSlopeStabilityFactorOfSafetyBishop({
      ...slopeStabilityFactorOfSafetyBishopExample.input,
    });
    const stronger = runSlopeStabilityFactorOfSafetyBishop({
      ...slopeStabilityFactorOfSafetyBishopExample.input,
      cohesionKPa: 20,
    });
    if (!baseline.ok || !stronger.ok) throw new Error("expected success");
    expect(stronger.output.factorOfSafety as number).toBeGreaterThan(
      baseline.output.factorOfSafety as number,
    );
  });

  it("applies pore pressure to effective weight, not m-alpha", () => {
    const result = runSlopeStabilityFactorOfSafetyBishop({
      sliceAnglesDeg: [10, 25],
      sliceWeightsKN: [500, 400],
      sliceWidthM: 2,
      cohesionKPa: 8,
      frictionAngleDeg: 24,
      porePressureRatioRu: 0.2,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.factorOfSafety as number).toBeCloseTo(
      1.3172610042861908,
      12,
    );
  });

  it("rejects mismatched slice lists", () => {
    expect(
      runSlopeStabilityFactorOfSafetyBishop({
        sliceAnglesDeg: [10, 25],
        sliceWeightsKN: [500],
      }).ok,
    ).toBe(false);
  });

  it("rejects slices with no net driving force", () => {
    expect(
      runSlopeStabilityFactorOfSafetyBishop({
        sliceAnglesDeg: [-10, 10],
        sliceWeightsKN: [500, 500],
      }).ok,
    ).toBe(false);
  });
});
