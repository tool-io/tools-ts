import { describe, expect, it } from "vitest";
import { phosphorusNiiIndexExample, runPhosphorusNiiIndex } from "./tool.js";

describe("Phosphorus Nutrition Index", () => {
  it("publishes an executable example", () =>
    expect(runPhosphorusNiiIndex(phosphorusNiiIndexExample.input)).toEqual({
      ok: true,
      output: phosphorusNiiIndexExample.output,
    }));
  it("returns one at the critical concentration", () =>
    expect(
      runPhosphorusNiiIndex({ actualPPercent: 0.5, criticalPPercent: 0.5 }),
    ).toEqual({ ok: true, output: { phosphorusNutritionIndex: 1 } }));
  it("returns zero for absent phosphorus", () =>
    expect(
      runPhosphorusNiiIndex({ actualPPercent: 0, criticalPPercent: 0.2 }),
    ).toEqual({ ok: true, output: { phosphorusNutritionIndex: 0 } }));
  it("rejects zero critical phosphorus", () =>
    expect(
      runPhosphorusNiiIndex({ actualPPercent: 0.3, criticalPPercent: 0 }).ok,
    ).toBe(false));
  it("rejects negative actual phosphorus", () =>
    expect(
      runPhosphorusNiiIndex({ actualPPercent: -0.3, criticalPPercent: 0.4 }).ok,
    ).toBe(false));
});
