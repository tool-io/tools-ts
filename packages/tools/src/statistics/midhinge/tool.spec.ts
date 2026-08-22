import { describe, expect, it } from "vitest";
import { calculateMidhinge, midhingeExample, runMidhinge } from "./tool.js";

describe("Midhinge Calculator", () => {
  it("publishes an executable example", () =>
    expect(runMidhinge(midhingeExample.input)).toEqual({
      ok: true,
      output: midhingeExample.output,
    }));

  it.each([
    [[1, 2, 3, 4, 5, 6, 7, 8], 4.5],
    [[1, 2, 3, 4, 5], 3],
    [[10, 20, 30, 40], 25],
    [[1, 2, 3], 2],
    [[42], 42],
    [[-10, 0, 10], 0],
  ])("calculates the midhinge", (values, expected) => {
    expect(calculateMidhinge(values)).toBe(expected);
  });

  it("handles unsorted input", () => {
    expect(calculateMidhinge([8, 3, 5, 1, 7, 2, 6, 4])).toBe(4.5);
  });

  it("stays consistent with inclusive quartiles", async () => {
    const { calculateInclusiveQuartiles } =
      await import("../inclusive-quartiles/tool.js");
    const values = [12, 5, 18, 7, 25, 3, 15];
    const quartiles = calculateInclusiveQuartiles(values);
    expect(quartiles).not.toBeNull();
    if (quartiles)
      expect(calculateMidhinge(values)).toBe((quartiles[0] + quartiles[2]) / 2);
  });

  it("rejects empty datasets", () => {
    expect(calculateMidhinge([])).toBeNull();
    const result = runMidhinge({ values: [] });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("empty_values");
  });

  it("rejects non-finite values", () => {
    expect(calculateMidhinge([1, Number.NaN, 3])).toBeNull();
    const result = runMidhinge({ values: [1, Number.NaN, 3] });
    expect(result.ok).toBe(false);
  });

  it("rejects unknown input fields", () => {
    const result = runMidhinge({ values: [1, 2, 3], extra: 1 });
    expect(result.ok).toBe(false);
  });
});
