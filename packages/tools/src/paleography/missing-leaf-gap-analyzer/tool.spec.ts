import { describe, expect, it } from "vitest";
import {
  calculateMissingLeafGapAnalyzer,
  missingLeafGapAnalyzerExample,
  runMissingLeafGapAnalyzer,
} from "./tool.js";

describe("missing-leaf-gap-analyzer", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runMissingLeafGapAnalyzer(missingLeafGapAnalyzerExample.input),
    ).toEqual({ ok: true, output: missingLeafGapAnalyzerExample.output });
  });

  it("summarises scattered gaps with separate runs", () => {
    const result = runMissingLeafGapAnalyzer({
      expectedTotalLeaves: 10,
      presentLeafNumbers: [2, 3, 5, 6, 7, 9],
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.missingLeafNumbers as number[]).toEqual([1, 4, 8, 10]);
    expect(result.output.gapSummary as string).toBe("1,4,8,10");
  });

  it("rejects out-of-range folio numbers", () => {
    expect(
      runMissingLeafGapAnalyzer({
        expectedTotalLeaves: 8,
        presentLeafNumbers: [9],
      }).ok,
    ).toBe(false);
  });

  it("rejects duplicated folio numbers", () => {
    expect(
      runMissingLeafGapAnalyzer({
        expectedTotalLeaves: 8,
        presentLeafNumbers: [3, 3],
      }).ok,
    ).toBe(false);
  });

  it("rejects unsafe totals before attempting to enumerate leaves", () => {
    expect(() =>
      calculateMissingLeafGapAnalyzer({
        expectedTotalLeaves: Number.MAX_SAFE_INTEGER,
        presentLeafNumbers: [],
      }),
    ).toThrowError("Expected leaf total must be an integer");
  });
});
