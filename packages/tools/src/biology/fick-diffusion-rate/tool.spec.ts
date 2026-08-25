import { describe, expect, it } from "vitest";
import { runFickDiffusionRate } from "./tool.js";

describe("Fick Diffusion Rate", () => {
  it("calculates a valid result", () =>
    expect(
      runFickDiffusionRate({
        areaCm2: 1,
        concentrationDifferenceMgMl: 1,
        diffusionCoefficientCm2S: 0.00001,
        membraneThicknessUm: 100,
      }),
    ).toEqual({
      ok: true,
      output: { diffusionRateMgPerS: 0.001 },
    }));
  it("doubles with doubled area", () => {
    const base = runFickDiffusionRate({
      areaCm2: 1,
      concentrationDifferenceMgMl: 1,
      diffusionCoefficientCm2S: 1,
      membraneThicknessUm: 1,
    });
    const doubled = runFickDiffusionRate({
      areaCm2: 2,
      concentrationDifferenceMgMl: 1,
      diffusionCoefficientCm2S: 1,
      membraneThicknessUm: 1,
    });
    expect(base.ok && doubled.ok).toBe(true);
    if (base.ok && doubled.ok)
      expect(
        Number(doubled.output.diffusionRateMgPerS) /
          Number(base.output.diffusionRateMgPerS),
      ).toBe(2);
  });
  it("halves with a thicker membrane", () => {
    const base = runFickDiffusionRate({
      areaCm2: 1,
      concentrationDifferenceMgMl: 1,
      diffusionCoefficientCm2S: 1,
      membraneThicknessUm: 1,
    });
    const thick = runFickDiffusionRate({
      areaCm2: 1,
      concentrationDifferenceMgMl: 1,
      diffusionCoefficientCm2S: 1,
      membraneThicknessUm: 2,
    });
    expect(base.ok && thick.ok).toBe(true);
    if (base.ok && thick.ok)
      expect(
        Number(thick.output.diffusionRateMgPerS) /
          Number(base.output.diffusionRateMgPerS),
      ).toBe(0.5);
  });
  it("is proportional to the concentration difference", () => {
    const result = runFickDiffusionRate({
      areaCm2: 50000,
      concentrationDifferenceMgMl: 1,
      diffusionCoefficientCm2S: 0.000002,
      membraneThicknessUm: 0.01,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.diffusionRateMgPerS).toBeCloseTo(100000, 9);
  });
  it("rejects zero thickness", () =>
    expect(
      runFickDiffusionRate({
        areaCm2: 1,
        concentrationDifferenceMgMl: 1,
        diffusionCoefficientCm2S: 1,
        membraneThicknessUm: 0,
      }).ok,
    ).toBe(false));
  it("rejects zero coefficient", () =>
    expect(
      runFickDiffusionRate({
        areaCm2: 1,
        concentrationDifferenceMgMl: 1,
        diffusionCoefficientCm2S: 0,
        membraneThicknessUm: 1,
      }).ok,
    ).toBe(false));
  it("rejects negative concentration difference", () =>
    expect(
      runFickDiffusionRate({
        areaCm2: 1,
        concentrationDifferenceMgMl: -1,
        diffusionCoefficientCm2S: 1,
        membraneThicknessUm: 1,
      }).ok,
    ).toBe(false));
});
