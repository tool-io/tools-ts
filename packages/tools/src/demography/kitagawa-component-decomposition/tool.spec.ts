import { describe, expect, it } from "vitest";
import {
  calculateKitagawaComponentDecomposition,
  runKitagawaComponentDecomposition,
  kitagawaComponentDecompositionExample,
} from "./tool.js";

describe("demography/kitagawa-component-decomposition", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runKitagawaComponentDecomposition(
        kitagawaComponentDecompositionExample.input,
      ),
    ).toEqual({
      ok: true,
      output: kitagawaComponentDecompositionExample.output,
    });
  });

  it("yields a pure rate effect when compositions match", () => {
    const result = calculateKitagawaComponentDecomposition({
      population1: [500, 500],
      rate1: [0.01, 0.05],
      population2: [1000, 1000],
      rate2: [0.02, 0.06],
    });
    expect(result.compositionEffect).toBeCloseTo(0, 12);
    expect(result.totalDifference).toBeCloseTo(result.rateEffect, 12);
  });

  it("rejects mismatched or non-positive populations", () => {
    expect(
      runKitagawaComponentDecomposition({
        population1: [100],
        rate1: [0.01, 0.05],
        population2: [100, 100],
        rate2: [0.01, 0.05],
      }).ok,
    ).toBe(false);
    expect(
      runKitagawaComponentDecomposition({
        population1: [0, 0],
        rate1: [0.01, 0.05],
        population2: [100, 100],
        rate2: [0.01, 0.05],
      }).ok,
    ).toBe(false);
  });
});
