import { describe, expect, it } from "vitest";
import {
  calculatePopulationSummary,
  populationSummaryExample,
  runPopulationSummary,
} from "./tool.js";

describe("Population Summary Calculator", () => {
  it("calculates stable population moments", () => {
    expect(calculatePopulationSummary([1, 2, 3, 4, 5])).toEqual({
      count: 5,
      mean: 3,
      standardDeviation: Math.sqrt(2),
      variance: 2,
    });
  });

  it("rejects empty, non-finite, and overflowing datasets", () => {
    expect(calculatePopulationSummary([])).toBeNull();
    expect(
      calculatePopulationSummary([1, Number.POSITIVE_INFINITY]),
    ).toBeNull();
    expect(calculatePopulationSummary([1e308, -1e308])).toBeNull();
  });

  it("publishes an executable example", () =>
    expect(runPopulationSummary(populationSummaryExample.input)).toEqual({
      ok: true,
      output: populationSummaryExample.output,
    }));
});
