import { describe, expect, it } from "vitest";
import {
  calculateGravityAnomalyBouguer,
  gravityAnomalyBouguerExample,
  runGravityAnomalyBouguer,
} from "./tool.js";

describe("geology/gravity-anomaly-bouguer", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runGravityAnomalyBouguer(gravityAnomalyBouguerExample.input),
    ).toEqual({
      ok: true,
      output: gravityAnomalyBouguerExample.output,
    });
  });

  it("defaults the reduction density to 2670 kg per cubic meter", () => {
    const withDefault = runGravityAnomalyBouguer({
      observedGravityMgal: 979870.0,
      elevationM: 500,
      referenceGravityMgal: 980000.0,
    });
    expect(withDefault).toEqual({
      ok: true,
      output: gravityAnomalyBouguerExample.output,
    });
    const denser = calculateGravityAnomalyBouguer({
      observedGravityMgal: 979870.0,
      elevationM: 500,
      referenceGravityMgal: 980000.0,
      reductionDensityKgPerM3: 3000,
    });
    expect(denser.bouguerCorrectionMgal).toBeGreaterThan(
      gravityAnomalyBouguerExample.output.bouguerCorrectionMgal,
    );
  });

  it("rejects negative elevation and non-positive densities", () => {
    expect(
      runGravityAnomalyBouguer({
        observedGravityMgal: 979870.0,
        elevationM: -1,
        referenceGravityMgal: 980000.0,
      }).ok,
    ).toBe(false);
    expect(
      runGravityAnomalyBouguer({
        observedGravityMgal: 979870.0,
        elevationM: 500,
        referenceGravityMgal: 980000.0,
        reductionDensityKgPerM3: 0,
      }).ok,
    ).toBe(false);
  });
});
