import { describe, expect, it } from "vitest";
import { geometricMeanExample, runGeometricMean } from "./tool.js";

describe("Geometric Mean Calculator", () => {
  it.each([
    [[1, 4, 16], 4],
    [[2, 8], 4],
    [[0, 4, 16], 0],
    [[1, 10, 100], 10],
  ])("calculates a geometric mean", (values, expected) => {
    const result = runGeometricMean({ values });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.geometricMean).toBeCloseTo(expected, 12);
  });

  it.each([{ values: [] }, { values: [-1, 4] }])(
    "rejects invalid values",
    ({ values }) => {
      expect(runGeometricMean({ values }).ok).toBe(false);
    },
  );

  it("publishes an executable authored example", () => {
    expect(runGeometricMean(geometricMeanExample.input)).toEqual({
      ok: true,
      output: geometricMeanExample.output,
    });
  });
});
