import { describe, expect, it } from "vitest";
import {
  calculateTimesInterestEarned,
  runTimesInterestEarned,
  timesInterestEarnedExample,
} from "./tool.js";

describe("times interest earned calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runTimesInterestEarned(timesInterestEarnedExample.input)).toEqual({
      ok: true,
      output: timesInterestEarnedExample.output,
    });
  });

  it("computes an independently known value", () => {
    expect(
      calculateTimesInterestEarned({
        interestExpense: 5000,
        operatingIncome: 60000,
      }),
    ).toEqual({ timesInterestEarned: 12 });
  });

  it("scales linearly in operating income", () => {
    const base = calculateTimesInterestEarned({
      interestExpense: 2000,
      operatingIncome: 43000,
    });
    const doubled = calculateTimesInterestEarned({
      interestExpense: 2000,
      operatingIncome: 86000,
    });
    expect(doubled.timesInterestEarned).toBeCloseTo(
      base.timesInterestEarned * 2,
      12,
    );
  });

  it("preserves losses and normalizes negative zero", () => {
    expect(
      calculateTimesInterestEarned({
        interestExpense: 2000,
        operatingIncome: -43000,
      }),
    ).toEqual({ timesInterestEarned: -21.5 });
    expect(
      calculateTimesInterestEarned({
        interestExpense: 2000,
        operatingIncome: -0,
      }),
    ).toEqual({ timesInterestEarned: 0 });
  });

  it("rejects non-finite direct inputs", () => {
    expect(() =>
      calculateTimesInterestEarned({
        interestExpense: Infinity,
        operatingIncome: 43000,
      }),
    ).toThrow();
    expect(() =>
      calculateTimesInterestEarned({
        interestExpense: 2000,
        operatingIncome: NaN,
      }),
    ).toThrow();
  });

  it("rejects overflow with a stable issue", () => {
    expect(
      runTimesInterestEarned({
        interestExpense: Number.MIN_VALUE,
        operatingIncome: Number.MAX_VALUE,
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ code: "result_not_finite", field: "operatingIncome" }],
      },
    });
  });

  it("rejects malformed runtime input", () => {
    expect(runTimesInterestEarned({ interestExpense: 2000 })).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_field", field: "operatingIncome" }] },
    });
    expect(
      runTimesInterestEarned({
        interestExpense: 2000,
        operatingIncome: "43000",
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_field", field: "operatingIncome" }] },
    });
  });

  it("rejects non-positive interest expense with a stable code", () => {
    expect(
      runTimesInterestEarned({ interestExpense: 0, operatingIncome: 43000 }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "positive_interest_expense_required",
            field: "interestExpense",
          },
        ],
      },
      ok: false,
    });
  });
});
