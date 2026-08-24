import { describe, expect, it } from "vitest";
import {
  calculateSolarCellOpenCircuitVoltage,
  runSolarCellOpenCircuitVoltage,
  solarCellOpenCircuitVoltageExample,
} from "./tool.js";

describe("solar-cell open-circuit voltage", () => {
  it("reproduces the documented example", () =>
    expect(
      runSolarCellOpenCircuitVoltage(solarCellOpenCircuitVoltageExample.input),
    ).toEqual({ ok: true, output: solarCellOpenCircuitVoltageExample.output }));
  it("scales with ideality factor and temperature", () => {
    const base = calculateSolarCellOpenCircuitVoltage(
      solarCellOpenCircuitVoltageExample.input,
    );
    const scaled = calculateSolarCellOpenCircuitVoltage({
      ...solarCellOpenCircuitVoltageExample.input,
      idealityFactor: 2,
      temperatureKelvin: 600,
    });
    expect(scaled.openCircuitVoltage).toBeCloseTo(
      4 * base.openCircuitVoltage,
      12,
    );
  });
  it("handles a current ratio that overflows without returning infinity", () => {
    const result = runSolarCellOpenCircuitVoltage({
      j0MAPerCm2: Number.MIN_VALUE,
      jscMAPerCm2: Number.MAX_VALUE,
    });
    expect(result.ok && Number.isFinite(result.output.openCircuitVoltage)).toBe(
      true,
    );
  });
});
