import { describe, expect, it } from "vitest";
import {
  calculateNetSinglePremium,
  netSinglePremiumExample,
  runNetSinglePremium,
} from "./tool.js";

describe("net single premium calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runNetSinglePremium(netSinglePremiumExample.input)).toEqual({
      ok: true,
      output: netSinglePremiumExample.output,
    });
  });

  it("returns the full benefit when interest is zero", () => {
    expect(
      calculateNetSinglePremium({
        annualDeathProbability: 0.7,
        benefitAmount: 123,
        interestRate: 0,
      }),
    ).toEqual({ netSinglePremium: 123 });
  });

  it("returns zero when death cannot occur and rejects invalid inputs", () => {
    expect(
      runNetSinglePremium({
        annualDeathProbability: 0,
        benefitAmount: 100,
        interestRate: 0,
      }),
    ).toEqual({
      ok: true,
      output: { netSinglePremium: 0 },
    });
    expect(
      runNetSinglePremium({
        annualDeathProbability: 0.25,
        benefitAmount: 10,
        interestRate: -1,
      }).ok,
    ).toBe(false);
  });
});
