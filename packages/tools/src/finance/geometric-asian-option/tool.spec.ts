import { describe, expect, it } from "vitest";
import {
  calculateGeometricAsianOption,
  runGeometricAsianOption,
} from "./tool.js";

describe("geometricAsianOptionTool", () => {
  it("obeys geometric-average put-call parity", () => {
    const input = {
      dividendYieldPercent: 1,
      riskFreeRatePercent: 4,
      spotPrice: 100,
      strikePrice: 105,
      timeToExpirationYears: 2,
      volatilityPercent: 30,
    } as const;
    const call = calculateGeometricAsianOption({
      ...input,
      optionType: "call",
    });
    const put = calculateGeometricAsianOption({ ...input, optionType: "put" });
    expect(call.optionPrice - put.optionPrice).toBeCloseTo(
      call.expectedDiscountedGeometricAverage - 105 * Math.exp(-0.04 * 2),
      8,
    );
  });

  it("rejects zero time", () => {
    expect(
      runGeometricAsianOption({
        dividendYieldPercent: 0,
        optionType: "call",
        riskFreeRatePercent: 5,
        spotPrice: 100,
        strikePrice: 100,
        timeToExpirationYears: 0,
        volatilityPercent: 20,
      }).ok,
    ).toBe(false);
  });
});
