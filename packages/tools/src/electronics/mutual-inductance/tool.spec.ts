import { describe, expect, it } from "vitest";
import {
  calculateMutualInductance,
  mutualInductanceExample,
  runMutualInductance,
} from "./tool.js";

describe("Mutual Inductance", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runMutualInductance(mutualInductanceExample.input)).toEqual({
      ok: true,
      output: mutualInductanceExample.output,
    });
  });

  it("rejects coupling coefficient above one", () => {
    expect(
      runMutualInductance({
        couplingCoefficientK: 1.5,
        inductanceOneH: 0.01,
        inductanceTwoH: 0.02,
      }).ok,
    ).toBe(false);
  });

  it("equals full coupling times the geometric mean of the inductances", () => {
    const geometricMean = Math.sqrt(0.01 * 0.02);
    expect(
      calculateMutualInductance({
        couplingCoefficientK: 1,
        inductanceOneH: 0.01,
        inductanceTwoH: 0.02,
      }).mutualInductanceHenries,
    ).toBeCloseTo(geometricMean, 15);
  });
});
