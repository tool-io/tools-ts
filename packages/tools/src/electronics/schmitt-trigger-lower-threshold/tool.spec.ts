import { describe, expect, it } from "vitest";
import {
  calculateSchmittTriggerLowerThreshold,
  runSchmittTriggerLowerThreshold,
  schmittTriggerLowerThresholdExample,
} from "./tool.js";

describe("Schmitt Lower Threshold", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runSchmittTriggerLowerThreshold(
        schmittTriggerLowerThresholdExample.input,
      ),
    ).toEqual({
      ok: true,
      output: schmittTriggerLowerThresholdExample.output,
    });
  });

  it("defaults the feedback ratio to 0.5", () => {
    expect(
      calculateSchmittTriggerLowerThreshold({ thresholdBaseVolts: 4 })
        .lowerThresholdV,
    ).toBe(2);
  });

  it("scales linearly with the base threshold", () => {
    expect(
      calculateSchmittTriggerLowerThreshold({
        thresholdBaseVolts: 9,
        feedbackRatioNumber: 0.25,
      }).lowerThresholdV,
    ).toBe(6.75);
  });

  it("keeps a tiny positive ratio near the full base", () => {
    expect(
      calculateSchmittTriggerLowerThreshold({
        thresholdBaseVolts: 5,
        feedbackRatioNumber: 0.1,
      }).lowerThresholdV,
    ).toBeCloseTo(4.5);
  });

  it("rejects a non-positive base threshold", () => {
    expect(
      runSchmittTriggerLowerThreshold({ thresholdBaseVolts: 0 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_threshold_base" }] },
      ok: false,
    });
  });

  it("rejects a non-positive feedback ratio", () => {
    expect(
      runSchmittTriggerLowerThreshold({
        thresholdBaseVolts: 5,
        feedbackRatioNumber: -0.2,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_feedback_ratio" }] },
      ok: false,
    });
  });

  it("guards ratios of one or more with ratio_too_large", () => {
    expect(
      runSchmittTriggerLowerThreshold({
        thresholdBaseVolts: 5,
        feedbackRatioNumber: 1,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "ratio_too_large" }] },
      ok: false,
    });
  });

  it("allows a ratio up to 0.9", () => {
    expect(
      calculateSchmittTriggerLowerThreshold({
        thresholdBaseVolts: 10,
        feedbackRatioNumber: 0.9,
      }).lowerThresholdV,
    ).toBeCloseTo(1);
  });
});
