import { describe, expect, it } from "vitest";
import {
  calculateDecibelVoltageRatio,
  decibelVoltageRatioExample,
  runDecibelVoltageRatio,
} from "./tool.js";

describe("decibel voltage ratio calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDecibelVoltageRatio(decibelVoltageRatioExample.input)).toEqual({
      ok: true,
      output: decibelVoltageRatioExample.output,
    });
  });

  it("gives 0 dB for equal voltages and -20 dB for a tenth", () => {
    expect(
      calculateDecibelVoltageRatio({
        measuredVoltageV: 2.5,
        referenceVoltageV: 2.5,
      }).decibelsDb,
    ).toBe(0);
    expect(
      calculateDecibelVoltageRatio({
        measuredVoltageV: 0.1,
        referenceVoltageV: 1,
      }).decibelsDb,
    ).toBe(-20);
    expect(
      calculateDecibelVoltageRatio({
        measuredVoltageV: 100,
        referenceVoltageV: 1,
      }).decibelsDb,
    ).toBe(40);
  });

  it("rejects non-positive voltage amplitudes through execution", () => {
    for (const bad of [
      { measuredVoltageV: 10, referenceVoltageV: 0 },
      { measuredVoltageV: -10, referenceVoltageV: 1 },
    ])
      expect(runDecibelVoltageRatio(bad).ok).toBe(false);
  });
});
