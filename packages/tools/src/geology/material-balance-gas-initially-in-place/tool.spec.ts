import { describe, expect, it } from "vitest";
import {
  materialBalanceGasInitiallyInPlaceExample,
  runMaterialBalanceGasInitiallyInPlace,
} from "./tool.js";

describe("material-balance-gas-initially-in-place", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runMaterialBalanceGasInitiallyInPlace(
        materialBalanceGasInitiallyInPlaceExample.input,
      ),
    ).toEqual({
      ok: true,
      output: materialBalanceGasInitiallyInPlaceExample.output,
    });
  });

  it("grows Bg when temperature rises at fixed pressure", () => {
    const hot = runMaterialBalanceGasInitiallyInPlace({
      ...materialBalanceGasInitiallyInPlaceExample.input,
      temperatureKelvin: 400,
    });
    if (!hot.ok) throw new Error("expected success");
    expect(
      hot.output.gasFormationVolumeFactorM3PerSm3 as number,
    ).toBeGreaterThan(0.005538326392503904);
  });

  it("rejects non-positive z factor", () => {
    expect(
      runMaterialBalanceGasInitiallyInPlace({
        ...materialBalanceGasInitiallyInPlaceExample.input,
        zFactor: 0,
      }).ok,
    ).toBe(false);
  });
});
