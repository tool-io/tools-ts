import { describe, expect, it } from "vitest";
import {
  calculateReferenceTrendPercentCalculator,
  referenceTrendPercentCalculatorExample,
  runReferenceTrendPercentCalculator,
} from "./tool.js";

describe("archival-studies/reference-trend-percent-calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runReferenceTrendPercentCalculator(
        referenceTrendPercentCalculatorExample.input,
      ),
    ).toEqual({
      ok: true,
      output: referenceTrendPercentCalculatorExample.output,
    });
  });

  it("flags flat months and decreases", () => {
    expect(
      calculateReferenceTrendPercentCalculator({
        previousMonthQuestions: 50,
        currentMonthQuestions: 50,
      }).direction,
    ).toBe("flat");
    expect(
      calculateReferenceTrendPercentCalculator({
        previousMonthQuestions: 40,
        currentMonthQuestions: 30,
      }).trendPercent,
    ).toBe(-25);
  });

  it("rejects a zero previous month baseline", () => {
    expect(
      runReferenceTrendPercentCalculator({
        previousMonthQuestions: 0,
        currentMonthQuestions: 5,
      }).ok,
    ).toBe(false);
  });
});
