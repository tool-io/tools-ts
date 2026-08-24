import { describe, expect, it } from "vitest";
import {
  calculateFlashThresholdVoltageShift,
  flashThresholdVoltageShiftExample,
  runFlashThresholdVoltageShift,
} from "./tool.js";

describe("Flash Threshold Voltage Shift Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runFlashThresholdVoltageShift(flashThresholdVoltageShiftExample.input),
    ).toEqual({ ok: true, output: flashThresholdVoltageShiftExample.output });
  });

  it("uses the charge-to-capacitance magnitude qN/C", () => {
    expect(
      calculateFlashThresholdVoltageShift({
        effectiveCapacitanceFemtoFarads: 10,
        trappedElectronCount: 2_000,
      }).thresholdShiftMagnitudeVolts,
    ).toBeCloseTo(0.03204353267999999, 14);
  });

  it("returns zero for no trapped electrons", () => {
    expect(
      calculateFlashThresholdVoltageShift({
        effectiveCapacitanceFemtoFarads: 10,
        trappedElectronCount: 0,
      }),
    ).toEqual({ thresholdShiftMagnitudeVolts: 0 });
  });

  it("halves the magnitude when effective capacitance doubles", () => {
    const at10 = calculateFlashThresholdVoltageShift({
      effectiveCapacitanceFemtoFarads: 10,
      trappedElectronCount: 1_000,
    }).thresholdShiftMagnitudeVolts;
    const at20 = calculateFlashThresholdVoltageShift({
      effectiveCapacitanceFemtoFarads: 20,
      trappedElectronCount: 1_000,
    }).thresholdShiftMagnitudeVolts;
    expect(at20).toBe(at10 / 2);
  });

  it("rejects invalid counts and capacitances", () => {
    for (const input of [
      { effectiveCapacitanceFemtoFarads: 10, trappedElectronCount: -1 },
      { effectiveCapacitanceFemtoFarads: 10, trappedElectronCount: 1.5 },
      { effectiveCapacitanceFemtoFarads: 0, trappedElectronCount: 1 },
      {
        effectiveCapacitanceFemtoFarads: Number.POSITIVE_INFINITY,
        trappedElectronCount: 1,
      },
    ])
      expect(runFlashThresholdVoltageShift(input).ok).toBe(false);
  });

  it("rejects missing inputs", () => {
    expect(runFlashThresholdVoltageShift({}).ok).toBe(false);
  });
});
