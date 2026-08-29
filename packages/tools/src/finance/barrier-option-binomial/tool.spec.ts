import { describe, expect, it } from "vitest";
import { calculateBarrierOption } from "./tool.js";

describe("barrierOptionTool", () => {
  it("returns zero when the barrier is already breached", () => {
    expect(calculateBarrierOption({ ...input, barrierPrice: 95 })).toEqual({
      knockedOutInitially: true,
      optionPrice: 0,
    });
  });

  it("values an unbreached knock-out option", () => {
    const result = calculateBarrierOption(input);
    expect(result.knockedOutInitially).toBe(false);
    expect(result.optionPrice).toBeGreaterThan(0);
  });
});

const input = {
  barrierDirection: "up-and-out",
  barrierPrice: 130,
  dividendYieldPercent: 0,
  optionType: "call",
  riskFreeRatePercent: 5,
  spotPrice: 100,
  steps: 100,
  strikePrice: 100,
  timeToExpirationYears: 1,
  volatilityPercent: 20,
} as const;
