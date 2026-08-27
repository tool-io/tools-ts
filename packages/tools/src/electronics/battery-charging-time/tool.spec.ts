import { describe, expect, it } from "vitest";
import {
  batteryChargingTimeExample,
  calculateBatteryChargingTime,
  runBatteryChargingTime,
} from "./tool.js";

describe("Charging Time Hours", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runBatteryChargingTime(batteryChargingTimeExample.input)).toEqual({
      ok: true,
      output: batteryChargingTimeExample.output,
    });
  });

  it("applies the documented 1.2 inefficiency factor", () => {
    expect(
      runBatteryChargingTime({ capacityAh: 5, chargeCurrentA: 1 }),
    ).toEqual({ ok: true, output: { chargingHours: 6 } });
  });

  it("scales linearly with capacity", () => {
    expect(
      calculateBatteryChargingTime({
        capacityAh: 20,
        chargeCurrentA: 4,
      }).chargingHours,
    ).toBe(6);
  });

  it("charges faster with higher current", () => {
    const slow = calculateBatteryChargingTime({
      capacityAh: 10,
      chargeCurrentA: 0.5,
    }).chargingHours;
    const fast = calculateBatteryChargingTime({
      capacityAh: 10,
      chargeCurrentA: 2,
    }).chargingHours;
    expect(fast).toBe(slow / 4);
  });

  it("rejects zero capacity via invalid_capacity", () => {
    expect(
      runBatteryChargingTime({ capacityAh: 0, chargeCurrentA: 2 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_capacity", field: "capacityAh" }] },
      ok: false,
    });
  });

  it("rejects negative capacity via invalid_capacity", () => {
    expect(
      runBatteryChargingTime({ capacityAh: -10, chargeCurrentA: 2 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_capacity", field: "capacityAh" }] },
      ok: false,
    });
  });

  it("rejects zero charge current via invalid_current", () => {
    expect(
      runBatteryChargingTime({ capacityAh: 10, chargeCurrentA: 0 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_current", field: "chargeCurrentA" }] },
      ok: false,
    });
  });

  it("rejects missing required inputs", () => {
    expect(runBatteryChargingTime({ chargeCurrentA: 2 })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "capacityAh" }] },
      ok: false,
    });
  });
});
