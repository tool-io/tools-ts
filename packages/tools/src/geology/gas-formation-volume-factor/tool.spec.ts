import { describe, expect, it } from "vitest";
import {
  gasFormationVolumeFactorExample,
  runGasFormationVolumeFactor,
} from "./tool.js";

describe("gas-formation-volume-factor", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runGasFormationVolumeFactor(gasFormationVolumeFactorExample.input),
    ).toEqual({
      ok: true,
      output: gasFormationVolumeFactorExample.output,
    });
  });

  it("approaches one near standard conditions", () => {
    const result = runGasFormationVolumeFactor({
      pressurePa: 101325,
      temperatureK: 288.15,
      zFactor: 1,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.gasFormationVolumeFactorM3PerStdM3 as number).toBe(1);
  });
  it("rejects non-positive pressures", () => {
    expect(
      runGasFormationVolumeFactor({ pressurePa: 0, temperatureK: 300 }).ok,
    ).toBe(false);
  });
});
