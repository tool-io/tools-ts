import { describe, expect, it } from "vitest";
import { lineCountEstimatorExample, runLineCountEstimator } from "./tool.js";

describe("line-count-estimator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runLineCountEstimator(lineCountEstimatorExample.input)).toEqual({
      ok: true,
      output: lineCountEstimatorExample.output,
    });
  });

  it("returns an exact whole-line count when text divides evenly", () => {
    const result = runLineCountEstimator({
      totalCharacters: 100,
      charactersPerLine: 20,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.rawLineCount as number).toBe(5);
    expect(result.output.estimatedLineCount as number).toBe(5);
  });

  it("rejects a zero column width", () => {
    expect(
      runLineCountEstimator({ totalCharacters: 100, charactersPerLine: 0 }).ok,
    ).toBe(false);
    expect(
      runLineCountEstimator({ totalCharacters: 10.5, charactersPerLine: 5 }).ok,
    ).toBe(false);
  });
});
