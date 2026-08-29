import { describe, expect, it } from "vitest";
import {
  calculateRetainedEarningsRollforward,
  retainedEarningsRollforwardExample,
  runRetainedEarningsRollforward,
} from "./tool.js";

describe("retained earnings rollforward", () => {
  it("executes its canonical example exactly", () => {
    expect(
      runRetainedEarningsRollforward(retainedEarningsRollforwardExample.input),
    ).toEqual({
      ok: true,
      output: retainedEarningsRollforwardExample.output,
    });
  });

  it("matches the OpenStax Banyan Goods case", () => {
    // Banyan Goods: 90,000 beginning, 35,000 net income, no dividends -> 125,000.
    expect(
      calculateRetainedEarningsRollforward({
        beginningRetainedEarnings: 90000,
        dividendsDeclared: 0,
        netIncome: 35000,
      }),
    ).toEqual({ endingRetainedEarnings: 125000 });
  });

  it("subtracts a net loss and dividends", () => {
    expect(
      calculateRetainedEarningsRollforward({
        beginningRetainedEarnings: 200000,
        dividendsDeclared: 30000,
        netIncome: -50000,
      }),
    ).toEqual({ endingRetainedEarnings: 120000 });
  });

  it("supports a deficit and normalizes negative zero", () => {
    expect(
      calculateRetainedEarningsRollforward({
        beginningRetainedEarnings: -10000,
        dividendsDeclared: 0,
        netIncome: 10000,
      }).endingRetainedEarnings,
    ).toBe(0);
    expect(
      calculateRetainedEarningsRollforward({
        beginningRetainedEarnings: 5000,
        dividendsDeclared: 5000,
        netIncome: 0,
      }).endingRetainedEarnings,
    ).toBe(0);
  });

  it("responds one-for-one to net income", () => {
    const base = calculateRetainedEarningsRollforward({
      beginningRetainedEarnings: 100000,
      dividendsDeclared: 15000,
      netIncome: 50000,
    });
    expect(
      calculateRetainedEarningsRollforward({
        beginningRetainedEarnings: 100000,
        dividendsDeclared: 15000,
        netIncome: 75000,
      }).endingRetainedEarnings,
    ).toBe(base.endingRetainedEarnings + 25000);
  });

  it("rejects negative dividends at the schema boundary", () => {
    expect(
      runRetainedEarningsRollforward({
        beginningRetainedEarnings: 100000,
        dividendsDeclared: -15000,
        netIncome: 50000,
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ code: "invalid_field", field: "dividendsDeclared" }],
      },
    });
  });

  it("rejects negative dividends in direct calls with a stable code", () => {
    expect(() =>
      calculateRetainedEarningsRollforward({
        beginningRetainedEarnings: 100000,
        dividendsDeclared: -15000,
        netIncome: 50000,
      }),
    ).toThrow();
  });

  it("rejects malformed runtime input", () => {
    expect(
      runRetainedEarningsRollforward({
        beginningRetainedEarnings: 100000,
        dividendsDeclared: 15000,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_field", field: "netIncome" }] },
    });
  });

  it("rejects invalid direct input", () => {
    expect(() =>
      calculateRetainedEarningsRollforward({
        beginningRetainedEarnings: NaN,
        dividendsDeclared: 0,
        netIncome: 0,
      }),
    ).toThrow();
    expect(() =>
      calculateRetainedEarningsRollforward({
        beginningRetainedEarnings: 0,
        dividendsDeclared: Infinity,
        netIncome: 0,
      }),
    ).toThrow();
  });
});
