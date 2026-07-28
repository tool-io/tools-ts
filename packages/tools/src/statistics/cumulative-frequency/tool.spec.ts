import { describe, expect, it } from "vitest";
import { cumulativeFrequencyExample, runCumulativeFrequency } from "./tool.js";
describe("Cumulative Frequency Calculator", () => {
  it("calculates a valid result", () => {
    expect(runCumulativeFrequency({ values: [2, 1, 2, 3] })).toEqual({
      ok: true,
      output: {
        values: [1, 2, 3],
        frequencies: [1, 2, 1],
        cumulativeFrequencies: [1, 3, 4],
      },
    });
  });
  it("rejects invalid input", () =>
    expect(runCumulativeFrequency(null).ok).toBe(false));
  it("publishes an executable example", () =>
    expect(runCumulativeFrequency(cumulativeFrequencyExample.input).ok).toBe(
      true,
    ));
});
