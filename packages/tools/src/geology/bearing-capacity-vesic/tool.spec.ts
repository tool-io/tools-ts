import { describe, expect, it } from "vitest";
import { exampleOutputsMatch } from "../../core/example.js";
import {
  bearingCapacityVesicExample,
  runBearingCapacityVesic,
} from "./tool.js";

describe("bearing-capacity-vesic", () => {
  it("reproduces its canonical example within the example tolerance", () => {
    expect(
      exampleOutputsMatch(
        runBearingCapacityVesic(bearingCapacityVesicExample.input),
        { ok: true, output: bearingCapacityVesicExample.output },
      ),
    ).toBe(true);
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
    expect(
      exampleOutputsMatch(
        result.output.ultimateBearingCapacityKpa,
        289.0404048344791,
      ),
    ).toBe(true);
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
