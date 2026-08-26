import { describe, expect, it } from "vitest";
import {
  calculateGenerationLengthTIntrinsic,
  runGenerationLengthTIntrinsic,
  generationLengthTIntrinsicExample,
} from "./tool.js";

describe("demography/generation-length-t-intrinsic", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runGenerationLengthTIntrinsic(generationLengthTIntrinsicExample.input),
    ).toEqual({
      ok: true,
      output: generationLengthTIntrinsicExample.output,
    });
  });

  it("matches the mean age of maternity for the same schedule", () => {
    const result = calculateGenerationLengthTIntrinsic({
      method: "meanAgeMaternity",
      asfr: [0, 0.1, 0.15, 0.05, 0],
      personYearsLx: [4.9, 4.85, 4.8, 4.75, 4.7],
      startingAge: 15,
      classWidth: 5,
    });
    expect(result.generationLengthYears).toBeCloseTo(26.642114384748698, 12);
  });

  it("rejects a zero growth rate and misaligned lists", () => {
    expect(
      runGenerationLengthTIntrinsic({
        netReproductionRate: 1.4,
        intrinsicGrowthRate: 0,
      }).ok,
    ).toBe(false);
    expect(
      runGenerationLengthTIntrinsic({
        method: "meanAgeMaternity",
        asfr: [0.1],
        personYearsLx: [],
      }).ok,
    ).toBe(false);
    expect(
      runGenerationLengthTIntrinsic({
        netReproductionRate: 0.8,
        intrinsicGrowthRate: 0.02,
      }).ok,
    ).toBe(false);
  });
});
