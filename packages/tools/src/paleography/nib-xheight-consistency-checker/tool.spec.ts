import { describe, expect, it } from "vitest";
import {
  nibXheightConsistencyCheckerExample,
  runNibXheightConsistencyChecker,
} from "./tool.js";

describe("nib-xheight-consistency-checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runNibXheightConsistencyChecker(
        nibXheightConsistencyCheckerExample.input,
      ),
    ).toEqual({
      ok: true,
      output: nibXheightConsistencyCheckerExample.output,
    });
  });

  it("flags an erratic hand beyond tolerance", () => {
    const result = runNibXheightConsistencyChecker({
      xHeightMeasurementsMm: [2.4, 3.4],
      tolerancePercent: 10,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.consistent).toBe(false);
  });

  it("rejects non-positive measurements", () => {
    expect(
      runNibXheightConsistencyChecker({ xHeightMeasurementsMm: [3, 0] }).ok,
    ).toBe(false);
  });

  it("computes a finite mean when an ordinary sum would overflow", () => {
    const result = runNibXheightConsistencyChecker({
      xHeightMeasurementsMm: [1e308, 1e308],
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.meanXHeightMm).toBe(1e308);
    expect(result.output.spreadPercent).toBe(0);
  });
});
