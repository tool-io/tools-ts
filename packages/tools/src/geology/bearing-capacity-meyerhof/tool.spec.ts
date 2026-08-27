import { describe, expect, it } from "vitest";
import {
  bearingCapacityMeyerhofExample,
  runBearingCapacityMeyerhof,
} from "./tool.js";

describe("bearing-capacity-meyerhof", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runBearingCapacityMeyerhof(bearingCapacityMeyerhofExample.input),
    ).toEqual({
      ok: true,
      output: bearingCapacityMeyerhofExample.output,
    });
  });

  it("computes a medium dense sand case", () => {
    const result = runBearingCapacityMeyerhof({
      cohesionKpa: 5,
      frictionAngleDeg: 20,
      surchargeKpa: 15,
      unitWeightKnPerM3: 17,
      footingWidthM: 1.5,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.nGamma as number).toBe(2.870908460412888);
    expect(result.output.ultimateBearingCapacityKpa as number).toBe(
      206.7685445761985,
    );
  });

  it("rejects a friction angle of 90 degrees or more", () => {
    expect(
      runBearingCapacityMeyerhof({
        cohesionKpa: 0,
        frictionAngleDeg: 90,
        surchargeKpa: 0,
        unitWeightKnPerM3: 17,
        footingWidthM: 1.5,
      }).ok,
    ).toBe(false);
  });
});
