import { describe, expect, it } from "vitest";
import {
  arCreditBalanceReviewExample,
  reviewArCreditBalances,
  runArCreditBalanceReview,
} from "./tool.js";

describe("AR negative credit balance review", () => {
  it("reproduces its canonical example", () => {
    expect(
      runArCreditBalanceReview(arCreditBalanceReviewExample.input),
    ).toEqual({
      ok: true,
      output: arCreditBalanceReviewExample.output,
    });
  });

  it("flags a credit balance exactly at the threshold", () => {
    expect(
      reviewArCreditBalances({
        absoluteThreshold: 1000,
        accountBalances: [-1000],
        ages: [10],
      }).flaggedIndices,
    ).toEqual([0]);
  });

  it("ignores debit balances", () => {
    expect(
      reviewArCreditBalances({
        absoluteThreshold: 1000,
        accountBalances: [5000],
        ages: [10],
      }),
    ).toMatchObject({ flaggedCount: 0, totalCreditBalances: 0 });
  });

  it("rejects mismatched balances and ages", () => {
    expect(
      runArCreditBalanceReview({
        absoluteThreshold: 100,
        accountBalances: [-100],
        ages: [],
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "review_data_length_mismatch", field: "ages" }],
      },
      ok: false,
    });
  });
});
