import { describe, expect, it } from "vitest";
import {
  calculateInterquartileMean,
  interquartileMeanExample,
  runInterquartileMean,
} from "./tool.js";

describe("Interquartile Mean Calculator", () => {
  it("publishes an executable example", () =>
    expect(runInterquartileMean(interquartileMeanExample.input)).toEqual({
      ok: true,
      output: interquartileMeanExample.output,
    }));

  it.each([
    [[1, 2, 3, 4, 5, 6, 7, 8], 4.5],
    [[10, 20, 30, 40], 25],
    [[1, 2, 3, 4, 5], 3],
    [[1, 2, 3, 4], 2.5],
    [[42], 42],
    [[5, 5, 5, 5], 5],
  ])("calculates the interquartile mean", (values, expected) => {
    expect(calculateInterquartileMean(values)).toBe(expected);
  });

  it("ignores values outside the inclusive quartile bounds", () => {
    expect(calculateInterquartileMean([1, 2, 3, 4, 100])).toBe(3);
    expect(calculateInterquartileMean([-100, 2, 4, 6, 8])).toBe(4);
  });

  it("handles unsorted input", () => {
    expect(calculateInterquartileMean([8, 1, 5, 2, 7, 3, 6, 4])).toBe(4.5);
  });

  it("stays consistent with inclusive quartiles", async () => {
    const { calculateInclusiveQuartiles } =
      await import("../inclusive-quartiles/tool.js");
    const values = [12, 5, 18, 7, 25, 3, 15];
    const quartiles = calculateInclusiveQuartiles(values);
    expect(quartiles).not.toBeNull();
    if (quartiles) {
      const inside = [...values]
        .sort((left, right) => left - right)
        .filter((value) => value >= quartiles[0] && value <= quartiles[2]);
      expect(calculateInterquartileMean(values)).toBe(
        inside.reduce((total, value) => total + value, 0) / inside.length,
      );
    }
  });

  it("rejects empty datasets", () => {
    expect(calculateInterquartileMean([])).toBeNull();
    const result = runInterquartileMean({ values: [] });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("empty_values");
  });

  it("rejects non-finite values", () => {
    expect(calculateInterquartileMean([1, Number.NaN, 3])).toBeNull();
    const result = runInterquartileMean({ values: [1, Number.NaN, 3] });
    expect(result.ok).toBe(false);
  });

  it("rejects unknown input fields", () => {
    const result = runInterquartileMean({ values: [1, 2, 3], extra: 1 });
    expect(result.ok).toBe(false);
  });
});
