import { describe, expect, it } from "vitest";
import {
  calculateInterquartileRange,
  interquartileRangeExample,
  runInterquartileRange,
} from "./tool.js";

describe("Interquartile Range Calculator", () => {
  it.each([
    [[1, 2, 3, 4, 5, 6, 7, 8], 4],
    [[10, 20, 30, 40], 20],
    [[1, 2, 3], 1],
    [[42], 0],
  ])("calculates the interquartile range", (values, expected) => {
    expect(calculateInterquartileRange(values)).toBe(expected);
  });

  it("rejects empty input", () =>
    expect(calculateInterquartileRange([])).toBeNull());

  it("publishes an executable example", () =>
    expect(runInterquartileRange(interquartileRangeExample.input)).toEqual({
      ok: true,
      output: interquartileRangeExample.output,
    }));
});
