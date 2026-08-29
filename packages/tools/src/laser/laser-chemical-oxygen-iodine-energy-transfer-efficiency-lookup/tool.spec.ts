import { describe, expect, it } from "vitest";
import {
  coilEfficiency,
  coilEfficiencyExample as example,
  runCoilEfficiency,
} from "./tool.js";

describe("COIL transfer efficiency", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runCoilEfficiency(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("caps the quantum limit near 96.6% from the donor photon ratio", () => {
    const out = coilEfficiency({
      singletOxygenExcitationPowerW: 1000,
      laserOutputPowerW: 0,
    });
    expect(out.opticalConversionEfficiencyPercent).toBe(0);
    expect(out.quantumLimitPercent).toBeCloseTo(96.55812114622854, 9);
  });
  it("rejects over-unity laser power and bad inputs", () => {
    expect(
      runCoilEfficiency({
        singletOxygenExcitationPowerW: 100,
        laserOutputPowerW: 101,
      }).ok,
    ).toBe(false);
    expect(
      runCoilEfficiency({
        singletOxygenExcitationPowerW: 0,
        laserOutputPowerW: 0,
      }).ok,
    ).toBe(false);
  });
});
