import { describe, expect, it } from "vitest";
import {
  calculateTravelTimeOrderPickerBatch,
  travelTimeOrderPickerBatchExample,
  runTravelTimeOrderPickerBatch,
} from "./tool.js";

describe("travel-time-order-picker-batch", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runTravelTimeOrderPickerBatch(travelTimeOrderPickerBatchExample.input),
    ).toEqual({
      ok: true,
      output: travelTimeOrderPickerBatchExample.output,
    });
  });

  it("times pure travel when no lines are picked", () => {
    const result = runTravelTimeOrderPickerBatch({
      travelDistanceM: 120,
      walkingSpeedMps: 2,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.travelTimeSeconds as number).toBe(60);
    expect(result.output.pickTimeSeconds as number).toBe(0);
    expect(result.output.totalTaskMinutes as number).toBe(1);
  });
  it("rejects non-positive walking speeds", () => {
    expect(
      runTravelTimeOrderPickerBatch({
        travelDistanceM: 100,
        walkingSpeedMps: 0,
      }).ok,
    ).toBe(false);
  });

  it("rejects non-finite rates and overflowing task times", () => {
    expect(() =>
      calculateTravelTimeOrderPickerBatch({
        travelDistanceM: 100,
        walkingSpeedMps: Number.POSITIVE_INFINITY,
      }),
    ).toThrow("must be finite");
    expect(() =>
      calculateTravelTimeOrderPickerBatch({
        averageSecondsPerPick: Number.MAX_VALUE,
        pickLinesCompleted: 2,
        travelDistanceM: 0,
      }),
    ).toThrow("outside the representable range");
  });
});
