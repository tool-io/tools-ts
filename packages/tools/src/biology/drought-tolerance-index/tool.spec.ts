import { describe, expect, it } from "vitest";
import {
  droughtToleranceIndexExample,
  runDroughtToleranceIndex,
} from "./tool.js";

describe("Drought Tolerance Index", () => {
  it("publishes an executable example", () =>
    expect(
      runDroughtToleranceIndex(droughtToleranceIndexExample.input),
    ).toEqual({
      ok: true,
      output: droughtToleranceIndexExample.output,
    }));
  it("returns one hundred percent for unaffected yields", () =>
    expect(
      runDroughtToleranceIndex({ controlYieldKg: 5000, stressYieldKg: 5000 }),
    ).toEqual({ ok: true, output: { droughtToleranceIndexPercent: 100 } }));
  it("returns zero for total loss under stress", () =>
    expect(
      runDroughtToleranceIndex({ controlYieldKg: 5000, stressYieldKg: 0 }),
    ).toEqual({ ok: true, output: { droughtToleranceIndexPercent: 0 } }));
  it("supports fractional indices", () => {
    const result = runDroughtToleranceIndex({
      controlYieldKg: 2000,
      stressYieldKg: 1234.5,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.droughtToleranceIndexPercent).toBeCloseTo(
        61.725,
        12,
      );
  });
  it("distinguishes tolerant and susceptible lines", () => {
    const tolerant = runDroughtToleranceIndex({
      controlYieldKg: 4000,
      stressYieldKg: 3600,
    });
    const susceptible = runDroughtToleranceIndex({
      controlYieldKg: 4000,
      stressYieldKg: 1200,
    });
    if (tolerant.ok && susceptible.ok)
      expect(tolerant.output.droughtToleranceIndexPercent).toBeGreaterThan(
        Number(susceptible.output.droughtToleranceIndexPercent),
      );
    else expect.fail("both calculations should succeed");
  });
  it("rejects zero control yield", () =>
    expect(
      runDroughtToleranceIndex({ controlYieldKg: 0, stressYieldKg: 3500 }).ok,
    ).toBe(false));
  it("rejects negative stressed yield", () =>
    expect(
      runDroughtToleranceIndex({ controlYieldKg: 5000, stressYieldKg: -1 }).ok,
    ).toBe(false));
});
