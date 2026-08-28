import { describe, expect, it } from "vitest";
import {
  calculateMotorElectricalPower,
  motorElectricalPowerExample,
  runMotorElectricalPower,
} from "./tool.js";

describe("motor electrical power", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runMotorElectricalPower(motorElectricalPowerExample.input)).toEqual({
      ok: true,
      output: motorElectricalPowerExample.output,
    });
  });

  it("multiplies voltage by current linearly", () => {
    expect(
      calculateMotorElectricalPower({
        currentAmps: 0.5,
        voltageVolts: 7.4,
      }).electricalPowerWatts,
    ).toBeCloseTo(3.7, 12);
  });

  it("accepts zero on either axis", () => {
    expect(
      calculateMotorElectricalPower({
        currentAmps: 0,
        voltageVolts: 12,
      }).electricalPowerWatts,
    ).toBe(0);
    expect(
      calculateMotorElectricalPower({
        currentAmps: 3,
        voltageVolts: 0,
      }).electricalPowerWatts,
    ).toBe(0);
  });

  it("doubles with either doubled factor", () => {
    const base = calculateMotorElectricalPower({
      currentAmps: 2,
      voltageVolts: 6,
    }).electricalPowerWatts;
    expect(
      calculateMotorElectricalPower({
        currentAmps: 4,
        voltageVolts: 6,
      }).electricalPowerWatts,
    ).toBe(base * 2);
    expect(
      calculateMotorElectricalPower({
        currentAmps: 2,
        voltageVolts: 12,
      }).electricalPowerWatts,
    ).toBe(base * 2);
  });

  it("rejects negative voltage and current through execution", () => {
    expect(
      runMotorElectricalPower({ currentAmps: 1, voltageVolts: -12 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_voltage", field: "voltageVolts" }] },
      ok: false,
    });
    expect(
      runMotorElectricalPower({ currentAmps: -1, voltageVolts: 12 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_current", field: "currentAmps" }] },
      ok: false,
    });
  });

  it("feeds a consistent efficiency chain with mechanical power", () => {
    const electrical = calculateMotorElectricalPower({
      currentAmps: 5,
      voltageVolts: 11.1,
    }).electricalPowerWatts;
    expect(electrical).toBeCloseTo(55.5, 12);
    expect(electrical).toBeGreaterThan(0);
  });
});
