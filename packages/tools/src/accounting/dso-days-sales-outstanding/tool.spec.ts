import { describe, expect, it } from "vitest";
import {
  calculateDsoDaysSalesOutstanding,
  dsoDaysSalesOutstandingExample,
  runDsoDaysSalesOutstanding,
} from "./tool.js";

describe("DSO days sales outstanding calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runDsoDaysSalesOutstanding(dsoDaysSalesOutstandingExample.input),
    ).toEqual({
      ok: true,
      output: dsoDaysSalesOutstandingExample.output,
    });
  });

  it("computes an independently known value", () => {
    expect(
      calculateDsoDaysSalesOutstanding({
        averageAccountsReceivable: 100000,
        creditSales: 500000,
        daysInPeriod: 360,
      }),
    ).toEqual({ daysSalesOutstanding: 72 });
  });

  it("scales linearly in accounts receivable and period length", () => {
    const base = calculateDsoDaysSalesOutstanding({
      averageAccountsReceivable: 480000,
      creditSales: 4000000,
      daysInPeriod: 365,
    });
    const doubled = calculateDsoDaysSalesOutstanding({
      averageAccountsReceivable: 960000,
      creditSales: 4000000,
      daysInPeriod: 365,
    });
    expect(doubled.daysSalesOutstanding).toBeCloseTo(
      base.daysSalesOutstanding * 2,
      12,
    );
  });

  it("rejects negative receivables in direct calls", () => {
    expect(() =>
      calculateDsoDaysSalesOutstanding({
        averageAccountsReceivable: -1,
        creditSales: 100,
        daysInPeriod: 365,
      }),
    ).toThrow();
  });

  it("rejects zero credit sales with a stable code", () => {
    expect(
      runDsoDaysSalesOutstanding({
        averageAccountsReceivable: 50000,
        creditSales: 0,
        daysInPeriod: 365,
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "positive_credit_sales_required", field: "creditSales" },
        ],
      },
      ok: false,
    });
  });

  it("rejects a non-positive period length with a stable code", () => {
    expect(
      runDsoDaysSalesOutstanding({
        averageAccountsReceivable: 50000,
        creditSales: 365000,
        daysInPeriod: 0,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "positive_days_required", field: "daysInPeriod" }],
      },
      ok: false,
    });
  });

  it("defaults the period to a full year", () => {
    const result = runDsoDaysSalesOutstanding({
      averageAccountsReceivable: 50000,
      creditSales: 365000,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.daysSalesOutstanding).toBe(50);
  });
});
