import { describe, expect, it } from "vitest";
import {
  gasCompressibilityFactorZExample,
  runGasCompressibilityFactorZ,
} from "./tool.js";

describe("gas-compressibility-factor-z", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runGasCompressibilityFactorZ(gasCompressibilityFactorZExample.input),
    ).toEqual({
      ok: true,
      output: gasCompressibilityFactorZExample.output,
    });
  });

  it("approaches unity for ideal conditions", () => {
    const result = runGasCompressibilityFactorZ({
      pressurePa: 101_325,
      temperatureK: 288.15,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.zFactor as number).toBeCloseTo(1, 2);
  });
  it("rejects non-positive pressures", () => {
    expect(
      runGasCompressibilityFactorZ({ pressurePa: -1e6, temperatureK: 300 }).ok,
    ).toBe(false);
  });
});
