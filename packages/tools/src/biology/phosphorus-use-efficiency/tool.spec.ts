import { describe, expect, it } from "vitest";
import {
  phosphorusUseEfficiencyExample,
  runPhosphorusUseEfficiency,
} from "./tool.js";

describe("PUE Calculator", () => {
  it("publishes an executable example", () =>
    expect(
      runPhosphorusUseEfficiency(phosphorusUseEfficiencyExample.input),
    ).toEqual({
      ok: true,
      output: phosphorusUseEfficiencyExample.output,
    }));
  it("supports fractional efficiencies", () => {
    const result = runPhosphorusUseEfficiency({
      phosphorusAppliedKg: 8,
      yieldKg: 30,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.phosphorusUseEfficiency).toBe(3.75);
  });
  it("equals one when yield matches phosphorus applied", () =>
    expect(
      runPhosphorusUseEfficiency({ phosphorusAppliedKg: 40, yieldKg: 40 }),
    ).toEqual({ ok: true, output: { phosphorusUseEfficiency: 1 } }));
  it("falls as applied phosphorus rises", () => {
    const low = runPhosphorusUseEfficiency({
      phosphorusAppliedKg: 60,
      yieldKg: 3000,
    });
    if (low.ok) expect(low.output.phosphorusUseEfficiency).toBe(50);
    else expect.fail("the calculation should succeed");
  });
  it("rejects zero applied phosphorus", () =>
    expect(
      runPhosphorusUseEfficiency({ phosphorusAppliedKg: 0, yieldKg: 3000 }).ok,
    ).toBe(false));
  it("rejects negative applied phosphorus", () =>
    expect(
      runPhosphorusUseEfficiency({ phosphorusAppliedKg: -5, yieldKg: 3000 }).ok,
    ).toBe(false));
  it("rejects zero yield", () =>
    expect(
      runPhosphorusUseEfficiency({ phosphorusAppliedKg: 30, yieldKg: 0 }).ok,
    ).toBe(false));
});
