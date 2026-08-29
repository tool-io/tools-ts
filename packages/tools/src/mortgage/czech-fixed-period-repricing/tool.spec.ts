import { describe, expect, it } from "vitest";
import {
  czechFixedPeriodRepricingExample,
  runCzechFixedPeriodRepricing,
} from "./tool.js";

describe("Czech mortgage repricing calculator", () => {
  it("reproduces its canonical repricing scenario", () => {
    expect(
      runCzechFixedPeriodRepricing(czechFixedPeriodRepricingExample.input),
    ).toEqual({ ok: true, output: czechFixedPeriodRepricingExample.output });
  });

  it("handles a zero-rate initial period", () => {
    const result = runCzechFixedPeriodRepricing({
      fixedPeriodYears: 1,
      initialAnnualRatePercent: 0,
      principal: 120_000,
      repricedAnnualRatePercent: 0,
      termYears: 10,
    });
    expect(result).toMatchObject({
      ok: true,
      output: {
        balanceAtRepricing: 108_000,
        initialMonthlyPayment: 1_000,
        projectedTotalInterest: 0,
        repricedMonthlyPayment: 1_000,
      },
    });
  });

  it("rejects a fixed period equal to the total term", () => {
    const result = runCzechFixedPeriodRepricing({
      fixedPeriodYears: 10,
      initialAnnualRatePercent: 4,
      principal: 120_000,
      repricedAnnualRatePercent: 6,
      termYears: 10,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "fixed_period_invalid",
        field: "fixedPeriodYears",
      });
  });
});
