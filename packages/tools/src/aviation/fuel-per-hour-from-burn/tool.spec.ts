import { describe, expect, it } from "vitest";
import { fuelPerHourFromBurnExample, runFuelPerHourFromBurn } from "./tool.js";

describe("burn rate calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runFuelPerHourFromBurn(fuelPerHourFromBurnExample.input)).toEqual({
      ok: true,
      output: fuelPerHourFromBurnExample.output,
    });
  });

  it("divides fuel used by hours burned", () => {
    const result = runFuelPerHourFromBurn({
      fuelUsedKg: 450,
      hoursBurned: 1.5,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.burnKgPerHour).toBeCloseTo(300, 9);
  });

  it("scales linearly with fuel used for a fixed duration", () => {
    const base = runFuelPerHourFromBurn({ fuelUsedKg: 100, hoursBurned: 4 });
    const scaled = runFuelPerHourFromBurn({ fuelUsedKg: 300, hoursBurned: 4 });
    if (!base.ok || !scaled.ok) throw new Error("expected success");
    expect(scaled.output.burnKgPerHour).toBeCloseTo(
      Number(base.output.burnKgPerHour) * 3,
      12,
    );
  });

  it("accepts fractional hours", () => {
    const result = runFuelPerHourFromBurn({
      fuelUsedKg: 250,
      hoursBurned: 2.5,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.burnKgPerHour).toBe(100);
  });

  it("rejects zero fuel used with a stable code", () => {
    expect(
      runFuelPerHourFromBurn({ fuelUsedKg: 0, hoursBurned: 2 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_fuel_used" }] },
      ok: false,
    });
  });

  it("rejects negative hours burned through validation", () => {
    expect(
      runFuelPerHourFromBurn({ fuelUsedKg: 300, hoursBurned: -1 }).ok,
    ).toBe(false);
  });

  it("rejects missing required inputs", () => {
    expect(runFuelPerHourFromBurn({ hoursBurned: 2 })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "fuelUsedKg" }] },
      ok: false,
    });
  });

  it("rejects non-finite inputs", () => {
    for (const bad of [
      { fuelUsedKg: Number.NaN, hoursBurned: 2 },
      { fuelUsedKg: 300, hoursBurned: Number.POSITIVE_INFINITY },
    ])
      expect(runFuelPerHourFromBurn(bad).ok).toBe(false);
  });
});
