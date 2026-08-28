import { describe, expect, it } from "vitest";
import {
  calculateThermalVoltage,
  runThermalVoltage,
  thermalVoltageExample,
} from "./tool.js";

describe("Thermal Voltage VT", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runThermalVoltage(thermalVoltageExample.input)).toEqual({
      ok: true,
      output: thermalVoltageExample.output,
    });
  });

  it("rejects non-positive temperature", () => {
    expect(runThermalVoltage({ temperatureK: 0 })).toMatchObject({
      error: { issues: [{ code: "invalid_temperature" }] },
      ok: false,
    });
  });

  it("is about 25.85 mV at room temperature", () => {
    expect(
      calculateThermalVoltage({ temperatureK: 300 }).thermalVoltageVolts,
    ).toBeGreaterThan(0.0258);
    expect(
      calculateThermalVoltage({ temperatureK: 300 }).thermalVoltageVolts,
    ).toBeLessThan(0.0259);
  });
});
