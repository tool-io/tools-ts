import { describe, expect, it } from "vitest";
import {
  calculatePayableTurnover,
  payableTurnoverExample,
  runPayableTurnover,
} from "./tool.js";

describe("payable turnover", () => {
  it("executes its canonical example exactly", () => {
    expect(runPayableTurnover(payableTurnoverExample.input)).toEqual({
      ok: true,
      output: payableTurnoverExample.output,
    });
  });
  it("calculates four payments and a ninety-day interval", () => {
    expect(
      calculatePayableTurnover({
        creditPurchases: 100000,
        averageAccountsPayable: 25000,
        daysInPeriod: 360,
      }),
    ).toEqual({ payableTurnover: 4, daysPayableOutstanding: 90 });
  });
  it("is unchanged by currency scaling", () => {
    expect(
      calculatePayableTurnover({
        creditPurchases: 1200000,
        averageAccountsPayable: 100000,
        daysInPeriod: 360,
      }),
    ).toEqual(payableTurnoverExample.output);
  });
  it.each([
    "creditPurchases",
    "averageAccountsPayable",
    "daysInPeriod",
  ] as const)("rejects zero %s", (field) => {
    expect(
      runPayableTurnover({ ...payableTurnoverExample.input, [field]: 0 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "positive_value_required", field }] },
    });
  });
  it("rejects malformed and non-finite values", () => {
    for (const creditPurchases of [undefined, "600000", NaN, Infinity, -1]) {
      expect(
        runPayableTurnover({
          ...payableTurnoverExample.input,
          creditPurchases,
        }),
      ).toMatchObject({
        ok: false,
        error: {
          issues: [{ code: "invalid_field", field: "creditPurchases" }],
        },
      });
    }
  });
  it("rejects an unrepresentable ratio", () => {
    expect(
      runPayableTurnover({
        creditPurchases: Number.MAX_VALUE,
        averageAccountsPayable: Number.MIN_VALUE,
        daysInPeriod: 365,
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ code: "result_out_of_range", field: "creditPurchases" }],
      },
    });
  });
});
