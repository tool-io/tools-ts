import { describe, expect, it } from "vitest";
import {
  nitrogenBalanceIndexExample,
  runNitrogenBalanceIndex,
} from "./tool.js";

describe("Nitrogen Balance Index", () => {
  it("publishes an executable example", () =>
    expect(runNitrogenBalanceIndex(nitrogenBalanceIndexExample.input)).toEqual({
      ok: true,
      output: nitrogenBalanceIndexExample.output,
    }));
  it("returns zero for protein-free grain", () =>
    expect(
      runNitrogenBalanceIndex({
        grainProteinPercent: 0,
        nitrogenAppliedKg: 100,
        yieldKg: 5000,
      }),
    ).toEqual({ ok: true, output: { nitrogenBalanceIndex: 0 } }));
  it("supports fractional inputs", () => {
    const result = runNitrogenBalanceIndex({
      grainProteinPercent: 10,
      nitrogenAppliedKg: 40,
      yieldKg: 300,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.nitrogenBalanceIndex).toBe(0.75);
  });
  it("rises with grain protein at fixed yield", () => {
    const low = runNitrogenBalanceIndex({
      grainProteinPercent: 9,
      nitrogenAppliedKg: 100,
      yieldKg: 5000,
    });
    const high = runNitrogenBalanceIndex({
      grainProteinPercent: 13,
      nitrogenAppliedKg: 100,
      yieldKg: 5000,
    });
    if (low.ok && high.ok)
      expect(Number(high.output.nitrogenBalanceIndex)).toBeGreaterThan(
        Number(low.output.nitrogenBalanceIndex),
      );
    else expect.fail("both calculations should succeed");
  });
  it("rejects zero applied nitrogen", () => {
    const result = runNitrogenBalanceIndex({
      grainProteinPercent: 12,
      nitrogenAppliedKg: 0,
      yieldKg: 5000,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_value");
  });
  it("rejects negative applied nitrogen", () =>
    expect(
      runNitrogenBalanceIndex({
        grainProteinPercent: 12,
        nitrogenAppliedKg: -50,
        yieldKg: 5000,
      }).ok,
    ).toBe(false));
  it("rejects negative grain protein", () =>
    expect(
      runNitrogenBalanceIndex({
        grainProteinPercent: -1,
        nitrogenAppliedKg: 100,
        yieldKg: 5000,
      }).ok,
    ).toBe(false));
  it("rejects protein percentages above one hundred", () =>
    expect(
      runNitrogenBalanceIndex({
        grainProteinPercent: 101,
        nitrogenAppliedKg: 100,
        yieldKg: 5000,
      }).ok,
    ).toBe(false));
  it("rejects negative yield", () =>
    expect(
      runNitrogenBalanceIndex({
        grainProteinPercent: 12,
        nitrogenAppliedKg: 100,
        yieldKg: -1,
      }).ok,
    ).toBe(false));
});
