import { describe, expect, it } from "vitest";
import {
  detectLappingPatterns,
  lappingPatternExample,
  runLappingPattern,
} from "./tool.js";

describe("lapping receipt delay pattern detector", () => {
  it("reproduces its canonical example", () => {
    expect(runLappingPattern(lappingPatternExample.input)).toEqual({
      ok: true,
      output: lappingPatternExample.output,
    });
  });

  it("flags a pair at the exact delay boundary", () => {
    expect(
      detectLappingPatterns({
        maximumDelayDays: 5,
        paymentReceiptPairs: [[100, 100, 5, 1]],
      }).patternCount,
    ).toBe(1);
  });

  it("excludes pairs from the same customer account", () => {
    expect(
      detectLappingPatterns({
        maximumDelayDays: 5,
        paymentReceiptPairs: [[100, 100, 1, 0]],
      }).patternCount,
    ).toBe(0);
  });

  it("rejects a malformed pattern row", () => {
    expect(
      runLappingPattern({
        maximumDelayDays: 5,
        paymentReceiptPairs: [[100, 100, 1]],
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_pair_row", field: "paymentReceiptPairs.0" }],
      },
      ok: false,
    });
  });
});
