import { describe, expect, it } from "vitest";
import { calculateBermudanOption, runBermudanOption } from "./tool.js";

describe("bermudanOptionTool", () => {
  it("does not reduce value when an exercise date is added", () => {
    const european = calculateBermudanOption({ ...input, exerciseSteps: [] });
    const bermudan = calculateBermudanOption({ ...input, exerciseSteps: [50] });
    expect(bermudan.optionPrice).toBeGreaterThanOrEqual(european.optionPrice);
  });

  it("rejects expiration as an early-exercise step", () => {
    expect(runBermudanOption({ ...input, exerciseSteps: [100] }).ok).toBe(
      false,
    );
  });
});

const input = {
  dividendYieldPercent: 0,
  exerciseSteps: [25, 50, 75],
  optionType: "put",
  riskFreeRatePercent: 5,
  spotPrice: 100,
  steps: 100,
  strikePrice: 100,
  timeToExpirationYears: 1,
  volatilityPercent: 20,
} as const;
