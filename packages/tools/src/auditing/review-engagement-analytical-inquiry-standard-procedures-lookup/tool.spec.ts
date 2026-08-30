import { describe, expect, it } from "vitest";
import {
  performReviewAnalyticalInquiry,
  reviewAnalyticalExample,
  runReviewAnalytical,
} from "./tool.js";

describe("review engagement analytical inquiry", () => {
  it("reproduces its canonical example", () => {
    expect(runReviewAnalytical(reviewAnalyticalExample.input)).toEqual({
      ok: true,
      output: reviewAnalyticalExample.output,
    });
  });

  it("accepts a difference exactly at tolerance", () => {
    expect(
      performReviewAnalyticalInquiry({
        expectations: [100],
        results: [110],
        tolerances: [10],
      }).followUpRequired,
    ).toBe(false);
  });

  it("flags each result beyond tolerance", () => {
    expect(
      performReviewAnalyticalInquiry({
        expectations: [100, 100],
        results: [120, 80],
        tolerances: [10, 10],
      }).exceptionIndices,
    ).toEqual([0, 1]);
  });

  it("rejects mismatched analytical arrays", () => {
    expect(
      runReviewAnalytical({ expectations: [1], results: [], tolerances: [1] }),
    ).toMatchObject({
      error: {
        issues: [{ code: "analytical_data_length_mismatch", field: "" }],
      },
      ok: false,
    });
  });
});
