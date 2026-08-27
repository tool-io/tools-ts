import { describe, expect, it } from "vitest";
import {
  buckleyLeverettFrontSaturationExample,
  runBuckleyLeverettFrontSaturation,
} from "./tool.js";

describe("buckley-leverett-front-saturation", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runBuckleyLeverettFrontSaturation(
        buckleyLeverettFrontSaturationExample.input,
      ),
    ).toEqual({
      ok: true,
      output: buckleyLeverettFrontSaturationExample.output,
    });
  });

  it("pulls the shock front to low saturation in a viscous-oil system", () => {
    const result = runBuckleyLeverettFrontSaturation({
      oilViscosityMilliPascalSeconds: 10,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.frontWaterSaturation as number).toBeLessThan(0.5);
  });

  it("rejects overlapping residual saturations", () => {
    expect(
      runBuckleyLeverettFrontSaturation({
        irreducibleWaterSaturation: 0.6,
        residualOilSaturation: 0.6,
      }).ok,
    ).toBe(false);
  });
});
