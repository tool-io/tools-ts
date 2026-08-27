import { describe, expect, it } from "vitest";
import { hazenGrainSizeD10Example, runHazenGrainSizeD10 } from "./tool.js";

describe("hazen-grain-size-d10", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runHazenGrainSizeD10(hazenGrainSizeD10Example.input)).toEqual({
      ok: true,
      output: hazenGrainSizeD10Example.output,
    });
  });

  it("quadruples D10 when conductivity quadruples", () => {
    const result = runHazenGrainSizeD10({
      hydraulicConductivityCmPerS: 0.04,
      hazenCoefficientPerCmS: 100,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.effectiveGrainSizeCm as number).toBeCloseTo(0.02, 12);
  });

  it("rejects non-positive Hazen coefficients", () => {
    expect(
      runHazenGrainSizeD10({
        hydraulicConductivityCmPerS: 0.01,
        hazenCoefficientPerCmS: 0,
      }).ok,
    ).toBe(false);
  });
});
