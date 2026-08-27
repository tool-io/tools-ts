import { describe, expect, it } from "vitest";
import {
  modulusOfVolumeCompressibilityExample,
  runModulusOfVolumeCompressibility,
} from "./tool.js";

describe("modulus-of-volume-compressibility", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runModulusOfVolumeCompressibility(
        modulusOfVolumeCompressibilityExample.input,
      ),
    ).toEqual({
      ok: true,
      output: modulusOfVolumeCompressibilityExample.output,
    });
  });

  it("computes a representative stiff increment", () => {
    const result = runModulusOfVolumeCompressibility({
      initialVoidRatio: 0.8,
      effectiveStressIncreaseKpa: 200,
      voidRatioDecrease: 0.3,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.constrainedModulusKpa as number).toBe(1200);
  });

  it("rejects a zero void ratio decrease", () => {
    expect(
      runModulusOfVolumeCompressibility({
        initialVoidRatio: 1,
        effectiveStressIncreaseKpa: 100,
        voidRatioDecrease: 0,
      }).ok,
    ).toBe(false);
  });
});
