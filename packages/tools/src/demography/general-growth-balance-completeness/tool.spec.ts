import { describe, expect, it } from "vitest";
import {
  calculateGeneralGrowthBalanceCompleteness,
  runGeneralGrowthBalanceCompleteness,
  generalGrowthBalanceCompletenessExample,
} from "./tool.js";

describe("demography/general-growth-balance-completeness", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runGeneralGrowthBalanceCompleteness(
        generalGrowthBalanceCompletenessExample.input,
      ),
    ).toEqual({
      ok: true,
      output: generalGrowthBalanceCompletenessExample.output,
    });
  });

  it("returns perfect completeness when deaths equal births minus growth", () => {
    expect(
      calculateGeneralGrowthBalanceCompleteness({
        registeredDeaths: 30000,
        registeredBirths: 60000,
        annualGrowthRate: 0.01,
        personYearsLivedBetweenCensuses: 3000000,
      }).deathRegistrationCompleteness,
    ).toBe(1);
  });

  it("rejects degenerate balances where births do not exceed growth times person-years", () => {
    expect(
      runGeneralGrowthBalanceCompleteness({
        registeredDeaths: 100,
        registeredBirths: 40000,
        annualGrowthRate: 0.02,
        personYearsLivedBetweenCensuses: 2000000,
      }).ok,
    ).toBe(false);
  });
});
