import { describe, expect, it } from "vitest";
import {
  calculateExponentialMovingAverage,
  exponentialMovingAverageExample,
  runExponentialMovingAverage,
} from "./tool.js";

describe("exponential moving average calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runExponentialMovingAverage(exponentialMovingAverageExample.input),
    ).toEqual({ ok: true, output: exponentialMovingAverageExample.output });
  });

  it("seeds with the first observation and matches input length", () => {
    const output = calculateExponentialMovingAverage({
      alpha: 0.8,
      values: [10, 20, 30],
    });
    expect(output.average).toEqual([10, 18, 27.6]);
  });

  it("approaches the raw series as alpha approaches one", () => {
    const output = calculateExponentialMovingAverage({
      alpha: 1,
      values: [3, 9, 5],
    });
    expect(output.average).toEqual([3, 9, 5]);
  });

  it("rejects empty series and out-of-range alpha through execution", () => {
    expect(runExponentialMovingAverage({ values: [] }).ok).toBe(false);
    for (const alpha of [-0.1, 0, 1.5])
      expect(
        runExponentialMovingAverage({ alpha, values: [1] }).ok,
      ).toBe(false);
  });
});
