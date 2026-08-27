import { describe, expect, it } from "vitest";
import {
  calculateEnergyInBattery,
  energyInBatteryExample,
  runEnergyInBattery,
} from "./tool.js";

describe("energy in battery calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runEnergyInBattery(energyInBatteryExample.input)).toEqual({
      ok: true,
      output: energyInBatteryExample.output,
    });
  });

  it("compares packs of equal charge but different voltage", () => {
    // Same Ah at higher voltage stores more energy.
    const nimh = calculateEnergyInBattery({
      capacityAh: 2,
      nominalVoltageV: 1.2,
    }).energyWh;
    const liion = calculateEnergyInBattery({
      capacityAh: 2,
      nominalVoltageV: 3.7,
    }).energyWh;
    expect(liion).toBeGreaterThan(nimh * 2);
    expect(
      calculateEnergyInBattery({ capacityAh: 0.001, nominalVoltageV: 1000 })
        .energyWh,
    ).toBe(1);
  });

  it("rejects negative inputs through execution", () => {
    for (const bad of [
      { capacityAh: -2, nominalVoltageV: 3.7 },
      { capacityAh: 2, nominalVoltageV: -3.7 },
    ])
      expect(runEnergyInBattery(bad).ok).toBe(false);
  });
});
