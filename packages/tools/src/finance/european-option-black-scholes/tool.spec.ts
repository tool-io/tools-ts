import { describe, expect, it } from "vitest";
import { calculateEuropeanOption, runEuropeanOption } from "./tool.js";

describe("europeanOptionTool", () => {
  it("satisfies put-call parity", () => {
    const input = {
      dividendYieldPercent: 2,
      riskFreeRatePercent: 5,
      spotPrice: 100,
      strikePrice: 95,
      timeToExpirationYears: 1.5,
      volatilityPercent: 25,
    } as const;
    const call = calculateEuropeanOption({ ...input, optionType: "call" });
    const put = calculateEuropeanOption({ ...input, optionType: "put" });
    expect(call.optionPrice - put.optionPrice).toBeCloseTo(
      100 * Math.exp(-0.02 * 1.5) - 95 * Math.exp(-0.05 * 1.5),
      8,
    );
  });

  it("rejects zero volatility", () => {
    expect(
      runEuropeanOption({
        dividendYieldPercent: 0,
        optionType: "call",
        riskFreeRatePercent: 5,
        spotPrice: 100,
        strikePrice: 100,
        timeToExpirationYears: 1,
        volatilityPercent: 0,
      }).ok,
    ).toBe(false);
  });
});
