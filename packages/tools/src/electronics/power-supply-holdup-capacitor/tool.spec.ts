import { describe, expect, it } from "vitest";
import {
  calculatePowerSupplyHoldupCapacitor,
  powerSupplyHoldupCapacitorExample,
  runPowerSupplyHoldupCapacitor,
} from "./tool.js";

describe("PSU Holdup Cap", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runPowerSupplyHoldupCapacitor(powerSupplyHoldupCapacitorExample.input),
    ).toEqual({
      ok: true,
      output: powerSupplyHoldupCapacitorExample.output,
    });
  });

  it("doubles capacitance when holdup time doubles", () => {
    const short = calculatePowerSupplyHoldupCapacitor({
      busVolts: 400,
      holdupMs: 20,
      minBusVolts: 380,
      outputPowerW: 10,
    }).holdupCapacitanceUf;
    const long = calculatePowerSupplyHoldupCapacitor({
      busVolts: 400,
      holdupMs: 40,
      minBusVolts: 380,
      outputPowerW: 10,
    }).holdupCapacitanceUf;
    expect(long).toBe(short * 2);
  });

  it("requires far more capacitance on a low-voltage bus", () => {
    const lowBus = calculatePowerSupplyHoldupCapacitor({
      busVolts: 12,
      holdupMs: 10,
      minBusVolts: 11,
      outputPowerW: 5,
    }).holdupCapacitanceUf;
    expect(lowBus).toBe(4.3478260869565215);
  });

  it("scales linearly with output power", () => {
    const base = calculatePowerSupplyHoldupCapacitor({
      busVolts: 400,
      holdupMs: 20,
      minBusVolts: 380,
      outputPowerW: 10,
    }).holdupCapacitanceUf;
    const bigger = calculatePowerSupplyHoldupCapacitor({
      busVolts: 400,
      holdupMs: 20,
      minBusVolts: 380,
      outputPowerW: 30,
    }).holdupCapacitanceUf;
    expect(bigger).toBe(base * 3);
  });

  it("rejects non-positive power via invalid_power", () => {
    expect(
      runPowerSupplyHoldupCapacitor({
        busVolts: 400,
        holdupMs: 20,
        minBusVolts: 380,
        outputPowerW: 0,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_power", field: "outputPowerW" }] },
      ok: false,
    });
  });

  it("rejects non-positive holdup time via invalid_holdup_time", () => {
    expect(
      runPowerSupplyHoldupCapacitor({
        busVolts: 400,
        holdupMs: 0,
        minBusVolts: 380,
        outputPowerW: 10,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_holdup_time", field: "holdupMs" }] },
      ok: false,
    });
  });

  it("rejects a non-positive minimum bus via invalid_voltage", () => {
    expect(
      runPowerSupplyHoldupCapacitor({
        busVolts: 400,
        holdupMs: 20,
        minBusVolts: 0,
        outputPowerW: 10,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_voltage", field: "minBusVolts" }] },
      ok: false,
    });
  });

  it("rejects a bus below the minimum via invalid_voltage", () => {
    expect(
      runPowerSupplyHoldupCapacitor({
        busVolts: 370,
        holdupMs: 20,
        minBusVolts: 380,
        outputPowerW: 10,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_voltage", field: "busVolts" }] },
      ok: false,
    });
  });
});
