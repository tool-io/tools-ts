import { describe, expect, it } from "vitest";
import {
  batteryInternalResistanceExample,
  calculateBatteryInternalResistance,
  runBatteryInternalResistance,
} from "./tool.js";

describe("Internal Resistance", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runBatteryInternalResistance(batteryInternalResistanceExample.input),
    ).toEqual({
      ok: true,
      output: batteryInternalResistanceExample.output,
    });
  });

  it("doubles internal resistance when the voltage sag doubles", () => {
    const base = calculateBatteryInternalResistance({
      loadCurrentAmps: 4,
      loadedVolts: 11.5,
      openCircuitVolts: 12,
    }).internalResistanceOhms;
    expect(
      calculateBatteryInternalResistance({
        loadCurrentAmps: 4,
        loadedVolts: 11,
        openCircuitVolts: 12,
      }).internalResistanceOhms,
    ).toBe(base * 2);
  });

  it("halves internal resistance when the load current doubles", () => {
    const base = calculateBatteryInternalResistance({
      loadCurrentAmps: 2,
      loadedVolts: 11.5,
      openCircuitVolts: 12,
    }).internalResistanceOhms;
    expect(
      calculateBatteryInternalResistance({
        loadCurrentAmps: 4,
        loadedVolts: 11.5,
        openCircuitVolts: 12,
      }).internalResistanceOhms,
    ).toBe(base / 2);
  });

  it("reports near-zero sag as near-zero resistance", () => {
    expect(
      calculateBatteryInternalResistance({
        loadCurrentAmps: 10,
        loadedVolts: 3.7,
        openCircuitVolts: 3.70001,
      }).internalResistanceOhms,
    ).toBeCloseTo(0.000001, 9);
  });

  it("rejects zero load current with a stable code", () => {
    expect(
      runBatteryInternalResistance({
        loadCurrentAmps: 0,
        loadedVolts: 3.6,
        openCircuitVolts: 3.7,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_current", field: "loadCurrentAmps" }],
      },
      ok: false,
    });
  });

  it("rejects loaded voltage above open-circuit voltage via invalid_readings", () => {
    expect(
      runBatteryInternalResistance({
        loadCurrentAmps: 1,
        loadedVolts: 4,
        openCircuitVolts: 3.7,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_readings", field: "loadedVolts" }] },
      ok: false,
    });
  });

  it("rejects equal voltages via invalid_readings", () => {
    expect(
      runBatteryInternalResistance({
        loadCurrentAmps: 1,
        loadedVolts: 3.7,
        openCircuitVolts: 3.7,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_readings" }] },
      ok: false,
    });
  });
});
