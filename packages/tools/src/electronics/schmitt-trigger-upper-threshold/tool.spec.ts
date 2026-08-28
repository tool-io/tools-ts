import { describe, expect, it } from "vitest";
import {
  runSchmittTriggerUpperThreshold,
  schmittTriggerUpperThresholdExample,
} from "./tool.js";

describe("Schmitt Upper Threshold", () => {
  it("reproduces its canonical example with the default ratio", () => {
    expect(
      runSchmittTriggerUpperThreshold(
        schmittTriggerUpperThresholdExample.input,
      ),
    ).toEqual({
      ok: true,
      output: schmittTriggerUpperThresholdExample.output,
    });
  });

  it("applies an explicit unit feedback ratio", () => {
    expect(
      runSchmittTriggerUpperThreshold({
        feedbackRatioNumber: 1,
        thresholdBaseVolts: 5,
      }),
    ).toEqual({ ok: true, output: { upperThresholdV: 10 } });
  });

  it("applies a quarter feedback ratio", () => {
    expect(
      runSchmittTriggerUpperThreshold({
        feedbackRatioNumber: 0.25,
        thresholdBaseVolts: 4,
      }),
    ).toEqual({ ok: true, output: { upperThresholdV: 5 } });
  });

  it("rejects a zero feedback ratio with invalid_ratio", () => {
    expect(
      runSchmittTriggerUpperThreshold({
        feedbackRatioNumber: 0,
        thresholdBaseVolts: 2,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_ratio", field: "feedbackRatioNumber" }],
      },
      ok: false,
    });
  });

  it("rejects a non-positive threshold base", () => {
    expect(
      runSchmittTriggerUpperThreshold({ thresholdBaseVolts: 0 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_threshold", field: "thresholdBaseVolts" }],
      },
      ok: false,
    });
  });

  it("requires the threshold base", () => {
    expect(
      runSchmittTriggerUpperThreshold({ feedbackRatioNumber: 0.5 }).ok,
    ).toBe(false);
  });
});
