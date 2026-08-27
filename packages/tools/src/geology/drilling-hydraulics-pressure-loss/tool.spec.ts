import { describe, expect, it } from "vitest";
import {
  drillingHydraulicsPressureLossExample,
  runDrillingHydraulicsPressureLoss,
} from "./tool.js";

describe("drilling-hydraulics-pressure-loss", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runDrillingHydraulicsPressureLoss(
        drillingHydraulicsPressureLossExample.input,
      ),
    ).toEqual({
      ok: true,
      output: drillingHydraulicsPressureLossExample.output,
    });
  });

  it("reduces to the viscous term when the yield point vanishes", () => {
    const result = runDrillingHydraulicsPressureLoss({
      flowRateCubicMetresPerSecond: 0.02,
      pipeInternalDiameterMetres: 0.1,
      pipeLengthMetres: 1000,
      plasticViscosityPascalSeconds: 0.03,
      yieldPointPascals: 0,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.frictionalPressureLossPa).toBeCloseTo(
      244461.99258915108,
      6,
    );
  });

  it("rejects non-positive diameters", () => {
    expect(
      runDrillingHydraulicsPressureLoss({
        flowRateCubicMetresPerSecond: 0.02,
        pipeInternalDiameterMetres: 0,
        pipeLengthMetres: 1000,
        plasticViscosityPascalSeconds: 0.03,
        yieldPointPascals: 6,
      }).ok,
    ).toBe(false);
  });
});
