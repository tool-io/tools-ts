import { describe, expect, it } from "vitest";
import { runCalibrationSlope, calibrationSlopeExample } from "./tool.js";
describe("Calibration Slope", () => {
  it("publishes an executable example", () =>
    expect(runCalibrationSlope(calibrationSlopeExample.input)).toEqual({
      ok: true,
      output: calibrationSlopeExample.output,
    }));
  it("is invariant to equal offsets in both responses", () =>
    expect(
      runCalibrationSlope({
        responseHigh: 1.3,
        responseLow: 0.5,
        concentrationHigh: 10,
        concentrationLow: 0,
      }),
    ).toEqual({ ok: true, output: { calibrationSlope: 0.08 } }));
  it("accepts a positive low concentration", () =>
    expect(
      runCalibrationSlope({
        responseHigh: 5,
        responseLow: 3,
        concentrationHigh: 10,
        concentrationLow: 2,
      }),
    ).toEqual({ ok: true, output: { calibrationSlope: 0.25 } }));
  it("rejects equal concentrations", () =>
    expect(
      runCalibrationSlope({
        responseHigh: 1,
        responseLow: 0,
        concentrationHigh: 5,
        concentrationLow: 5,
      }).ok,
    ).toBe(false));
  it("reports invalid_concentrations for a negative low concentration", () => {
    const result = runCalibrationSlope({
      responseHigh: 1,
      responseLow: 0,
      concentrationHigh: 10,
      concentrationLow: -1,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_concentrations");
  });
  it("reports invalid_concentrations when low exceeds high", () => {
    const result = runCalibrationSlope({
      responseHigh: 1,
      responseLow: 0,
      concentrationHigh: 1,
      concentrationLow: 2,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_concentrations");
  });
});
