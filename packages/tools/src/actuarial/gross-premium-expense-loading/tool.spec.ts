import { describe, expect, it } from "vitest";
import {
  calculateGrossPremiumExpenseLoading,
  grossPremiumExpenseLoadingExample,
  runGrossPremiumExpenseLoading,
} from "./tool.js";

describe("gross premium expense loading calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runGrossPremiumExpenseLoading(grossPremiumExpenseLoadingExample.input),
    ).toEqual({
      ok: true,
      output: grossPremiumExpenseLoadingExample.output,
    });
  });

  it("returns the net premium with no loading", () => {
    expect(calculateGrossPremiumExpenseLoading({ netPremium: 750 })).toEqual({
      grossPremium: 750,
    });
  });

  it("accepts ratios arbitrarily close to one", () => {
    expect(
      calculateGrossPremiumExpenseLoading({
        fixedExpense: 50,
        netPremium: 800,
        variableExpenseRatio: 0.995,
      }),
    ).toEqual({ grossPremium: 169999.99999999985 });
  });

  it("rejects a variable expense ratio of one or more with a stable code", () => {
    expect(
      runGrossPremiumExpenseLoading({
        netPremium: 100,
        variableExpenseRatio: 1,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_loading", field: "variableExpenseRatio" }],
      },
      ok: false,
    });
  });

  it("rejects malformed and negative inputs with field-specific issues", () => {
    expect(runGrossPremiumExpenseLoading(null)).toMatchObject({
      error: { issues: [{ code: "object_required" }] },
      ok: false,
    });
    expect(runGrossPremiumExpenseLoading({ netPremium: -100 })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "netPremium" }] },
      ok: false,
    });
  });

  it("guards direct calls and finite output", () => {
    expect(() =>
      calculateGrossPremiumExpenseLoading({
        fixedExpense: Number.NaN,
        netPremium: 100,
      }),
    ).toThrowError("The fixed expense must be finite and nonnegative");
    expect(() =>
      calculateGrossPremiumExpenseLoading({
        netPremium: 100,
        variableExpenseRatio: -0.1,
      }),
    ).toThrowError("The variable expense ratio must be finite");
    expect(
      runGrossPremiumExpenseLoading({
        fixedExpense: Number.MAX_VALUE,
        netPremium: Number.MAX_VALUE,
        variableExpenseRatio: 0.5,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "result_not_finite", field: "netPremium" }] },
      ok: false,
    });
  });
});
