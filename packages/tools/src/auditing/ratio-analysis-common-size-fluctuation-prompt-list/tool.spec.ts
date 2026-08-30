import { describe, expect, it } from "vitest";
import {
  analyzeCommonSizeChanges,
  commonSizeAnalysisExample,
  runCommonSizeAnalysis,
} from "./tool.js";

describe("common-size ratio fluctuation analysis", () => {
  it("reproduces its canonical example", () => {
    expect(runCommonSizeAnalysis(commonSizeAnalysisExample.input)).toEqual({
      ok: true,
      output: commonSizeAnalysisExample.output,
    });
  });

  it("flags an exact percentage-point threshold", () => {
    expect(
      analyzeCommonSizeChanges({
        currentAmounts: [55, 45],
        priorAmounts: [50, 50],
        thresholdPercentagePoints: 5,
      }).flaggedIndices,
    ).toEqual([0, 1]);
  });

  it("reports no changes for identical periods", () => {
    expect(
      analyzeCommonSizeChanges({
        currentAmounts: [1, 1],
        priorAmounts: [1, 1],
        thresholdPercentagePoints: 0,
      }).changePercentagePoints,
    ).toEqual([0, 0]);
  });

  it("rejects a zero prior-period total", () => {
    expect(
      runCommonSizeAnalysis({
        currentAmounts: [1],
        priorAmounts: [0],
        thresholdPercentagePoints: 5,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "zero_common_size_total", field: "" }] },
      ok: false,
    });
  });
});
