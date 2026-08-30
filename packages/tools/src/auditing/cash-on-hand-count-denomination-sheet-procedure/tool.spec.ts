import { describe, expect, it } from "vitest";
import {
  cashDenominationExample,
  reconcileCashDenominations,
  runCashDenomination,
} from "./tool.js";

describe("cash on hand denomination sheet", () => {
  it("reproduces its canonical example", () => {
    expect(runCashDenomination(cashDenominationExample.input)).toEqual({
      ok: true,
      output: cashDenominationExample.output,
    });
  });

  it("reports a counted overage by denomination", () => {
    expect(
      reconcileCashDenominations({
        countedTotals: [210],
        denominationValues: [100],
        expectedTotal: 200,
        systemCounts: [2],
        tolerance: 0,
      }),
    ).toMatchObject({ overallDifference: 10, reconciled: false });
  });

  it("reconciles a difference within tolerance", () => {
    expect(
      reconcileCashDenominations({
        countedTotals: [199],
        denominationValues: [100],
        expectedTotal: 200,
        systemCounts: [2],
        tolerance: 1,
      }).reconciled,
    ).toBe(true);
  });

  it("rejects mismatched cash data lengths", () => {
    expect(
      runCashDenomination({
        countedTotals: [100],
        denominationValues: [100, 50],
        expectedTotal: 100,
        systemCounts: [1],
        tolerance: 0,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "cash_data_length_mismatch", field: "countedTotals" }],
      },
      ok: false,
    });
  });
});
