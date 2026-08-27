import { describe, expect, it } from "vitest";
import {
  batteryChargingCurrentExample,
  calculateBatteryChargingCurrent,
  runBatteryChargingCurrent,
} from "./tool.js";

describe("Charge Current C-Rate", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runBatteryChargingCurrent(batteryChargingCurrentExample.input),
    ).toEqual({
      ok: true,
      output: batteryChargingCurrentExample.output,
    });
  });

  it("defaults to a gentle 0.5 C rate", () => {
    expect(
      calculateBatteryChargingCurrent({ capacityAh: 3.4 }).chargeCurrentA,
    ).toBe(1.7);
  });

  it("supports one-C fast charging", () => {
    expect(
      runBatteryChargingCurrent({
        capacityAh: 2.5,
        cRateNumber: 1,
      }),
    ).toEqual({ ok: true, output: { chargeCurrentA: 2.5 } });
  });

  it("scales linearly with capacity at a fixed rate", () => {
    expect(
      calculateBatteryChargingCurrent({
        capacityAh: 10,
        cRateNumber: 0.75,
      }).chargeCurrentA,
    ).toBe(7.5);
  });

  it("rejects zero capacity via invalid_capacity", () => {
    expect(
      runBatteryChargingCurrent({ capacityAh: 0, cRateNumber: 0.5 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_capacity", field: "capacityAh" }] },
      ok: false,
    });
  });

  it("rejects a C-rate below the minimum via invalid_c_rate", () => {
    expect(() =>
      calculateBatteryChargingCurrent({
        capacityAh: 2,
        cRateNumber: 0.01,
      }),
    ).toThrow();
  });

  it("rejects a C-rate above the maximum via invalid_field", () => {
    expect(
      runBatteryChargingCurrent({ capacityAh: 2, cRateNumber: 5 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "cRateNumber" }] },
      ok: false,
    });
  });

  it("rejects missing required inputs", () => {
    expect(runBatteryChargingCurrent({})).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "capacityAh" }] },
      ok: false,
    });
  });
});
