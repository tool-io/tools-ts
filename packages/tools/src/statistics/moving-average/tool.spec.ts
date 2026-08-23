import { describe, expect, it } from "vitest";
import {
  movingAverageExample,
  calculateMovingAverage,
  runMovingAverage,
} from "./tool.js";

describe("statistics/moving-average", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runMovingAverage(movingAverageExample.input)).toEqual({
      ok: true,
      output: movingAverageExample.output,
    });
  });
  it("rejects invalid input (windowSize)", () => {
    expect(runMovingAverage({ values: [1, 2], windowSize: 0 }).ok).toBe(false);
  });
  it("rejects invalid input (invalid_window)", () => {
    expect(runMovingAverage({ values: [1, 2], windowSize: 5 }).ok).toBe(false);
  });
  it("rejects invalid input (empty_list)", () => {
    expect(runMovingAverage({ values: [] }).ok).toBe(false);
  });
  it("defaults to a three-element window", () => {
    const result = runMovingAverage({ values: [10, 20, 30, 40] });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.averages).toEqual([20, 30]);
  });

  it("passes the series through unchanged for window size one", () => {
    const result = runMovingAverage({ values: [4, 5, 6], windowSize: 1 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.averages).toEqual([4, 5, 6]);
  });
});
