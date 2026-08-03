import { describe, expect, it } from "vitest";
import {
  calculatePopulationVariance,
  runPopulationVariance,
  varianceExample,
} from "./tool.js";

describe("Population Variance Calculator", () => {
  it.each([
    [[1, 2, 3, 4, 5], 2],
    [[10, 20, 30], 200 / 3],
    [[-1, -2, -3, -4, -5], 2],
  ])("calculates population variance", (values, expected) => {
    expect(calculatePopulationVariance(values)).toBeCloseTo(expected, 12);
  });

  it("rejects empty input", () =>
    expect(calculatePopulationVariance([])).toBeNull());

  it("publishes an executable example", () =>
    expect(runPopulationVariance(varianceExample.input)).toEqual({
      ok: true,
      output: varianceExample.output,
    }));
});
