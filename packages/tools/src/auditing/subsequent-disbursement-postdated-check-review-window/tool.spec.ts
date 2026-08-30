import { describe, expect, it } from "vitest";
import {
  disbursementReviewWindowExample,
  reviewPostdatedCheckWindow,
  runDisbursementReviewWindow,
} from "./tool.js";

describe("subsequent disbursement review window", () => {
  it("reproduces its canonical example", () => {
    expect(
      runDisbursementReviewWindow(disbursementReviewWindowExample.input),
    ).toEqual({
      ok: true,
      output: disbursementReviewWindowExample.output,
    });
  });

  it("includes a payment on the balance date", () => {
    expect(
      reviewPostdatedCheckWindow({
        balanceDate: "2026-01-01",
        payments: [[0, 100]],
        searchEndDate: "2026-02-01",
        windowDays: 0,
      }).inWindowIndices,
    ).toEqual([0]);
  });

  it("excludes a payment beyond the search end date", () => {
    expect(
      reviewPostdatedCheckWindow({
        balanceDate: "2026-01-01",
        payments: [[40, 100]],
        searchEndDate: "2026-02-01",
        windowDays: 60,
      }).outsideWindowCount,
    ).toBe(1);
  });

  it("rejects a reversed review date range", () => {
    expect(
      runDisbursementReviewWindow({
        balanceDate: "2026-02-01",
        payments: [],
        searchEndDate: "2026-01-01",
        windowDays: 30,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_review_window", field: "searchEndDate" }],
      },
      ok: false,
    });
  });
});
