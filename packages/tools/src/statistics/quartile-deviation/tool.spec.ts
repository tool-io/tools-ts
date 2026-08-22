import { describe, expect, it } from "vitest";
import {
  calculateQuartileDeviation,
  quartileDeviationExample,
  runQuartileDeviation,
} from "./tool.js";

describe("Quartile Deviation Calculator", () => {
  it("publishes an executable example", () =>
    expect(runQuartileDeviation(quartileDeviationExample.input)).toEqual({
      ok: true,
      output: quartileDeviationExample.output,
    }));

  it.each([
    [[1, 2, 3, 4, 5, 6, 7, 8], 2],
    [[1, 2, 3, 4, 5], 1],
    [[10, 20, 30, 40], 10],
    [[1, 2, 3], 0.5],
    [[42], 0],
    [[7, 7, 7, 7], 0],
    [[9, 1, 5, 3, 7], 2],
  ])("calculates the quartile deviation", (values, expected) => {
    expect(calculateQuartileDeviation(values)).toBe(expected);
  });

  it("handles unsorted input", () => {
    expect(calculateQuartileDeviation([8, 3, 5, 1, 7, 2, 6, 4])).toBe(2);
  });

  it("stays consistent with inclusive quartiles", async () => {
    const { calculateInclusiveQuartiles } =
      await import("../inclusive-quartiles/tool.js");
    const values = [12, 5, 18, 7, 25, 3, 15];
    const quartiles = calculateInclusiveQuartiles(values);
    expect(quartiles).not.toBeNull();
    if (quartiles)
      expect(calculateQuartileDeviation(values)).toBe(
        (quartiles[2] - quartiles[0]) / 2,
      );
  });

  it("rejects empty datasets", () => {
    expect(calculateQuartileDeviation([])).toBeNull();
    const result = runQuartileDeviation({ values: [] });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("empty_values");
  });

  it("rejects non-finite values", () => {
    expect(calculateQuartileDeviation([1, Number.NaN, 3])).toBeNull();
    const result = runQuartileDeviation({ values: [1, Number.NaN, 3] });
    expect(result.ok).toBe(false);
  });

  it("rejects unknown input fields", () => {
    const result = runQuartileDeviation({ values: [1, 2, 3], extra: 1 });
    expect(result.ok).toBe(false);
  });
});
