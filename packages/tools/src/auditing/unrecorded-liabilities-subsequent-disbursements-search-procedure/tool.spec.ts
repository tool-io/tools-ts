import { describe, expect, it } from "vitest";
import {
  runSubsequentDisbursement,
  searchUnrecordedLiabilities,
  subsequentDisbursementExample,
} from "./tool.js";

describe("unrecorded liability subsequent disbursement search", () => {
  it("reproduces its canonical example", () => {
    expect(
      runSubsequentDisbursement(subsequentDisbursementExample.input),
    ).toEqual({
      ok: true,
      output: subsequentDisbursementExample.output,
    });
  });

  it("excludes payments dated after the balance date", () => {
    expect(
      searchUnrecordedLiabilities({ payments: [[1, 5000]] })
        .possibleUnrecordedCount,
    ).toBe(0);
  });

  it("returns zero exposure for an empty payment population", () => {
    expect(searchUnrecordedLiabilities({ payments: [] })).toEqual({
      possibleUnrecordedCount: 0,
      possibleUnrecordedIndices: [],
      possibleUnrecordedTotal: 0,
      paymentsSearched: 0,
    });
  });

  it("rejects a nonpositive payment amount", () => {
    expect(runSubsequentDisbursement({ payments: [[0, 0]] })).toMatchObject({
      error: {
        issues: [{ code: "invalid_payment_amount", field: "payments.0.1" }],
      },
      ok: false,
    });
  });
});
