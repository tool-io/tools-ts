import { describe, expect, it } from "vitest";
import { saltToleranceIndexExample, runSaltToleranceIndex } from "./tool.js";

describe("Salt Tolerance Index", () => {
  it("publishes an executable example", () =>
    expect(runSaltToleranceIndex(saltToleranceIndexExample.input)).toEqual({
      ok: true,
      output: saltToleranceIndexExample.output,
    }));
  it("returns one hundred percent for unaffected yields", () =>
    expect(
      runSaltToleranceIndex({ controlYieldKg: 6000, stressYieldKg: 6000 }),
    ).toEqual({ ok: true, output: { saltToleranceIndexPercent: 100 } }));
  it("returns zero for total loss under salinity", () =>
    expect(
      runSaltToleranceIndex({ controlYieldKg: 8000, stressYieldKg: 0 }),
    ).toEqual({ ok: true, output: { saltToleranceIndexPercent: 0 } }));
  it("supports fractional indices", () => {
    const result = runSaltToleranceIndex({
      controlYieldKg: 1600,
      stressYieldKg: 1234.5,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.saltToleranceIndexPercent).toBeCloseTo(77.15625, 12);
  });
  it("rises as stress yield approaches the control", () => {
    const weak = runSaltToleranceIndex({
      controlYieldKg: 8000,
      stressYieldKg: 2000,
    });
    const strong = runSaltToleranceIndex({
      controlYieldKg: 8000,
      stressYieldKg: 6400,
    });
    if (weak.ok && strong.ok)
      expect(strong.output.saltToleranceIndexPercent).toBeGreaterThan(
        Number(weak.output.saltToleranceIndexPercent),
      );
    else expect.fail("both calculations should succeed");
  });
  it("rejects zero control yield", () =>
    expect(
      runSaltToleranceIndex({ controlYieldKg: 0, stressYieldKg: 4000 }).ok,
    ).toBe(false));
  it("rejects negative stressed yield", () =>
    expect(
      runSaltToleranceIndex({ controlYieldKg: 8000, stressYieldKg: -10 }).ok,
    ).toBe(false));
});
