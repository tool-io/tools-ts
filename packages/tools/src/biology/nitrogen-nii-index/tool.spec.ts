import { describe, expect, it } from "vitest";
import { nitrogenNiiIndexExample, runNitrogenNiiIndex } from "./tool.js";

describe("Nitrogen Nutrition Index", () => {
  it("publishes an executable example", () =>
    expect(runNitrogenNiiIndex(nitrogenNiiIndexExample.input)).toEqual({
      ok: true,
      output: nitrogenNiiIndexExample.output,
    }));
  it("returns one at the critical concentration", () =>
    expect(
      runNitrogenNiiIndex({
        actualNitrogenPercent: 4,
        criticalNitrogenPercent: 4,
      }),
    ).toEqual({ ok: true, output: { nitrogenNutritionIndex: 1 } }));
  it("returns zero for absent nitrogen", () =>
    expect(
      runNitrogenNiiIndex({
        actualNitrogenPercent: 0,
        criticalNitrogenPercent: 3,
      }),
    ).toEqual({ ok: true, output: { nitrogenNutritionIndex: 0 } }));
  it("supports values above one", () =>
    expect(
      runNitrogenNiiIndex({
        actualNitrogenPercent: 6,
        criticalNitrogenPercent: 4,
      }),
    ).toEqual({ ok: true, output: { nitrogenNutritionIndex: 1.5 } }));
  it("rejects zero critical nitrogen", () =>
    expect(
      runNitrogenNiiIndex({
        actualNitrogenPercent: 3,
        criticalNitrogenPercent: 0,
      }).ok,
    ).toBe(false));
  it("rejects negative actual nitrogen", () =>
    expect(
      runNitrogenNiiIndex({
        actualNitrogenPercent: -1,
        criticalNitrogenPercent: 3,
      }).ok,
    ).toBe(false));
});
