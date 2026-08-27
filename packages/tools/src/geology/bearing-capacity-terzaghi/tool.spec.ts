import { describe, expect, it } from "vitest";
import {
  bearingCapacityTerzaghiExample,
  runBearingCapacityTerzaghi,
} from "./tool.js";

describe("bearing-capacity-terzaghi", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runBearingCapacityTerzaghi(bearingCapacityTerzaghiExample.input),
    ).toEqual({
      ok: true,
      output: bearingCapacityTerzaghiExample.output,
    });
  });

  it("reduces to a purely cohesive undrained case at zero friction angle", () => {
    const result = runBearingCapacityTerzaghi({
      cohesionKpa: 20,
      frictionAngleDeg: 0,
      surchargeKpa: 10,
      unitWeightKnPerM3: 18,
      footingWidthM: 2,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.ultimateBearingCapacityKpa as number).toBe(
      112.83185307179586,
    );
  });

  it("rejects a negative friction angle", () => {
    expect(
      runBearingCapacityTerzaghi({
        cohesionKpa: 10,
        frictionAngleDeg: -5,
        surchargeKpa: 20,
        unitWeightKnPerM3: 18,
        footingWidthM: 2,
      }).ok,
    ).toBe(false);
  });
});
