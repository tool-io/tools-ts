import { describe, expect, it } from "vitest";
import {
  calculateReplacementFertilityWithMortalityChecker,
  runReplacementFertilityWithMortalityChecker,
  replacementFertilityWithMortalityCheckerExample,
} from "./tool.js";

describe("demography/replacement-fertility-with-mortality-checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runReplacementFertilityWithMortalityChecker(
        replacementFertilityWithMortalityCheckerExample.input,
      ),
    ).toEqual({
      ok: true,
      output: replacementFertilityWithMortalityCheckerExample.output,
    });
  });

  it("classifies near-replacement fertility as at replacement", () => {
    expect(
      calculateReplacementFertilityWithMortalityChecker({
        femaleSurvivalToReproductiveAge: 0.94,
        observedTfr: 2.2,
      }).status,
    ).toBe("atReplacement");
    expect(
      calculateReplacementFertilityWithMortalityChecker({
        femaleSurvivalToReproductiveAge: 0.94,
        observedTfr: 3,
      }).status,
    ).toBe("aboveReplacement");
  });

  it("rejects survival outside (0, 1]", () => {
    expect(
      runReplacementFertilityWithMortalityChecker({
        femaleSurvivalToReproductiveAge: 0,
      }).ok,
    ).toBe(false);
    expect(
      runReplacementFertilityWithMortalityChecker({
        femaleSurvivalToReproductiveAge: 1.5,
      }).ok,
    ).toBe(false);
  });
});
