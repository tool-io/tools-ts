import { describe, expect, it } from "vitest";
import { harvestIndexExample, runHarvestIndex } from "./tool.js";

describe("Harvest Index", () => {
  it("publishes an executable example", () =>
    expect(runHarvestIndex(harvestIndexExample.input)).toEqual({
      ok: true,
      output: harvestIndexExample.output,
    }));
  it("is zero for a pure vegetative crop", () =>
    expect(runHarvestIndex({ grainYieldKg: 0, totalBiomassKg: 8000 })).toEqual({
      ok: true,
      output: { harvestIndex: 0 },
    }));
  it("is one when all biomass is grain", () =>
    expect(
      runHarvestIndex({ grainYieldKg: 8000, totalBiomassKg: 8000 }),
    ).toEqual({ ok: true, output: { harvestIndex: 1 } }));
  it("distinguishes modern and legacy cultivars", () =>
    expect(
      runHarvestIndex({ grainYieldKg: 2500, totalBiomassKg: 10000 }),
    ).toEqual({ ok: true, output: { harvestIndex: 0.25 } }));
  it("rejects yield exceeding biomass", () => {
    const result = runHarvestIndex({
      grainYieldKg: 9000,
      totalBiomassKg: 8000,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_yields");
  });
  it("rejects zero biomass", () =>
    expect(runHarvestIndex({ grainYieldKg: 4000, totalBiomassKg: 0 }).ok).toBe(
      false,
    ));
  it("rejects negative yield", () =>
    expect(runHarvestIndex({ grainYieldKg: -1, totalBiomassKg: 8000 }).ok).toBe(
      false,
    ));
});
