import { describe, expect, it } from "vitest";
import { harmonicMeanExample, runHarmonicMean } from "./tool.js";

describe("Harmonic Mean Calculator", () => {
  it.each([
    [[1, 2, 4], 12 / 7],
    [[3, 3, 3], 3],
    [[1, 2], 4 / 3],
  ])("calculates a harmonic mean", (values, expected) => {
    const result = runHarmonicMean({ values });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.harmonicMean).toBeCloseTo(expected, 12);
  });

  it.each([{ values: [] }, { values: [0, 1] }, { values: [-1, 2] }])(
    "rejects invalid values",
    ({ values }) => {
      expect(runHarmonicMean({ values }).ok).toBe(false);
    },
  );

  it("publishes an executable authored example", () => {
    expect(runHarmonicMean(harmonicMeanExample.input)).toEqual({
      ok: true,
      output: harmonicMeanExample.output,
    });
  });
});
