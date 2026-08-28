import { describe, expect, it } from "vitest";
import {
  runCalibrationIntercept,
  calibrationInterceptExample,
} from "./tool.js";
describe("Calibration Intercept", () => {
  it("publishes an executable example", () =>
    expect(runCalibrationIntercept(calibrationInterceptExample.input)).toEqual({
      ok: true,
      output: calibrationInterceptExample.output,
    }));
  it("returns the response when the low concentration is zero", () =>
    expect(
      runCalibrationIntercept({
        responseLow: 0.15,
        concentrationLow: 0,
        slope: 0.08,
      }),
    ).toEqual({ ok: true, output: { calibrationIntercept: 0.15 } }));
  it("produces a negative intercept for a steep slope", () =>
    expect(
      runCalibrationIntercept({
        responseLow: 1,
        concentrationLow: 4,
        slope: 0.5,
      }),
    ).toEqual({ ok: true, output: { calibrationIntercept: -1 } }));
  it("rejects non-finite slope input", () =>
    expect(
      runCalibrationIntercept({
        responseLow: 0.2,
        concentrationLow: 2.5,
        slope: Number.NaN,
      }).ok,
    ).toBe(false));
});
