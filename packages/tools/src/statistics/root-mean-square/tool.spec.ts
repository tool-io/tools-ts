import { describe, expect, it } from "vitest";
import { rootMeanSquareExample, runRootMeanSquare } from "./tool.js";

describe("Root Mean Square Calculator", () => {
  it.each([
    [[3, 4], Math.sqrt(12.5)],
    [[-3, 4], Math.sqrt(12.5)],
    [[0, 0], 0],
    [[1, 2, 3], Math.sqrt(14 / 3)],
  ])("calculates RMS", (values, expected) => {
    const result = runRootMeanSquare({ values });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.rootMeanSquare).toBeCloseTo(expected, 12);
  });

  it("rejects an empty list", () => {
    expect(runRootMeanSquare({ values: [] }).ok).toBe(false);
  });

  it("publishes an executable authored example", () => {
    expect(runRootMeanSquare(rootMeanSquareExample.input)).toEqual({
      ok: true,
      output: rootMeanSquareExample.output,
    });
  });
});
