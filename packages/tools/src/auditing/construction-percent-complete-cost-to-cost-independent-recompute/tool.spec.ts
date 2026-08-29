import { describe, expect, it } from "vitest";
import {
  computeCostToCostPercentComplete,
  costToCostPercentCompleteExample,
  runCostToCostPercentComplete,
} from "./tool.js";

describe("construction percent complete cost-to-cost recompute", () => {
  it("reproduces its canonical example", () => {
    expect(
      runCostToCostPercentComplete(costToCostPercentCompleteExample.input),
    ).toEqual({ ok: true, output: costToCostPercentCompleteExample.output });
  });

  it("computes an independently known value", () => {
    expect(
      computeCostToCostPercentComplete({
        contractPrice: 500,
        costIncurredToDate: 100,
        estimatedCostToComplete: 150,
      }),
    ).toEqual({
      completionFraction: 0.4,
      estimatedTotalCost: 250,
      revenueRecognizedToDate: 200,
    });
  });

  it("treats a finished contract as fully complete", () => {
    expect(
      computeCostToCostPercentComplete({
        contractPrice: 800,
        costIncurredToDate: 650,
        estimatedCostToComplete: 0,
      }),
    ).toEqual({
      completionFraction: 1,
      estimatedTotalCost: 650,
      revenueRecognizedToDate: 800,
    });
  });

  it("scales revenue linearly with incurred cost", () => {
    const base = computeCostToCostPercentComplete({
      contractPrice: 1000,
      costIncurredToDate: 100,
      estimatedCostToComplete: 900,
    });
    const doubled = computeCostToCostPercentComplete({
      contractPrice: 1000,
      costIncurredToDate: 200,
      estimatedCostToComplete: 800,
    });
    expect(doubled.revenueRecognizedToDate).toBeCloseTo(
      base.revenueRecognizedToDate * 2,
      12,
    );
  });

  it("accepts a zero-price contract without producing negative zero", () => {
    expect(
      computeCostToCostPercentComplete({
        contractPrice: 0,
        costIncurredToDate: -0,
        estimatedCostToComplete: 10,
      }),
    ).toEqual({
      completionFraction: 0,
      estimatedTotalCost: 10,
      revenueRecognizedToDate: 0,
    });
  });

  it("rejects an all-zero cost position as undefined", () => {
    expect(
      runCostToCostPercentComplete({
        contractPrice: 100,
        costIncurredToDate: 0,
        estimatedCostToComplete: 0,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "zero_estimated_total_cost", field: "" }],
      },
      ok: false,
    });
  });

  it("rejects a negative cost to complete", () => {
    expect(
      runCostToCostPercentComplete({
        contractPrice: 100,
        costIncurredToDate: 10,
        estimatedCostToComplete: -5,
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "invalid_field",
            field: "estimatedCostToComplete",
          },
        ],
      },
      ok: false,
    });
  });

  it("rejects an estimated-total-cost overflow", () => {
    expect(
      runCostToCostPercentComplete({
        contractPrice: 100,
        costIncurredToDate: Number.MAX_VALUE,
        estimatedCostToComplete: Number.MAX_VALUE,
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "result_not_finite",
            field: "estimatedCostToComplete",
          },
        ],
      },
      ok: false,
    });
  });
});
