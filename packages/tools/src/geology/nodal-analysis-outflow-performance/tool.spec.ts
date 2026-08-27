import { describe, expect, it } from "vitest";
import {
  nodalAnalysisOutflowPerformanceExample,
  runNodalAnalysisOutflowPerformance,
} from "./tool.js";

describe("geology/nodal-analysis-outflow-performance", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runNodalAnalysisOutflowPerformance(
        nodalAnalysisOutflowPerformanceExample.input,
      ),
    ).toEqual({
      ok: true,
      output: nodalAnalysisOutflowPerformanceExample.output,
    });
  });

  it("requires more bottom-hole pressure at higher rate", () => {
    const low = runNodalAnalysisOutflowPerformance({
      wellheadPressureMegapascals: 3.5,
      tubingLengthMetres: 2500,
      tubingInnerDiameterMetres: 0.0759,
      liquidRateCubicMetresPerDay: 400,
      fluidDensityKilogramsPerCubicMetre: 850,
    });
    const high = runNodalAnalysisOutflowPerformance({
      wellheadPressureMegapascals: 3.5,
      tubingLengthMetres: 2500,
      tubingInnerDiameterMetres: 0.0759,
      liquidRateCubicMetresPerDay: 1600,
      fluidDensityKilogramsPerCubicMetre: 850,
    });
    expect(low.ok && high.ok).toBe(true);
    if (low.ok && high.ok)
      expect(
        high.output.requiredBottomholePressureMegapascals as number,
      ).toBeGreaterThan(
        low.output.requiredBottomholePressureMegapascals as number,
      );
  });

  it("rejects non-positive rate and friction factor", () => {
    expect(
      runNodalAnalysisOutflowPerformance({
        wellheadPressureMegapascals: 3.5,
        tubingLengthMetres: 2500,
        tubingInnerDiameterMetres: 0.0759,
        liquidRateCubicMetresPerDay: 0,
        fluidDensityKilogramsPerCubicMetre: 850,
      }).ok,
    ).toBe(false);
    expect(
      runNodalAnalysisOutflowPerformance({
        wellheadPressureMegapascals: 3.5,
        tubingLengthMetres: 2500,
        tubingInnerDiameterMetres: 0.0759,
        liquidRateCubicMetresPerDay: 800,
        fluidDensityKilogramsPerCubicMetre: 850,
        frictionFactor: 0,
      }).ok,
    ).toBe(false);
  });
});
