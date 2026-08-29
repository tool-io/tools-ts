import { describe, expect, it } from "vitest";
import {
  calculateFreeCashFlow,
  freeCashFlowExample,
  runFreeCashFlow,
} from "./tool.js";

describe("free cash flow", () => {
  it("executes its canonical example exactly", () => {
    expect(runFreeCashFlow(freeCashFlowExample.input)).toEqual({
      ok: true,
      output: freeCashFlowExample.output,
    });
  });

  it("computes an independently known value", () => {
    expect(
      calculateFreeCashFlow({
        capitalExpenditures: 25000,
        operatingCashFlow: 80000,
      }),
    ).toEqual({ freeCashFlow: 55000 });
  });

  it("reports negative free cash flow when capex exceeds operating cash", () => {
    expect(
      calculateFreeCashFlow({
        capitalExpenditures: 50000,
        operatingCashFlow: 30000,
      }),
    ).toEqual({ freeCashFlow: -20000 });
  });

  it("normalizes negative zero at the exact balance point", () => {
    expect(
      calculateFreeCashFlow({
        capitalExpenditures: 50000,
        operatingCashFlow: 50000,
      }).freeCashFlow,
    ).toBe(0);
  });

  it("rejects malformed runtime input", () => {
    expect(runFreeCashFlow({ operatingCashFlow: 100000 })).toMatchObject({
      ok: false,
      error: {
        issues: [{ code: "invalid_field", field: "capitalExpenditures" }],
      },
    });
    expect(
      runFreeCashFlow({
        capitalExpenditures: "30000",
        operatingCashFlow: 100000,
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ code: "invalid_field", field: "capitalExpenditures" }],
      },
    });
  });

  it("rejects non-finite direct input", () => {
    expect(() =>
      calculateFreeCashFlow({
        capitalExpenditures: 30000,
        operatingCashFlow: NaN,
      }),
    ).toThrow();
    expect(() =>
      calculateFreeCashFlow({
        capitalExpenditures: Infinity,
        operatingCashFlow: 100000,
      }),
    ).toThrow();
  });
});
