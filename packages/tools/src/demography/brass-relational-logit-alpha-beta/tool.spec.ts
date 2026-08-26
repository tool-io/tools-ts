import { describe, expect, it } from "vitest";
import {
  calculateBrassRelationalLogitAlphaBeta,
  runBrassRelationalLogitAlphaBeta,
  brassRelationalLogitAlphaBetaExample,
} from "./tool.js";

describe("demography/brass-relational-logit-alpha-beta", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runBrassRelationalLogitAlphaBeta(
        brassRelationalLogitAlphaBetaExample.input,
      ),
    ).toEqual({
      ok: true,
      output: brassRelationalLogitAlphaBetaExample.output,
    });
  });

  it("returns the standard schedule for the identity parameters", () => {
    const result = calculateBrassRelationalLogitAlphaBeta({
      alpha: 0,
      beta: 1,
      standardSurvivalToX: [0.95, 0.6, 0.25],
    });
    result.fittedSurvivalToX.forEach((value, index) =>
      expect(value).toBeCloseTo([0.95, 0.6, 0.25][index]!, 12),
    );
  });

  it("rejects survival values outside the open unit interval", () => {
    expect(
      runBrassRelationalLogitAlphaBeta({
        alpha: 0,
        beta: 1,
        standardSurvivalToX: [0],
      }).ok,
    ).toBe(false);
    expect(
      runBrassRelationalLogitAlphaBeta({
        alpha: 0,
        beta: 1,
        standardSurvivalToX: [1],
      }).ok,
    ).toBe(false);
  });
});
