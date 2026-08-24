import { describe, expect, it } from "vitest";
import {
  calculateReturnsReverseLogisticsCostPercent,
  returnsReverseLogisticsCostPercentExample,
  runReturnsReverseLogisticsCostPercent,
} from "./tool.js";

describe("logistics/returns-reverse-logistics-cost-percent", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runReturnsReverseLogisticsCostPercent(
        returnsReverseLogisticsCostPercentExample.input,
      ),
    ).toEqual({
      ok: true,
      output: returnsReverseLogisticsCostPercentExample.output,
    });
  });

  it("skips unit costing when no returned units are supplied", () => {
    expect(
      runReturnsReverseLogisticsCostPercent({
        netRevenueInPeriod: 50000,
        reverseLogisticsCost: 750,
      }),
    ).toEqual({
      ok: true,
      output: {
        costPerReturnedUnit: 0,
        reverseCostPercentOfRevenue: 1.5,
      },
    });
  });

  it("rejects non-positive revenue", () => {
    expect(
      runReturnsReverseLogisticsCostPercent({
        netRevenueInPeriod: 0,
        reverseLogisticsCost: 10,
      }).ok,
    ).toBe(false);
  });

  it("rejects invalid direct counts and non-finite costs", () => {
    expect(() =>
      calculateReturnsReverseLogisticsCostPercent({
        netRevenueInPeriod: 50000,
        returnedUnits: 1.5,
        reverseLogisticsCost: 750,
      }),
    ).toThrow("whole number");
    expect(() =>
      calculateReturnsReverseLogisticsCostPercent({
        netRevenueInPeriod: 50000,
        returnedUnits: 25,
        reverseLogisticsCost: Number.POSITIVE_INFINITY,
      }),
    ).toThrow("must be finite");
  });
});
