import { describe, expect, it } from "vitest";
import { hallVoltageExample, runHallVoltage } from "./tool.js";
describe("Hall Voltage", () => {
  it("publishes an executable example", () =>
    expect(runHallVoltage(hallVoltageExample.input)).toEqual({
      ok: true,
      output: hallVoltageExample.output,
    }));
  it("yields zero voltage at zero field", () =>
    expect(
      runHallVoltage({
        currentAmps: 1,
        fluxDensityTesla: 0,
        chargeCarrierDensityPerM3: 1e28,
        thicknessMeters: 0.001,
      }),
    ).toEqual({ ok: true, output: { hallVoltageV: 0 } }));
  it("rejects zero current", () =>
    expect(
      runHallVoltage({
        currentAmps: 0,
        fluxDensityTesla: 1,
        chargeCarrierDensityPerM3: 1e28,
        thicknessMeters: 0.001,
      }).ok,
    ).toBe(false));
  it("rejects zero thickness", () =>
    expect(
      runHallVoltage({
        currentAmps: 1,
        fluxDensityTesla: 1,
        chargeCarrierDensityPerM3: 1e28,
        thicknessMeters: 0,
      }).ok,
    ).toBe(false));
});
