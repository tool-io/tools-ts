import { describe, expect, it } from "vitest";
import {
  casingCollapsePressureExample,
  runCasingCollapsePressure,
} from "./tool.js";

describe("geology/casing-collapse-pressure", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCasingCollapsePressure(casingCollapsePressureExample.input),
    ).toEqual({
      ok: true,
      output: casingCollapsePressureExample.output,
    });
  });

  it("raises collapse resistance with a thicker wall", () => {
    const thin = runCasingCollapsePressure({
      yieldStrengthMegapascals: 551.6,
      outsideDiameterMillimetres: 244.48,
      wallThicknessMillimetres: 11.99,
    });
    const thick = runCasingCollapsePressure({
      yieldStrengthMegapascals: 551.6,
      outsideDiameterMillimetres: 244.48,
      wallThicknessMillimetres: 15.47,
    });
    expect(thin.ok && thick.ok).toBe(true);
    if (thin.ok && thick.ok)
      expect(
        thick.output.collapsePressureMegapascals as number,
      ).toBeGreaterThan(thin.output.collapsePressureMegapascals as number);
  });

  it("rejects non-positive strength and impossible wall", () => {
    expect(
      runCasingCollapsePressure({
        yieldStrengthMegapascals: 0,
        outsideDiameterMillimetres: 244.48,
        wallThicknessMillimetres: 13.84,
      }).ok,
    ).toBe(false);
    expect(
      runCasingCollapsePressure({
        yieldStrengthMegapascals: 551.6,
        outsideDiameterMillimetres: 244.48,
        wallThicknessMillimetres: 200,
      }).ok,
    ).toBe(false);
  });
});
