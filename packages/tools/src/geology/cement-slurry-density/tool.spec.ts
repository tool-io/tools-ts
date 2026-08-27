import { describe, expect, it } from "vitest";
import { cementSlurryDensityExample, runCementSlurryDensity } from "./tool.js";

describe("geology/cement-slurry-density", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runCementSlurryDensity(cementSlurryDensityExample.input)).toEqual({
      ok: true,
      output: cementSlurryDensityExample.output,
    });
  });

  it("lowers slurry density with more mixing water", () => {
    const neat = runCementSlurryDensity({
      waterCementRatioKilogramPerKilogram: 0.38,
    });
    const wet = runCementSlurryDensity({
      waterCementRatioKilogramPerKilogram: 0.5,
    });
    expect(neat.ok && wet.ok).toBe(true);
    if (neat.ok && wet.ok)
      expect(
        wet.output.slurryDensityKilogramsPerCubicMetre as number,
      ).toBeLessThan(neat.output.slurryDensityKilogramsPerCubicMetre as number);
  });

  it("rejects non-positive ratio and specific gravity", () => {
    expect(
      runCementSlurryDensity({ waterCementRatioKilogramPerKilogram: 0 }).ok,
    ).toBe(false);
    expect(runCementSlurryDensity({ cementSpecificGravity: -1 }).ok).toBe(
      false,
    );
  });
});
