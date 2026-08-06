import { describe, expect, it } from "vitest";
import {
  fitRidgeRegression,
  ridgeRegressionExample,
  runRidgeRegression,
} from "./tool.js";

describe("Ridge Regression", () => {
  it("shrinks the fitted slope", () =>
    expect(fitRidgeRegression([1, 2, 3, 4], [2, 4, 6, 8], 1)?.slope).toBe(
      1.666666667,
    ));
  it("rejects mismatched samples", () =>
    expect(
      runRidgeRegression({ features: [1, 2], lambda: 1, targets: [1] }).ok,
    ).toBe(false));
  it("publishes an executable example", () =>
    expect(runRidgeRegression(ridgeRegressionExample.input)).toEqual({
      ok: true,
      output: ridgeRegressionExample.output,
    }));
});
