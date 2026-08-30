import { describe, expect, it } from "vitest";
import {
  runStrategyRobustness,
  scoreStrategyRobustnessAcrossQuadrants,
  strategyRobustnessExample,
} from "./tool.js";

describe("strategy robustness across quadrants score", () => {
  it("reproduces its canonical example", () => {
    expect(runStrategyRobustness(strategyRobustnessExample.input)).toEqual({
      ok: true,
      output: strategyRobustnessExample.output,
    });
  });

  it("rejects a strategy below the payoff floor in one quadrant", () => {
    expect(
      scoreStrategyRobustnessAcrossQuadrants({
        maximumRiskScore: 60,
        minimumPayoffScore: 50,
        payoffScores: [80, 49],
        quadrantIds: ["A", "B"],
        riskScores: [20, 30],
      }).robust,
    ).toBe(false);
  });

  it("rejects a strategy above the risk ceiling in one quadrant", () => {
    expect(
      scoreStrategyRobustnessAcrossQuadrants({
        maximumRiskScore: 60,
        minimumPayoffScore: 50,
        payoffScores: [80, 70],
        quadrantIds: ["A", "B"],
        riskScores: [20, 61],
      }).robust,
    ).toBe(false);
  });

  it("rejects mismatched score counts", () => {
    expect(
      runStrategyRobustness({
        maximumRiskScore: 60,
        minimumPayoffScore: 50,
        payoffScores: [80],
        quadrantIds: ["A", "B"],
        riskScores: [20, 30],
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "payoff_scores_length_mismatch", field: "payoffScores" },
        ],
      },
      ok: false,
    });
  });
});
