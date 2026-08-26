import { describe, expect, it } from "vitest";
import {
  nitrogenUseEfficiencyExample,
  runNitrogenUseEfficiency,
} from "./tool.js";

describe("NUE Calculator", () => {
  it("publishes an executable example", () =>
    expect(
      runNitrogenUseEfficiency(nitrogenUseEfficiencyExample.input),
    ).toEqual({
      ok: true,
      output: nitrogenUseEfficiencyExample.output,
    }));
  it("supports fractional efficiencies", () => {
    const result = runNitrogenUseEfficiency({
      grainYieldKg: 1234.5,
      nitrogenAppliedKg: 100,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.nitrogenUseEfficiency).toBe(12.345);
  });
  it("equals one when yield matches nitrogen applied", () =>
    expect(
      runNitrogenUseEfficiency({ grainYieldKg: 80, nitrogenAppliedKg: 80 }),
    ).toEqual({ ok: true, output: { nitrogenUseEfficiency: 1 } }));
  it("rises as applied nitrogen falls", () => {
    const high = runNitrogenUseEfficiency({
      grainYieldKg: 5000,
      nitrogenAppliedKg: 50,
    });
    const low = runNitrogenUseEfficiency({
      grainYieldKg: 5000,
      nitrogenAppliedKg: 200,
    });
    if (high.ok && low.ok)
      expect(Number(high.output.nitrogenUseEfficiency)).toBeGreaterThan(
        Number(low.output.nitrogenUseEfficiency),
      );
    else expect.fail("both calculations should succeed");
  });
  it("rejects zero grain yield", () =>
    expect(
      runNitrogenUseEfficiency({ grainYieldKg: 0, nitrogenAppliedKg: 100 }).ok,
    ).toBe(false));
  it("rejects negative grain yield", () =>
    expect(
      runNitrogenUseEfficiency({ grainYieldKg: -100, nitrogenAppliedKg: 50 })
        .ok,
    ).toBe(false));
  it("rejects zero applied nitrogen", () =>
    expect(
      runNitrogenUseEfficiency({ grainYieldKg: 5000, nitrogenAppliedKg: 0 }).ok,
    ).toBe(false));
});
