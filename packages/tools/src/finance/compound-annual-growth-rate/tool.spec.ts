import { describe, expect, it } from "vitest";
import {
  calculateCompoundAnnualGrowthRate,
  compoundAnnualGrowthRateExample,
  runCompoundAnnualGrowthRate,
} from "./tool.js";

describe("compound annual growth rate calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCompoundAnnualGrowthRate(compoundAnnualGrowthRateExample.input),
    ).toEqual({ ok: true, output: compoundAnnualGrowthRateExample.output });
  });

  it("handles fractional years and declines", () => {
    const growth = calculateCompoundAnnualGrowthRate({
      beginValue: 100,
      endValue: 110,
      years: 0.5,
    });
    expect(growth.cagrPercent).toBeCloseTo(21, 6);
    const decline = calculateCompoundAnnualGrowthRate({
      beginValue: 100,
      endValue: 50,
      years: 1,
    });
    expect(decline.cagrPercent).toBe(-50);
  });

  it("rejects non-positive values and years through execution", () => {
    for (const bad of [
      { beginValue: 0, endValue: 5, years: 1 },
      { beginValue: 5, endValue: -1, years: 1 },
      { beginValue: 5, endValue: 6, years: 0 },
    ])
      expect(runCompoundAnnualGrowthRate(bad).ok).toBe(false);
  });
});
