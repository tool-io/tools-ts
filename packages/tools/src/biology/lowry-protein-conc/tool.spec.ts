import { describe, expect, it } from "vitest";
import { runLowryProteinConc } from "./tool.js";

describe("Lowry Protein Conc", () => {
  it("calculates a valid result", () =>
    expect(
      runLowryProteinConc({
        absorbance750: 0.75,
        calibrationSlope: 0.01,
        intercept: 0.05,
      }),
    ).toEqual({
      ok: true,
      output: { proteinUgPerMl: 70 },
    }));
  it("returns zero at the blank reading", () =>
    expect(
      runLowryProteinConc({
        absorbance750: 0.05,
        calibrationSlope: 0.01,
        intercept: 0.05,
      }),
    ).toEqual({
      ok: true,
      output: { proteinUgPerMl: 0 },
    }));
  it("rejects readings below the calibration blank", () => {
    const result = runLowryProteinConc({
      absorbance750: 0.01,
      calibrationSlope: 0.01,
      intercept: 0.05,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("below_calibration_range");
  });
  it("rejects a zero slope", () =>
    expect(
      runLowryProteinConc({
        absorbance750: 0.75,
        calibrationSlope: 0,
        intercept: 0.05,
      }).ok,
    ).toBe(false));
  it("rejects non-finite intercepts", () =>
    expect(
      runLowryProteinConc({
        absorbance750: 0.75,
        calibrationSlope: 0.01,
        intercept: Number.NaN,
      }).ok,
    ).toBe(false));
});
