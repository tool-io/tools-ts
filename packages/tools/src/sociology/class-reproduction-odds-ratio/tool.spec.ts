import { describe, expect, it } from "vitest";
import {
  calculateClassReproductionOddsRatio,
  classReproductionOddsRatioExample,
  classReproductionOddsRatioTool,
  runClassReproductionOddsRatio,
} from "./tool.js";

describe("classReproductionOddsRatioTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runClassReproductionOddsRatio(classReproductionOddsRatioExample.input),
    ).toEqual({
      ok: true,
      output: classReproductionOddsRatioExample.output,
    });
  });

  it("computes the cross-product odds ratio and rejects a zero denominator", () => {
    expect(
      calculateClassReproductionOddsRatio({
        bottomToBottom: 8,
        bottomToTop: 4,
        topToBottom: 2,
        topToTop: 6,
      }),
    ).toEqual({ reproductionOddsRatio: 6 });
    const result = runClassReproductionOddsRatio({
      bottomToBottom: 8,
      bottomToTop: 0,
      topToBottom: 2,
      topToTop: 6,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0].field).toBe("topToBottom");
  });

  it("keeps the example portable across JSON", () => {
    expect(
      JSON.parse(JSON.stringify(classReproductionOddsRatioExample)),
    ).toEqual(classReproductionOddsRatioExample);
    expect(classReproductionOddsRatioTool.contractVersion).toBe(1);
    expect(classReproductionOddsRatioTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runClassReproductionOddsRatio(null).ok).toBe(false);
    expect(
      runClassReproductionOddsRatio({
        ...classReproductionOddsRatioExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
