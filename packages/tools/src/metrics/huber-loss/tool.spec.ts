import { describe, expect, it } from "vitest";
import { calculateHuberLoss, huberLossExample, runHuberLoss } from "./tool.js";

describe("huber loss calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runHuberLoss(huberLossExample.input)).toEqual({
      ok: true,
      output: huberLossExample.output,
    });
  });

  it("is quadratic below delta and linear above it", () => {
    // Single error of exactly delta gives a pure quadratic term: 0.5 * 1^2.
    expect(calculateHuberLoss({ delta: 1, errors: [1] })).toMatchObject({
      loss: 0.5,
    });
    // Double the error with delta 1 switches to the linear branch.
    const doubled = calculateHuberLoss({ delta: 1, errors: [2] });
    expect(doubled.loss).toBe(1.5);
  });

  it("penalizes outliers less than squared error would", () => {
    const huber = calculateHuberLoss({ delta: 1, errors: [0.1, 10] });
    // Squared error mean would be dominated by 100; Huber grows only linearly.
    expect(huber.loss).toBeLessThan((0.1 * 0.1 + 100) / 2);
  });

  it("rejects empty errors and non-positive delta through execution", () => {
    expect(runHuberLoss({ errors: [] }).ok).toBe(false);
    expect(runHuberLoss({ delta: 0, errors: [1] })).toMatchObject({
      error: { issues: [{ code: "invalid_delta" }] },
      ok: false,
    });
  });
});
