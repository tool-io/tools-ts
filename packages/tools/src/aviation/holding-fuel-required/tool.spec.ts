import { describe, expect, it } from "vitest";
import { holdingFuelRequiredExample, runHoldingFuelRequired } from "./tool.js";

describe("holding fuel required calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runHoldingFuelRequired(holdingFuelRequiredExample.input)).toEqual({
      ok: true,
      output: holdingFuelRequiredExample.output,
    });
  });

  it("defaults to forty-five minutes of holding", () => {
    expect(runHoldingFuelRequired({ burnRateKgPerHour: 2400 })).toEqual({
      ok: true,
      output: { holdingFuelKg: 1800 },
    });
  });

  it("covers a thirty-minute hold", () => {
    expect(
      runHoldingFuelRequired({ burnRateKgPerHour: 2600, holdMinutes: 30 }),
    ).toEqual({ ok: true, output: { holdingFuelKg: 1300 } });
  });

  it("treats sixty minutes as the hourly rate", () => {
    expect(
      runHoldingFuelRequired({ burnRateKgPerHour: 1500, holdMinutes: 60 }),
    ).toEqual({ ok: true, output: { holdingFuelKg: 1500 } });
  });

  it("rejects a zero burn rate with the stable code", () => {
    const result = runHoldingFuelRequired({
      burnRateKgPerHour: 0,
      holdMinutes: 45,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_rate");
  });

  it("rejects zero hold minutes with the stable code", () => {
    const result = runHoldingFuelRequired({
      burnRateKgPerHour: 2400,
      holdMinutes: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_duration");
  });

  it("rejects a negative burn rate", () => {
    expect(
      runHoldingFuelRequired({ burnRateKgPerHour: -100, holdMinutes: 45 }).ok,
    ).toBe(false);
  });

  it("rejects negative hold minutes", () => {
    expect(
      runHoldingFuelRequired({ burnRateKgPerHour: 2400, holdMinutes: -5 }).ok,
    ).toBe(false);
  });

  it("requires the burn rate", () => {
    expect(runHoldingFuelRequired({ holdMinutes: 45 }).ok).toBe(false);
  });

  it("computes a realistic widebody hold", () => {
    expect(
      runHoldingFuelRequired({ burnRateKgPerHour: 3200, holdMinutes: 30 }),
    ).toEqual({ ok: true, output: { holdingFuelKg: 1600 } });
  });
});
