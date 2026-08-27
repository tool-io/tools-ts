import { describe, expect, it } from "vitest";
import { casingBurstPressureExample, runCasingBurstPressure } from "./tool.js";

describe("geology/casing-burst-pressure", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runCasingBurstPressure(casingBurstPressureExample.input)).toEqual({
      ok: true,
      output: casingBurstPressureExample.output,
    });
  });

  it("derates burst to 87.5 percent of the Barlow value", () => {
    const result = runCasingBurstPressure({
      yieldStrengthMegapascals: 551.6,
      outsideDiameterMillimetres: 244.48,
      wallThicknessMillimetres: 13.84,
    });
    if (!result.ok) throw new Error("expected success");
    const barlow = (2 * 551.6 * 13.84) / 244.48;
    expect(result.output.burstPressureMegapascals as number).toBeCloseTo(
      0.875 * barlow,
      12,
    );
  });

  it("rejects non-positive geometry", () => {
    expect(
      runCasingBurstPressure({
        yieldStrengthMegapascals: 551.6,
        outsideDiameterMillimetres: 0,
        wallThicknessMillimetres: 13.84,
      }).ok,
    ).toBe(false);
    expect(
      runCasingBurstPressure({
        yieldStrengthMegapascals: 551.6,
        outsideDiameterMillimetres: 244.48,
        wallThicknessMillimetres: -1,
      }).ok,
    ).toBe(false);
  });
});
