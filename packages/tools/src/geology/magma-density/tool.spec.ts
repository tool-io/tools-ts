import { describe, expect, it } from "vitest";
import { magmaDensityExample, runMagmaDensity } from "./tool.js";

describe("magma-density", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runMagmaDensity(magmaDensityExample.input)).toEqual({
      ok: true,
      output: magmaDensityExample.output,
    });
  });

  it("equals the melt density with no crystals", () => {
    const result = runMagmaDensity({
      crystalVolumeFraction: 0,
      crystalDensityKgPerM3: 2700,
      meltDensityKgPerM3: 2400,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.magmaDensityKgPerM3).toBe(2400);
  });
  it("rejects fractions above one", () => {
    expect(
      runMagmaDensity({
        crystalVolumeFraction: 1.5,
        crystalDensityKgPerM3: 2700,
        meltDensityKgPerM3: 2400,
      }).ok,
    ).toBe(false);
  });
});
