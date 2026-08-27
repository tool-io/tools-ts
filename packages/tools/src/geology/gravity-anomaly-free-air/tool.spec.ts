import { describe, expect, it } from "vitest";
import {
  gravityAnomalyFreeAirExample,
  runGravityAnomalyFreeAir,
} from "./tool.js";

describe("geology/gravity-anomaly-free-air", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runGravityAnomalyFreeAir(gravityAnomalyFreeAirExample.input),
    ).toEqual({
      ok: true,
      output: gravityAnomalyFreeAirExample.output,
    });
  });

  it("returns the observed minus reference value at sea level", () => {
    const result = runGravityAnomalyFreeAir({
      observedGravityMgal: 980000.0,
      elevationM: 0,
      referenceGravityMgal: 980000.0,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.freeAirAnomalyMgal).toBe(0);
  });

  it("rejects negative elevations and non-positive gravity values", () => {
    expect(
      runGravityAnomalyFreeAir({
        observedGravityMgal: 979870.0,
        elevationM: -10,
        referenceGravityMgal: 980000.0,
      }).ok,
    ).toBe(false);
    expect(
      runGravityAnomalyFreeAir({
        observedGravityMgal: 979870.0,
        elevationM: 500,
        referenceGravityMgal: 0,
      }).ok,
    ).toBe(false);
  });
});
