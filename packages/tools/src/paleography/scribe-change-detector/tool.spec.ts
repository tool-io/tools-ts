import { describe, expect, it } from "vitest";
import {
  runScribeChangeDetector,
  scribeChangeDetectorExample,
} from "./tool.js";

describe("scribe-change-detector", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runScribeChangeDetector(scribeChangeDetectorExample.input)).toEqual({
      ok: true,
      output: scribeChangeDetectorExample.output,
    });
  });

  it("sees no change between near-identical sections", () => {
    const result = runScribeChangeDetector({
      lineSpacingAMm: 6,
      lineSpacingBMm: 6,
      lettersPerLineA: 40,
      lettersPerLineB: 40,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.scribeChangeFlagged).toBe(false);
    expect(result.output.flaggedMetric).toBe("none");
  });

  it("rejects non-positive measurements", () => {
    expect(
      runScribeChangeDetector({
        lineSpacingAMm: 0,
        lineSpacingBMm: 6,
        lettersPerLineA: 40,
        lettersPerLineB: 40,
      }).ok,
    ).toBe(false);
  });

  it("keeps symmetric deviation stable when the sum would overflow", () => {
    const result = runScribeChangeDetector({
      lineSpacingAMm: 1.7e308,
      lineSpacingBMm: 8.5e307,
      lettersPerLineA: 40,
      lettersPerLineB: 40,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.lineSpacingDeviationPercent).toBeCloseTo(
      66.66666666666667,
      12,
    );
    expect(result.output.flaggedMetric).toBe("line_spacing");
  });
});
