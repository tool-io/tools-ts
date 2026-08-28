import { describe, expect, it } from "vitest";
import {
  calculateMotorMechanicalPower,
  motorMechanicalPowerExample,
  runMotorMechanicalPower,
} from "./tool.js";

describe("motor mechanical power", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runMotorMechanicalPower(motorMechanicalPowerExample.input)).toEqual({
      ok: true,
      output: motorMechanicalPowerExample.output,
    });
  });

  it("doubles power when torque doubles at fixed speed", () => {
    const base = calculateMotorMechanicalPower({
      angularSpeedRadS: 150,
      torqueNm: 0.25,
    }).mechanicalPowerWatts;
    expect(
      calculateMotorMechanicalPower({
        angularSpeedRadS: 150,
        torqueNm: 0.5,
      }).mechanicalPowerWatts,
    ).toBe(base * 2);
  });

  it("doubles power when speed doubles at fixed torque", () => {
    const base = calculateMotorMechanicalPower({
      angularSpeedRadS: 50,
      torqueNm: 0.4,
    }).mechanicalPowerWatts;
    expect(
      calculateMotorMechanicalPower({
        angularSpeedRadS: 100,
        torqueNm: 0.4,
      }).mechanicalPowerWatts,
    ).toBe(base * 2);
  });

  it("allows zero torque as a stalled but valid input", () => {
    expect(
      calculateMotorMechanicalPower({
        angularSpeedRadS: 1000,
        torqueNm: 0,
      }).mechanicalPowerWatts,
    ).toBe(0);
  });

  it("rejects negative torque through execution", () => {
    expect(
      runMotorMechanicalPower({ angularSpeedRadS: 10, torqueNm: -1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_torque", field: "torqueNm" }] },
      ok: false,
    });
  });

  it("rejects non-positive speed through execution", () => {
    expect(
      runMotorMechanicalPower({ angularSpeedRadS: 0, torqueNm: 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_speed", field: "angularSpeedRadS" }] },
      ok: false,
    });
  });

  it("converts rpm derived angular speeds consistently", () => {
    const rpm = 3000;
    const radS = (rpm * 2 * Math.PI) / 60;
    expect(
      calculateMotorMechanicalPower({
        angularSpeedRadS: radS,
        torqueNm: 0.1,
      }).mechanicalPowerWatts,
    ).toBeCloseTo((rpm * 2 * Math.PI * 0.1) / 60, 12);
  });
});
