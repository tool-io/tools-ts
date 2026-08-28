import { describe, expect, it } from "vitest";
import {
  calculateRmsToPeakVoltage,
  rmsToPeakVoltageExample,
  runRmsToPeakVoltage,
} from "./tool.js";

describe("rms to peak voltage calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runRmsToPeakVoltage(rmsToPeakVoltageExample.input)).toEqual({
      ok: true,
      output: rmsToPeakVoltageExample.output,
    });
  });

  it("is consistent with the peak-to-rms inverse", () => {
    const peak = calculateRmsToPeakVoltage({
      rmsVoltageV: 10 / Math.SQRT2,
    }).peakVoltageV;
    expect(peak).toBeCloseTo(10, 12);
    expect(calculateRmsToPeakVoltage({ rmsVoltageV: 0 }).peakVoltageV).toBe(0);
  });

  it("rejects negative RMS voltage through execution", () => {
    expect(runRmsToPeakVoltage({ rmsVoltageV: -230 }).ok).toBe(false);
  });
});
