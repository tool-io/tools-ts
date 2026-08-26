import { describe, expect, it } from "vitest";
import { milkYieldCorrectionExample, runMilkYieldCorrection } from "./tool.js";

describe("305-Day Milk Correction", () => {
  it("publishes an executable example", () =>
    expect(runMilkYieldCorrection(milkYieldCorrectionExample.input)).toEqual({
      ok: true,
      output: milkYieldCorrectionExample.output,
    }));
  it("leaves a complete lactation unchanged", () =>
    expect(
      runMilkYieldCorrection({ currentYieldKg: 305, daysInMilkInt: 305 }),
    ).toEqual({ ok: true, output: { correctedYieldKg: 305 } }));
  it("projects halfway yields to the full period", () => {
    const result = runMilkYieldCorrection({
      currentYieldKg: 150,
      daysInMilkInt: 150,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.correctedYieldKg).toBe(305);
  });
  it("returns zero for zero accumulated yield", () =>
    expect(
      runMilkYieldCorrection({ currentYieldKg: 0, daysInMilkInt: 100 }),
    ).toEqual({ ok: true, output: { correctedYieldKg: 0 } }));
  it("supports fractional daily rates", () => {
    const result = runMilkYieldCorrection({
      currentYieldKg: 1000,
      daysInMilkInt: 200,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.correctedYieldKg).toBeCloseTo(1525, 12);
  });
  it("rejects zero days in milk", () =>
    expect(
      runMilkYieldCorrection({ currentYieldKg: 6000, daysInMilkInt: 0 }).ok,
    ).toBe(false));
  it("rejects more than three hundred five days in milk", () =>
    expect(
      runMilkYieldCorrection({ currentYieldKg: 6000, daysInMilkInt: 306 }).ok,
    ).toBe(false));
  it("rejects non-integer days in milk", () =>
    expect(
      runMilkYieldCorrection({ currentYieldKg: 6000, daysInMilkInt: 150.5 }).ok,
    ).toBe(false));
});
