import { describe, expect, it } from "vitest";
import { runHoldupCapacitorValue } from "./tool.js";
describe("Holdup Cap Value", () => {
  it("sizes the capacitor for a required holdup time", () =>
    expect(
      runHoldupCapacitorValue({
        holdupTimeMs: 59500,
        loadPowerWatts: 1,
        vminVolts: 5,
        vinVolts: 12,
      }),
    ).toEqual({
      ok: true,
      output: { requiredCapacitanceUf: 1000 },
    }));
  it("round-trips the holdup time calculation", () =>
    expect(
      runHoldupCapacitorValue({
        holdupTimeMs: 558.125,
        loadPowerWatts: 2,
        vminVolts: 4.5,
        vinVolts: 5,
      }),
    ).toEqual({
      ok: true,
      output: { requiredCapacitanceUf: 470 },
    }));
  it("doubles with the load power at fixed time", () =>
    expect(
      runHoldupCapacitorValue({
        holdupTimeMs: 10,
        loadPowerWatts: 4,
        vminVolts: 5,
        vinVolts: 15,
      }),
    ).toEqual({
      ok: true,
      output: { requiredCapacitanceUf: 0.4 },
    }));
  it("rejects a zero holdup time", () =>
    expect(
      runHoldupCapacitorValue({
        holdupTimeMs: 0,
        loadPowerWatts: 1,
        vminVolts: 5,
        vinVolts: 12,
      }).ok,
    ).toBe(false));
  it("rejects a zero load power", () =>
    expect(
      runHoldupCapacitorValue({
        holdupTimeMs: 10,
        loadPowerWatts: 0,
        vminVolts: 5,
        vinVolts: 12,
      }).ok,
    ).toBe(false));
  it("rejects input voltages at or below the minimum", () =>
    expect(
      runHoldupCapacitorValue({
        holdupTimeMs: 10,
        loadPowerWatts: 1,
        vminVolts: 12,
        vinVolts: 5,
      }).ok,
    ).toBe(false));
  it("rejects a zero minimum voltage", () =>
    expect(
      runHoldupCapacitorValue({
        holdupTimeMs: 10,
        loadPowerWatts: 1,
        vminVolts: 0,
        vinVolts: 12,
      }).ok,
    ).toBe(false));
});
