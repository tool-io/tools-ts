import { describe, expect, it } from "vitest";
import {
  calculateDigitizationPriorityScoreCalculator,
  digitizationPriorityScoreCalculatorExample,
  runDigitizationPriorityScoreCalculator,
} from "./tool.js";

describe("archival-studies/digitization-priority-score-calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runDigitizationPriorityScoreCalculator(
        digitizationPriorityScoreCalculatorExample.input,
      ),
    ).toEqual({
      ok: true,
      output: digitizationPriorityScoreCalculatorExample.output,
    });
  });

  it("normalizes custom weights that do not sum to one", () => {
    const result = calculateDigitizationPriorityScoreCalculator({
      significanceScore: 50,
      conditionRiskScore: 100,
      demandScore: 25,
      significanceWeight: 1,
      conditionWeight: 3,
      demandWeight: 1,
    });
    expect(result.weightedPriorityScore).toBe(75);
  });

  it("rejects out-of-range scores and non-positive weights", () => {
    expect(
      runDigitizationPriorityScoreCalculator({
        significanceScore: 120,
        conditionRiskScore: 60,
        demandScore: 40,
      }).ok,
    ).toBe(false);
    expect(
      runDigitizationPriorityScoreCalculator({
        significanceScore: 80,
        conditionRiskScore: 60,
        demandScore: 40,
        conditionWeight: 0,
        demandWeight: 0,
        significanceWeight: 0,
      }).ok,
    ).toBe(false);
  });
});
