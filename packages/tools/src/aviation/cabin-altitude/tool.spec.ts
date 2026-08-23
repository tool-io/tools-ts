import { describe, expect, it } from "vitest";
import { runCabinAltitude } from "./tool.js";
describe("Cabin Altitude Calculator", () => {
  it("returns sea level at standard pressure", () =>
    expect(runCabinAltitude({ cabinPressureHpa: 1013.25 })).toEqual({
      ok: true,
      output: { cabinAltitudeFt: 0 },
    }));
  it("converts a typical cabin pressure", () => {
    const result = runCabinAltitude({
      cabinPressureHpa: 700,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("Expected success.");
    expect(result.output.cabinAltitudeFt).toBeCloseTo(9882.480045904753, 6);
  });
  it("accepts the lower pressure bound", () => {
    const result = runCabinAltitude({
      cabinPressureHpa: 150,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("Expected success.");
    expect(result.output.cabinAltitudeFt).toBeCloseTo(44320.71587110621, 6);
  });
  it("interpolates between bounds", () => {
    const result = runCabinAltitude({
      cabinPressureHpa: 200,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("Expected success.");
    expect(result.output.cabinAltitudeFt).toBeCloseTo(38631.52726198859, 6);
  });
  it("rejects pressures below the bound", () =>
    expect(runCabinAltitude({ cabinPressureHpa: 149.9 }).ok).toBe(false));
  it("rejects pressures above standard", () =>
    expect(runCabinAltitude({ cabinPressureHpa: 1013.26 }).ok).toBe(false));
  it("rejects non-finite pressure", () =>
    expect(
      runCabinAltitude({
        cabinPressureHpa: Number.NaN,
      }).ok,
    ).toBe(false));
});
