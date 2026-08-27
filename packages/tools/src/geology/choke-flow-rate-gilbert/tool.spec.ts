import { describe, expect, it } from "vitest";
import {
  chokeFlowRateGilbertExample,
  runChokeFlowRateGilbert,
} from "./tool.js";

describe("geology/choke-flow-rate-gilbert", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runChokeFlowRateGilbert(chokeFlowRateGilbertExample.input)).toEqual({
      ok: true,
      output: chokeFlowRateGilbertExample.output,
    });
  });

  it("increases the rate with a larger choke bore", () => {
    const small = runChokeFlowRateGilbert({
      upstreamPressureKilopascals: 3500,
      gasLiquidRatioStandardCubicMetresPerCubicMetre: 100,
      chokeBoreMillimetres: 4.7625,
    });
    const large = runChokeFlowRateGilbert({
      upstreamPressureKilopascals: 3500,
      gasLiquidRatioStandardCubicMetresPerCubicMetre: 100,
      chokeBoreMillimetres: 9.525,
    });
    expect(small.ok && large.ok).toBe(true);
    if (small.ok && large.ok)
      expect(
        large.output.liquidFlowRateCubicMetresPerDay as number,
      ).toBeGreaterThan(small.output.liquidFlowRateCubicMetresPerDay as number);
  });

  it("rejects non-positive pressure, GLR and bore", () => {
    expect(
      runChokeFlowRateGilbert({
        upstreamPressureKilopascals: 0,
        gasLiquidRatioStandardCubicMetresPerCubicMetre: 100,
        chokeBoreMillimetres: 6.35,
      }).ok,
    ).toBe(false);
    expect(
      runChokeFlowRateGilbert({
        upstreamPressureKilopascals: 3500,
        gasLiquidRatioStandardCubicMetresPerCubicMetre: 0,
        chokeBoreMillimetres: 6.35,
      }).ok,
    ).toBe(false);
  });
});
