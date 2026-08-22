import { describe, expect, it } from "vitest";
import {
  calculatePercentileValue,
  percentileValueExample,
  runPercentileValue,
} from "./tool.js";

describe("Percentile Value Calculator", () => {
  it("publishes an executable example", () =>
    expect(runPercentileValue(percentileValueExample.input)).toEqual({
      ok: true,
      output: percentileValueExample.output,
    }));

  it.each([
    [[1, 2, 3, 4, 5], 25, 2],
    [[1, 2, 3, 4, 5], 50, 3],
    [[1, 2, 3, 4, 5], 75, 4],
    [[10, 20, 30, 40], 50, 25],
    [[1, 2, 3, 4], 25, 1.75],
    [[42], 37.5, 42],
    [[5, 3, 1, 4, 2], 40, 2.6],
  ])("calculates the value at a percentile", (values, percentile, expected) => {
    expect(calculatePercentileValue(values, percentile)).toBe(expected);
  });

  it("matches sorted endpoints at percentile boundaries", () => {
    expect(calculatePercentileValue([3, 1, 2], 0)).toBe(1);
    expect(calculatePercentileValue([3, 1, 2], 100)).toBe(3);
  });

  it.each([[-1], [101]])(
    "rejects percentiles outside zero to one hundred",
    (percentile) => {
      expect(calculatePercentileValue([1, 2, 3], percentile)).toBeNull();
      const result = runPercentileValue({ values: [1, 2, 3], percentile });
      expect(result.ok).toBe(false);
      if (!result.ok)
        expect(result.error.issues[0]?.code).toBe("invalid_percentile");
    },
  );

  it("rejects non-finite percentiles", () => {
    expect(calculatePercentileValue([1, 2, 3], Number.NaN)).toBeNull();
    expect(
      calculatePercentileValue([1, 2, 3], Number.POSITIVE_INFINITY),
    ).toBeNull();
    const result = runPercentileValue({
      values: [1, 2, 3],
      percentile: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });

  it("rejects empty datasets", () => {
    expect(calculatePercentileValue([], 50)).toBeNull();
    const result = runPercentileValue({ values: [], percentile: 50 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("empty_values");
  });

  it("rejects non-finite values", () => {
    expect(calculatePercentileValue([1, Number.NaN, 3], 50)).toBeNull();
    const result = runPercentileValue({
      values: [1, Number.NaN, 3],
      percentile: 50,
    });
    expect(result.ok).toBe(false);
  });

  it("rejects unknown input fields", () => {
    const result = runPercentileValue({
      values: [1, 2, 3],
      percentile: 50,
      extra: 1,
    });
    expect(result.ok).toBe(false);
  });
});
