import { describe, expect, it } from "vitest";
import {
  bearingCapacityVesicExample,
  runBearingCapacityVesic,
} from "./tool.js";

describe("bearing-capacity-vesic", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runBearingCapacityVesic(bearingCapacityVesicExample.input)).toEqual({
      ok: true,
      output: bearingCapacityVesicExample.output,
    });
  });

  it("collapses to the base equation for a surface square footing", () => {
    const result = runBearingCapacityVesic({
      cohesionKpa: 5,
      frictionAngleDeg: 25,
      surchargeKpa: 10,
      unitWeightKnPerM3: 18,
      footingWidthM: 2,
      footingLengthM: 2,
      foundationDepthM: 0,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.ultimateBearingCapacityKpa as number).toBe(
      289.0404048344791,
    );
  });

  it("rejects a length smaller than the width", () => {
    expect(
      runBearingCapacityVesic({
        cohesionKpa: 5,
        frictionAngleDeg: 25,
        surchargeKpa: 10,
        unitWeightKnPerM3: 18,
        footingWidthM: 2,
        footingLengthM: 1,
        foundationDepthM: 0,
      }).ok,
    ).toBe(false);
  });
});
