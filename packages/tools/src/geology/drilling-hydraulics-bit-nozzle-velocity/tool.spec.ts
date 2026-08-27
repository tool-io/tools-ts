import { describe, expect, it } from "vitest";
import {
  drillingHydraulicsBitNozzleVelocityExample,
  runDrillingHydraulicsBitNozzleVelocity,
} from "./tool.js";

describe("drilling-hydraulics-bit-nozzle-velocity", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runDrillingHydraulicsBitNozzleVelocity(
        drillingHydraulicsBitNozzleVelocityExample.input,
      ),
    ).toEqual({
      ok: true,
      output: drillingHydraulicsBitNozzleVelocityExample.output,
    });
  });

  it("matches the single-nozzle geometric flow area", () => {
    const result = runDrillingHydraulicsBitNozzleVelocity({
      flowRateCubicMetresPerSecond: 0.01,
      nozzleCount: 1,
      nozzleDiameterMetres: 0.01,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.totalFlowAreaSquareMetres).toBeCloseTo(
      (Math.PI * 0.0001) / 4,
      15,
    );
  });

  it("rejects zero nozzle counts", () => {
    expect(
      runDrillingHydraulicsBitNozzleVelocity({
        flowRateCubicMetresPerSecond: 0.02,
        nozzleCount: 0,
        nozzleDiameterMetres: 0.0095,
      }).ok,
    ).toBe(false);
  });
});
