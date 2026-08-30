import { describe, expect, it } from "vitest";
import {
  flagPreliminaryAnalyticsChange,
  preliminaryAnalyticsChangeExample,
  runPreliminaryAnalyticsChange,
} from "./tool.js";

describe("preliminary analytics percent change flagger", () => {
  it("reproduces its canonical example", () => {
    expect(
      runPreliminaryAnalyticsChange(preliminaryAnalyticsChangeExample.input),
    ).toEqual({
      ok: true,
      output: preliminaryAnalyticsChangeExample.output,
    });
  });

  it("flags an exact threshold match", () => {
    expect(
      flagPreliminaryAnalyticsChange({
        absoluteThresholdPercent: 10,
        currentValue: 110,
        previousValue: 100,
      }).flagged,
    ).toBe(true);
  });

  it("preserves the sign of a decrease", () => {
    expect(
      flagPreliminaryAnalyticsChange({
        absoluteThresholdPercent: 10,
        currentValue: 80,
        previousValue: 100,
      }),
    ).toMatchObject({ change: -20, changePercent: -20, flagged: true });
  });

  it("rejects a zero previous value with a stable code", () => {
    expect(
      runPreliminaryAnalyticsChange({
        absoluteThresholdPercent: 5,
        currentValue: 10,
        previousValue: 0,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "zero_previous_value", field: "previousValue" }],
      },
      ok: false,
    });
  });
});
