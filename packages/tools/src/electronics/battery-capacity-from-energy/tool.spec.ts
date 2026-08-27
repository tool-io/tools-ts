import { describe, expect, it } from "vitest";
import {
  runBatteryCapacityFromEnergy,
  batteryCapacityFromEnergyExample,
} from "./tool.js";

describe("Capacity From Energy", () => {
  it("reproduces its canonical example exactly", () =>
    expect(
      runBatteryCapacityFromEnergy(batteryCapacityFromEnergyExample.input),
    ).toEqual({ ok: true, output: batteryCapacityFromEnergyExample.output }));
  it("converts a laptop pack", () =>
    expect(
      runBatteryCapacityFromEnergy({ energyWh: 99.9, nominalVolts: 3.7 }),
    ).toEqual({ ok: true, output: { capacityAh: 27 } }));
  it("converts fractional energy", () =>
    expect(
      runBatteryCapacityFromEnergy({ energyWh: 1.5, nominalVolts: 3 }),
    ).toEqual({ ok: true, output: { capacityAh: 0.5 } }));
  it("rejects zero energy with a stable code", () =>
    expect(
      runBatteryCapacityFromEnergy({ energyWh: 0, nominalVolts: 12 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_energy", field: "energyWh" }] },
      ok: false,
    }));
  it("rejects negative voltage with a stable code", () =>
    expect(
      runBatteryCapacityFromEnergy({ energyWh: 48, nominalVolts: -12 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_voltage", field: "nominalVolts" }] },
      ok: false,
    }));
  it("rejects missing required inputs", () =>
    expect(runBatteryCapacityFromEnergy({} as never)).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "energyWh" }] },
      ok: false,
    }));
  it("rejects unknown input fields", () =>
    expect(
      runBatteryCapacityFromEnergy({
        ...batteryCapacityFromEnergyExample.input,
        extra: true,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
