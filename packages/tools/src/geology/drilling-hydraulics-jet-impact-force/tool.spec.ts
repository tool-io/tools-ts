import { describe, expect, it } from "vitest";
import {
  drillingHydraulicsJetImpactForceExample,
  runDrillingHydraulicsJetImpactForce,
} from "./tool.js";

describe("drilling-hydraulics-jet-impact-force", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runDrillingHydraulicsJetImpactForce(
        drillingHydraulicsJetImpactForceExample.input,
      ),
    ).toEqual({
      ok: true,
      output: drillingHydraulicsJetImpactForceExample.output,
    });
  });

  it("recovers the ideal momentum flux with unit discharge coefficient", () => {
    const result = runDrillingHydraulicsJetImpactForce({
      flowRateCubicMetresPerSecond: 0.02,
      mudDensityKgPerCubicMetre: 1000,
      nozzleCount: 1,
      nozzleDiameterMetres: 0.01,
      dischargeCoefficient: 1,
    });
    if (!result.ok) throw new Error("expected success");
    const idealVelocity = 0.02 / ((Math.PI * 0.0001) / 4);
    expect(result.output.jetVelocityMetresPerSecond).toBeCloseTo(
      idealVelocity,
      12,
    );
    expect(result.output.jetImpactForceNewtons).toBeCloseTo(
      1000 * 0.02 * idealVelocity,
      9,
    );
  });

  it("rejects discharge coefficients above one", () => {
    expect(
      runDrillingHydraulicsJetImpactForce({
        ...drillingHydraulicsJetImpactForceExample.input,
        dischargeCoefficient: 1.2,
      }).ok,
    ).toBe(false);
  });
});
