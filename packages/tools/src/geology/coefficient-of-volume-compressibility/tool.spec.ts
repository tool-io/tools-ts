import { describe, expect, it } from "vitest";
import {
  coefficientOfVolumeCompressibilityExample,
  runCoefficientOfVolumeCompressibility,
} from "./tool.js";

describe("coefficient-of-volume-compressibility", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCoefficientOfVolumeCompressibility(
        coefficientOfVolumeCompressibilityExample.input,
      ),
    ).toEqual({
      ok: true,
      output: coefficientOfVolumeCompressibilityExample.output,
    });
  });

  it("computes a softer clay response", () => {
    const result = runCoefficientOfVolumeCompressibility({
      voidRatioDecrease: 0.15,
      effectiveStressIncreaseKpa: 50,
      initialVoidRatio: 0.8,
    });
    if (!result.ok) throw new Error("expected success");
    expect(
      result.output.coefficientOfVolumeCompressibilityPerKpa as number,
    ).toBe(0.0016666666666666666);
  });

  it("rejects a non-positive stress increase", () => {
    expect(
      runCoefficientOfVolumeCompressibility({
        voidRatioDecrease: 0.2,
        effectiveStressIncreaseKpa: 0,
        initialVoidRatio: 1,
      }).ok,
    ).toBe(false);
  });
});
