import { describe, expect, it } from "vitest";
import {
  bidSplittingExample,
  detectBidSplittingAnalytics,
  runBidSplitting,
} from "./tool.js";

describe("vendor bid splitting analytics", () => {
  it("reproduces its canonical example", () => {
    expect(runBidSplitting(bidSplittingExample.input)).toEqual({
      ok: true,
      output: bidSplittingExample.output,
    });
  });

  it("excludes a group whose aggregate stays below the threshold", () => {
    expect(
      detectBidSplittingAnalytics({
        approvalThreshold: 1000,
        bidAmounts: [400, 400],
        minimumBidsPerVendor: 2,
        vendorKeys: ["A", "A"],
      }).suspiciousGroupCount,
    ).toBe(0);
  });

  it("excludes a group with one bid at the threshold", () => {
    expect(
      detectBidSplittingAnalytics({
        approvalThreshold: 1000,
        bidAmounts: [1000, 400],
        minimumBidsPerVendor: 2,
        vendorKeys: ["A", "A"],
      }).suspiciousVendorKeys,
    ).toEqual([]);
  });

  it("rejects mismatched vendor and bid arrays", () => {
    expect(
      runBidSplitting({
        approvalThreshold: 1000,
        bidAmounts: [100],
        minimumBidsPerVendor: 2,
        vendorKeys: [],
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "bid_data_length_mismatch", field: "bidAmounts" }],
      },
      ok: false,
    });
  });
});
