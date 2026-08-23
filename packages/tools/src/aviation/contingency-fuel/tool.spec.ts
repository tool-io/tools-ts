import { describe, expect, it } from "vitest";
import { runContingencyFuel } from "./tool.js";
describe("Contingency Fuel Calculator", () => {
  it("defaults to five percent", () =>
    expect(runContingencyFuel({ tripFuelKg: 8000 })).toEqual({
      ok: true,
      output: { contingencyFuelKg: 400 },
    }));
  it("applies an explicit percentage", () =>
    expect(
      runContingencyFuel({ contingencyPercent: 10, tripFuelKg: 8000 }),
    ).toEqual({ ok: true, output: { contingencyFuelKg: 800 } }));
  it("allows a zero percentage", () =>
    expect(
      runContingencyFuel({ contingencyPercent: 0, tripFuelKg: 8000 }),
    ).toEqual({ ok: true, output: { contingencyFuelKg: 0 } }));
  it("accepts the upper percentage bound", () =>
    expect(
      runContingencyFuel({ contingencyPercent: 20, tripFuelKg: 5000 }),
    ).toEqual({ ok: true, output: { contingencyFuelKg: 1000 } }));
  it("handles fractional results", () =>
    expect(
      runContingencyFuel({ contingencyPercent: 7, tripFuelKg: 3333 }),
    ).toEqual({ ok: true, output: { contingencyFuelKg: 233.31 } }));
  it("rejects percentages above the bound", () =>
    expect(
      runContingencyFuel({ contingencyPercent: 21, tripFuelKg: 8000 }).ok,
    ).toBe(false));
  it("rejects negative percentages", () =>
    expect(
      runContingencyFuel({ contingencyPercent: -1, tripFuelKg: 8000 }).ok,
    ).toBe(false));
  it("rejects zero trip fuel", () =>
    expect(runContingencyFuel({ tripFuelKg: 0 }).ok).toBe(false));
});
