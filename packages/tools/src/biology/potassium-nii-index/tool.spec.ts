import { describe, expect, it } from "vitest";
import { potassiumNiiIndexExample, runPotassiumNiiIndex } from "./tool.js";

describe("Potassium Nutrition Index", () => {
  it("publishes an executable example", () =>
    expect(runPotassiumNiiIndex(potassiumNiiIndexExample.input)).toEqual({
      ok: true,
      output: potassiumNiiIndexExample.output,
    }));
  it("returns one at the critical concentration", () =>
    expect(
      runPotassiumNiiIndex({ actualKPercent: 2.5, criticalKPercent: 2.5 }),
    ).toEqual({ ok: true, output: { potassiumNutritionIndex: 1 } }));
  it("supports values above one", () =>
    expect(
      runPotassiumNiiIndex({ actualKPercent: 5, criticalKPercent: 2.5 }),
    ).toEqual({ ok: true, output: { potassiumNutritionIndex: 2 } }));
  it("rejects zero critical potassium", () =>
    expect(
      runPotassiumNiiIndex({ actualKPercent: 2, criticalKPercent: 0 }).ok,
    ).toBe(false));
  it("rejects negative actual potassium", () =>
    expect(
      runPotassiumNiiIndex({ actualKPercent: -2, criticalKPercent: 2.5 }).ok,
    ).toBe(false));
});
