import { describe, expect, it } from "vitest";
import {
  calculateFullPreliminaryTermReserve,
  fullPreliminaryTermReserveExample,
  runFullPreliminaryTermReserve,
} from "./tool.js";

describe("full preliminary term reserve calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runFullPreliminaryTermReserve(fullPreliminaryTermReserveExample.input),
    ).toEqual({
      ok: true,
      output: fullPreliminaryTermReserveExample.output,
    });
  });

  it("always leaves a zero first-year terminal reserve", () => {
    expect(
      calculateFullPreliminaryTermReserve({
        benefitAmount: 500,
        initialDeathProbability: 0.9,
        interestRate: 1,
        renewalDeathProbability: 0.05,
      }),
    ).toEqual({ firstYearTerminalReserve: 0, renewalValuationPremium: 12.5 });
  });

  it("accepts a negative interest rate above -100 percent", () => {
    expect(
      calculateFullPreliminaryTermReserve({
        benefitAmount: 10,
        initialDeathProbability: 0.5,
        interestRate: -0.5,
        renewalDeathProbability: 0.5,
      }),
    ).toEqual({ firstYearTerminalReserve: 0, renewalValuationPremium: 10 });
  });

  it("rejects certain first-year death with a stable code", () => {
    expect(
      runFullPreliminaryTermReserve({
        benefitAmount: 100,
        initialDeathProbability: 1,
        interestRate: 0.05,
        renewalDeathProbability: 0.1,
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "no_first_year_survivors", field: "initialDeathProbability" },
        ],
      },
      ok: false,
    });
  });

  it("rejects invalid rates with field-specific issues", () => {
    expect(
      runFullPreliminaryTermReserve({
        benefitAmount: 100,
        initialDeathProbability: 0.2,
        interestRate: -1,
        renewalDeathProbability: 0.1,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_interest_rate", field: "interestRate" }],
      },
      ok: false,
    });
    expect(
      runFullPreliminaryTermReserve({
        benefitAmount: 100,
        initialDeathProbability: 0.2,
        interestRate: Number.NaN,
        renewalDeathProbability: 0.1,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "interestRate" }] },
      ok: false,
    });
    expect(
      runFullPreliminaryTermReserve({
        benefitAmount: 100,
        interestRate: -2,
        renewalDeathProbability: 0.1,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "initialDeathProbability" }],
      },
      ok: false,
    });
  });
});
