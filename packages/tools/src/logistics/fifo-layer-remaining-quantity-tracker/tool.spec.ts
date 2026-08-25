import { describe, expect, it } from "vitest";
import {
  calculateFifoLayerRemainingQuantityTracker,
  fifoLayerRemainingQuantityTrackerExample,
  runFifoLayerRemainingQuantityTracker,
} from "./tool.js";

describe("fifo-layer-remaining-quantity-tracker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runFifoLayerRemainingQuantityTracker(
        fifoLayerRemainingQuantityTrackerExample.input,
      ),
    ).toEqual({
      ok: true,
      output: fifoLayerRemainingQuantityTrackerExample.output,
    });
  });

  it("keeps a partial remainder in the oldest layer", () => {
    expect(
      runFifoLayerRemainingQuantityTracker({
        oldestLayerUnits: 300,
        totalUnitsShippedSinceLayerReceipt: 120,
      }),
    ).toEqual({
      ok: true,
      output: {
        oldestLayerDepleted: false,
        oldestLayerRemainingUnits: 180,
        unitsDrawnFromNewerLayers: 0,
      },
    });
  });

  it("rejects an empty oldest layer", () => {
    expect(
      runFifoLayerRemainingQuantityTracker({
        oldestLayerUnits: 0,
        totalUnitsShippedSinceLayerReceipt: 10,
      }).ok,
    ).toBe(false);
  });

  it("rejects fractional shipment counts in the direct calculator", () => {
    expect(() =>
      calculateFifoLayerRemainingQuantityTracker({
        oldestLayerUnits: 100,
        totalUnitsShippedSinceLayerReceipt: 1.5,
      }),
    ).toThrowError("Units shipped must be a non-negative whole number.");
  });
});
