import { describe, expect, it } from "vitest";
import { calculateAmericanOption, runAmericanOption } from "./tool.js";

describe("americanOptionTool", () => {
  it("never values the early-exercise tree below its European tree", () => {
    const result = calculateAmericanOption({
      dividendYieldPercent: 0,
      optionType: "put",
      riskFreeRatePercent: 5,
      spotPrice: 80,
      steps: 200,
      strikePrice: 100,
      timeToExpirationYears: 1,
      volatilityPercent: 20,
    });
    expect(result.americanPrice).toBeGreaterThanOrEqual(
      result.europeanBinomialPrice,
    );
    expect(result.earlyExercisePremium).toBeGreaterThan(0);
  });

  it("rejects nonpositive prices", () => {
    expect(runAmericanOption({ ...americanInput, spotPrice: 0 }).ok).toBe(
      false,
    );
  });
});

const americanInput = {
  dividendYieldPercent: 0,
  optionType: "call",
  riskFreeRatePercent: 5,
  spotPrice: 100,
  steps: 10,
  strikePrice: 100,
  timeToExpirationYears: 1,
  volatilityPercent: 20,
};
