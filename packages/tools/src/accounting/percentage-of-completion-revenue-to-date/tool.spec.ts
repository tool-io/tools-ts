import { describe, expect, it } from "vitest";
import {
  calculatePercentageOfCompletion,
  percentageOfCompletionExample,
  runPercentageOfCompletion,
} from "./tool.js";

describe("percentage of completion revenue to date", () => {
  it("executes its canonical example exactly", () => {
    expect(
      runPercentageOfCompletion(percentageOfCompletionExample.input),
    ).toEqual({
      ok: true,
      output: percentageOfCompletionExample.output,
    });
  });

  it("computes an independently known value", () => {
    // 2.5M of 12.5M = 20% complete; 20% of an 8M contract = 1.6M revenue.
    expect(
      calculatePercentageOfCompletion({
        contractPrice: 8000000,
        costsIncurredToDate: 2500000,
        estimatedTotalCosts: 12500000,
      }),
    ).toEqual({ completionPercent: 0.2, revenueToDate: 1600000 });
  });

  it("recognizes the full price at completion", () => {
    expect(
      calculatePercentageOfCompletion({
        contractPrice: 15000000,
        costsIncurredToDate: 10000000,
        estimatedTotalCosts: 10000000,
      }),
    ).toEqual({ completionPercent: 1, revenueToDate: 15000000 });
  });

  it("recognizes nothing before work begins and normalizes negative zero", () => {
    expect(
      calculatePercentageOfCompletion({
        contractPrice: 15000000,
        costsIncurredToDate: 0,
        estimatedTotalCosts: 10000000,
      }),
    ).toEqual({ completionPercent: 0, revenueToDate: 0 });
    expect(
      calculatePercentageOfCompletion({
        contractPrice: 0,
        costsIncurredToDate: 100,
        estimatedTotalCosts: 1000,
      }).revenueToDate,
    ).toBe(0);
  });

  it("tracks costs incurred proportionally", () => {
    const base = calculatePercentageOfCompletion({
      contractPrice: 15000000,
      costsIncurredToDate: 2000000,
      estimatedTotalCosts: 10000000,
    });
    expect(
      calculatePercentageOfCompletion({
        contractPrice: 15000000,
        costsIncurredToDate: 4000000,
        estimatedTotalCosts: 10000000,
      }).revenueToDate,
    ).toBeCloseTo(base.revenueToDate * 2, 6);
  });

  it("rejects zero estimated total costs with a stable code", () => {
    expect(
      runPercentageOfCompletion({
        contractPrice: 15000000,
        costsIncurredToDate: 3000000,
        estimatedTotalCosts: 0,
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [
          {
            code: "positive_total_costs_required",
            field: "estimatedTotalCosts",
          },
        ],
      },
    });
  });

  it("rejects costs incurred above the total estimate", () => {
    expect(
      runPercentageOfCompletion({
        contractPrice: 1000,
        costsIncurredToDate: 1200,
        estimatedTotalCosts: 1000,
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [
          {
            code: "estimated_cost_below_incurred",
            field: "estimatedTotalCosts",
          },
        ],
      },
    });
  });

  it("rejects invalid direct input", () => {
    expect(() =>
      calculatePercentageOfCompletion({
        contractPrice: 15000000,
        costsIncurredToDate: -100,
        estimatedTotalCosts: 10000000,
      }),
    ).toThrow();
    expect(() =>
      calculatePercentageOfCompletion({
        contractPrice: NaN,
        costsIncurredToDate: 3000000,
        estimatedTotalCosts: 10000000,
      }),
    ).toThrow();
  });

  it("rejects malformed runtime input", () => {
    expect(
      runPercentageOfCompletion({
        costsIncurredToDate: 3000000,
        estimatedTotalCosts: 10000000,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_field", field: "contractPrice" }] },
    });
  });
});
