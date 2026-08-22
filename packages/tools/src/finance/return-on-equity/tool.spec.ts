import { describe, expect, it } from "vitest";
import {
  calculateReturnOnEquity,
  returnOnEquityExample,
  runReturnOnEquity,
} from "./tool.js";

describe("Return on Equity Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runReturnOnEquity(returnOnEquityExample.input)).toEqual({
      ok: true,
      output: returnOnEquityExample.output,
    });
  });

  it("calculates roe for another valid input", () => {
    expect(
      calculateReturnOnEquity({ netIncome: 12000, shareholdersEquity: 80000 }),
    ).toEqual({ roe: 0.15 });
  });

  it("reports negative roe when net income is negative", () => {
    expect(
      calculateReturnOnEquity({
        netIncome: -20000,
        shareholdersEquity: 100000,
      }),
    ).toEqual({ roe: -0.2 });
  });

  it("allows negative equity and reports the signed ratio", () => {
    expect(
      runReturnOnEquity({ netIncome: 5000, shareholdersEquity: -25000 }),
    ).toEqual({ ok: true, output: { roe: -0.2 } });
  });

  it("rejects zero equity with division_not_allowed", () => {
    expect(
      runReturnOnEquity({ netIncome: 1000, shareholdersEquity: 0 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "division_not_allowed", field: "shareholdersEquity" }],
      },
      ok: false,
    });
  });

  it("rejects non-finite input", () => {
    const result = runReturnOnEquity({
      netIncome: Number.NaN,
      shareholdersEquity: 250000,
    });
    expect(result).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "netIncome" }] },
      ok: false,
    });
  });

  it("rejects unknown fields", () => {
    expect(
      runReturnOnEquity({
        extra: 1,
        netIncome: 50000,
        shareholdersEquity: 250000,
      }).ok,
    ).toBe(false);
  });
});
