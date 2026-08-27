import { describe, expect, it } from "vitest";
import {
  oilFormationVolumeFactorExample,
  runOilFormationVolumeFactor,
} from "./tool.js";

describe("oil-formation-volume-factor", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runOilFormationVolumeFactor(oilFormationVolumeFactorExample.input),
    ).toEqual({
      ok: true,
      output: oilFormationVolumeFactorExample.output,
    });
  });

  it("stays above one for gassy crude", () => {
    const result = runOilFormationVolumeFactor({
      solutionGasOilRatioSm3PerSm3: 60,
      gasGravity: 0.7,
      oilApiGravity: 40,
      temperatureK: 350,
    });
    if (!result.ok) throw new Error("expected success");
    expect(
      result.output.oilFormationVolumeFactorM3PerStdM3 as number,
    ).toBeGreaterThan(1);
  });
  it("rejects negative gas gravities", () => {
    expect(
      runOilFormationVolumeFactor({
        solutionGasOilRatioSm3PerSm3: 50,
        gasGravity: -0.7,
        oilApiGravity: 35,
        temperatureK: 340,
      }).ok,
    ).toBe(false);
  });
});
