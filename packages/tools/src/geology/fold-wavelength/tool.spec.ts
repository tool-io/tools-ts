import { describe, expect, it } from "vitest";
import { foldWavelengthExample, runFoldWavelength } from "./tool.js";

describe("fold-wavelength", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runFoldWavelength(foldWavelengthExample.input)).toEqual({
      ok: true,
      output: foldWavelengthExample.output,
    });
  });

  it("returns two pi times thickness when the viscosity contrast is six", () => {
    const result = runFoldWavelength({
      layerThicknessMeters: 2,
      viscosityContrast: 6,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.dominantWavelengthMeters as number).toBeCloseTo(
      4 * Math.PI,
      12,
    );
  });
  it("rejects non-positive thickness", () => {
    expect(
      runFoldWavelength({ layerThicknessMeters: 0, viscosityContrast: 10 }).ok,
    ).toBe(false);
  });
});
