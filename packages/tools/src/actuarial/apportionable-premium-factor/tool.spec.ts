import { describe, expect, it } from "vitest";
import {
  apportionablePremiumFactorExample,
  calculateApportionablePremiumFactor,
  runApportionablePremiumFactor,
} from "./tool.js";

describe("Apportionable Premium Factor Calculator", () => {
  it("reproduces its canonical example", () => {
    expect(
      runApportionablePremiumFactor(apportionablePremiumFactorExample.input),
    ).toEqual({
      ok: true,
      output: apportionablePremiumFactorExample.output,
    });
  });

  it("returns one for annual payments and zero interest", () => {
    expect(
      calculateApportionablePremiumFactor({
        interestRate: 0.05,
        periodsPerYear: 1,
      }),
    ).toEqual({ apportionableFactor: 1 });
    expect(
      calculateApportionablePremiumFactor({
        interestRate: 0,
        periodsPerYear: 12,
      }),
    ).toEqual({ apportionableFactor: 1 });
  });

  it("accepts a valid negative effective interest rate", () => {
    expect(
      runApportionablePremiumFactor({
        interestRate: -0.02,
        periodsPerYear: 4,
      }).ok,
    ).toBe(true);
  });

  it("rejects an undefined interest basis and invalid frequencies", () => {
    expect(
      runApportionablePremiumFactor({
        interestRate: -1,
        periodsPerYear: 4,
      }).ok,
    ).toBe(false);
    expect(
      runApportionablePremiumFactor({
        interestRate: 0.05,
        periodsPerYear: 1.5,
      }).ok,
    ).toBe(false);
    expect(runApportionablePremiumFactor({ periodsPerYear: 4 }).ok).toBe(false);
  });
});
