import { describe, expect, it } from "vitest";
import {
  calculateUnmetNeedContraceptionPercent,
  runUnmetNeedContraceptionPercent,
  unmetNeedContraceptionPercentExample,
} from "./tool.js";

describe("demography/unmet-need-contraception-percent", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runUnmetNeedContraceptionPercent(
        unmetNeedContraceptionPercentExample.input,
      ),
    ).toEqual({
      ok: true,
      output: unmetNeedContraceptionPercentExample.output,
    });
  });

  it("treats zero prevalence as zero satisfied demand", () => {
    expect(
      calculateUnmetNeedContraceptionPercent({
        womenWithUnmetNeed: 100000,
        marriedWomenReproductiveAge: 400000,
      }),
    ).toEqual({
      unmetNeedPercent: 25,
      totalDemandPercent: 25,
      demandSatisfiedPercent: 0,
    });
  });

  it("rejects unmet need above the base or out-of-range prevalence", () => {
    expect(
      runUnmetNeedContraceptionPercent({
        womenWithUnmetNeed: 200,
        marriedWomenReproductiveAge: 100,
      }).ok,
    ).toBe(false);
    expect(
      runUnmetNeedContraceptionPercent({
        womenWithUnmetNeed: 10,
        marriedWomenReproductiveAge: 100,
        contraceptivePrevalencePercent: 140,
      }).ok,
    ).toBe(false);
    expect(
      runUnmetNeedContraceptionPercent({
        womenWithUnmetNeed: 30,
        marriedWomenReproductiveAge: 100,
        contraceptivePrevalencePercent: 80,
      }).ok,
    ).toBe(false);
  });
});
