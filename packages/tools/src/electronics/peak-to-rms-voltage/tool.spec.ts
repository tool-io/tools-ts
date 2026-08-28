import { describe, expect, it } from "vitest";
import {
  calculatePeakToRmsVoltage,
  peakToRmsVoltageExample,
  runPeakToRmsVoltage,
} from "./tool.js";

describe("peak to rms voltage calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runPeakToRmsVoltage(peakToRmsVoltageExample.input)).toEqual({
      ok: true,
      output: peakToRmsVoltageExample.output,
    });
  });

  it("is consistent with the rms-to-peak inverse", () => {
    const peak = calculatePeakToRmsVoltage({
      peakVoltageV: 325.2691193458119,
    }).rmsVoltageV;
    expect(peak).toBeCloseTo(230, 9);
    expect(calculatePeakToRmsVoltage({ peakVoltageV: 0 }).rmsVoltageV).toBe(0);
  });

  it("rejects negative amplitude through execution", () => {
    expect(runPeakToRmsVoltage({ peakVoltageV: -1 }).ok).toBe(false);
  });
});
