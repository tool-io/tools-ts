import { describe, expect, it } from "vitest";
import {
  inflationAdjustmentExample,
  calculateInflationAdjustment,
  runInflationAdjustment,
} from "./tool.js";

describe("finance/inflation-adjustment", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runInflationAdjustment(inflationAdjustmentExample.input)).toEqual({
      ok: true,
      output: inflationAdjustmentExample.output,
    });
  });
  it("rejects invalid input (case)", () => {
    expect(
      runInflationAdjustment({
        amount: -5,
        annualInflationRatePercent: 3,
        years: 10,
      }).ok,
    ).toBe(false);
  });
  it("rejects invalid input (case)", () => {
    expect(
      runInflationAdjustment({
        amount: 100,
        annualInflationRatePercent: -120,
        years: 2,
      }).ok,
    ).toBe(false);
  });
  it("rejects invalid input (case)", () => {
    expect(
      runInflationAdjustment({
        amount: 100,
        annualInflationRatePercent: 3,
        years: -2,
      }).ok,
    ).toBe(false);
  });
  it("leaves amounts unchanged at zero inflation", () => {
    const result = runInflationAdjustment({
      amount: 250,
      annualInflationRatePercent: 0,
      years: 15,
    });
    expect(result).toEqual({
      ok: true,
      output: { inflatedAmount: 250, cumulativeInflationPercent: 0 },
    });
  });

  it("compounds year by year consistently", () => {
    const one = runInflationAdjustment({
      amount: 80,
      annualInflationRatePercent: 4,
      years: 1,
    });
    const twice = runInflationAdjustment({
      amount: 80,
      annualInflationRatePercent: 4,
      years: 2,
    });
    expect(one.ok && twice.ok).toBe(true);
    if (one.ok && twice.ok) {
      const singleYear = Number(one.output.inflatedAmount);
      const twoYears = Number(twice.output.inflatedAmount);
      expect(twoYears).toBeCloseTo(singleYear * 1.04, 10);
    }
  });
});
