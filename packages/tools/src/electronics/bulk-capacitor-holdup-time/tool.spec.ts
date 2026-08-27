import { describe, expect, it } from "vitest";
import { runBulkCapacitorHoldupTime } from "./tool.js";
describe("Holdup Time", () => {
  it("calculates holdup from stored energy", () =>
    expect(
      runBulkCapacitorHoldupTime({
        capacitanceUf: 1000,
        loadPowerWatts: 1,
        vminVolts: 5,
        vinVolts: 12,
      }),
    ).toEqual({
      ok: true,
      output: { holdupTimeMs: 59500 },
    }));
  it("handles fractional voltage swings", () =>
    expect(
      runBulkCapacitorHoldupTime({
        capacitanceUf: 470,
        loadPowerWatts: 2,
        vminVolts: 4.5,
        vinVolts: 5,
      }),
    ).toEqual({
      ok: true,
      output: { holdupTimeMs: 558.125 },
    }));
  it("halves when load power doubles", () =>
    expect(
      runBulkCapacitorHoldupTime({
        capacitanceUf: 1000,
        loadPowerWatts: 2,
        vminVolts: 5,
        vinVolts: 12,
      }),
    ).toEqual({
      ok: true,
      output: { holdupTimeMs: 29750 },
    }));
  it("rejects equal input and minimum voltages", () =>
    expect(
      runBulkCapacitorHoldupTime({
        capacitanceUf: 1000,
        loadPowerWatts: 1,
        vminVolts: 12,
        vinVolts: 12,
      }).ok,
    ).toBe(false));
  it("rejects a zero minimum voltage", () =>
    expect(
      runBulkCapacitorHoldupTime({
        capacitanceUf: 1000,
        loadPowerWatts: 1,
        vminVolts: 0,
        vinVolts: 12,
      }).ok,
    ).toBe(false));
  it("rejects a zero load power", () =>
    expect(
      runBulkCapacitorHoldupTime({
        capacitanceUf: 1000,
        loadPowerWatts: 0,
        vminVolts: 5,
        vinVolts: 12,
      }).ok,
    ).toBe(false));
  it("rejects a zero capacitance", () =>
    expect(
      runBulkCapacitorHoldupTime({
        capacitanceUf: 0,
        loadPowerWatts: 1,
        vminVolts: 5,
        vinVolts: 12,
      }).ok,
    ).toBe(false));
});
