import { describe, expect, it } from "vitest";
import {
  checkExtrapolationHorizonLimit,
  extrapolationLimitExample,
  runExtrapolationLimit,
} from "./tool.js";

describe("extrapolation horizon limit warning checker", () => {
  it("reproduces its canonical example", () => {
    expect(runExtrapolationLimit(extrapolationLimitExample.input)).toEqual({
      ok: true,
      output: extrapolationLimitExample.output,
    });
  });

  it("keeps a zero-year projection unchanged", () => {
    expect(
      checkExtrapolationHorizonLimit({
        annualUncertaintyGrowthPercent: 50,
        baselineUncertaintyPercent: 10,
        criticalThresholdPercent: 80,
        warningThresholdPercent: 20,
        yearsAhead: 0,
      }),
    ).toEqual({ projectedUncertaintyPercent: 10, status: "safe" });
  });

  it("classifies a critical projection", () => {
    expect(
      checkExtrapolationHorizonLimit({
        annualUncertaintyGrowthPercent: 60,
        baselineUncertaintyPercent: 10,
        criticalThresholdPercent: 15,
        warningThresholdPercent: 11,
        yearsAhead: 1,
      }).status,
    ).toBe("critical");
  });

  it("rejects reversed warning thresholds", () => {
    expect(
      runExtrapolationLimit({
        annualUncertaintyGrowthPercent: 10,
        baselineUncertaintyPercent: 10,
        criticalThresholdPercent: 20,
        warningThresholdPercent: 30,
        yearsAhead: 1,
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "invalid_threshold_order",
            field: "criticalThresholdPercent",
          },
        ],
      },
      ok: false,
    });
  });
});
