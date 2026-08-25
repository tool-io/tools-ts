import { describe, expect, it } from "vitest";
import { runPinningCo2ThresholdTriggerChecker } from "./tool.js";
describe("CO2 Pinning Trigger", () => {
  it("reports below the default threshold", () =>
    expect(
      runPinningCo2ThresholdTriggerChecker({ currentCo2Ppm: 800 }),
    ).toEqual({
      ok: true,
      output: { atOrBelowThreshold: true, currentCo2Ppm: 800 },
    }));
  it("includes the default threshold boundary", () =>
    expect(
      runPinningCo2ThresholdTriggerChecker({ currentCo2Ppm: 1000 }),
    ).toEqual({
      ok: true,
      output: { atOrBelowThreshold: true, currentCo2Ppm: 1000 },
    }));
  it("reports above the default threshold", () =>
    expect(
      runPinningCo2ThresholdTriggerChecker({ currentCo2Ppm: 1200 }),
    ).toEqual({
      ok: true,
      output: { atOrBelowThreshold: false, currentCo2Ppm: 1200 },
    }));
  it("honors a custom threshold", () =>
    expect(
      runPinningCo2ThresholdTriggerChecker({
        currentCo2Ppm: 3000,
        pinningThresholdPpm: 5000,
      }),
    ).toEqual({
      ok: true,
      output: { atOrBelowThreshold: true, currentCo2Ppm: 3000 },
    }));
  it("accepts zero as a sensor reading", () =>
    expect(runPinningCo2ThresholdTriggerChecker({ currentCo2Ppm: 0 })).toEqual({
      ok: true,
      output: { atOrBelowThreshold: true, currentCo2Ppm: 0 },
    }));
  it("rejects negative carbon dioxide readings", () =>
    expect(runPinningCo2ThresholdTriggerChecker({ currentCo2Ppm: -1 }).ok).toBe(
      false,
    ));
  it("rejects nonpositive thresholds", () =>
    expect(
      runPinningCo2ThresholdTriggerChecker({
        currentCo2Ppm: 800,
        pinningThresholdPpm: 0,
      }).ok,
    ).toBe(false));
  it("accepts high caller-selected thresholds", () =>
    expect(
      runPinningCo2ThresholdTriggerChecker({
        currentCo2Ppm: 800,
        pinningThresholdPpm: 5001,
      }),
    ).toEqual({
      ok: true,
      output: { atOrBelowThreshold: true, currentCo2Ppm: 800 },
    }));
});
