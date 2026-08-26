import { describe, expect, it } from "vitest";
import {
  calculateBennettHoriuchiDeathDistributionMethod,
  runBennettHoriuchiDeathDistributionMethod,
  bennettHoriuchiDeathDistributionMethodExample,
} from "./tool.js";

describe("demography/bennett-horiuchi-death-distribution-method", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runBennettHoriuchiDeathDistributionMethod(
        bennettHoriuchiDeathDistributionMethodExample.input,
      ),
    ).toEqual({
      ok: true,
      output: bennettHoriuchiDeathDistributionMethodExample.output,
    });
  });

  it("ignores growth at a zero rate and divides plain deaths by person-years", () => {
    expect(
      calculateBennettHoriuchiDeathDistributionMethod({
        baseAge: 5,
        deathsByFiveYearAgeGroup: [2500],
        annualGrowthRate: 0,
        personYearsAboveBase: 5000,
      }),
    ).toEqual({
      deathRegistrationCompleteness: 0.5,
      expectedDeathsAboveBase: 2500,
    });
  });

  it("rejects negative deaths or implausible growth rates", () => {
    expect(
      runBennettHoriuchiDeathDistributionMethod({
        baseAge: 5,
        deathsByFiveYearAgeGroup: [-10],
        annualGrowthRate: 0.02,
        personYearsAboveBase: 5000,
      }).ok,
    ).toBe(false);
    expect(
      runBennettHoriuchiDeathDistributionMethod({
        baseAge: 5,
        deathsByFiveYearAgeGroup: [100],
        annualGrowthRate: 0.5,
        personYearsAboveBase: 5000,
      }).ok,
    ).toBe(false);
  });
});
