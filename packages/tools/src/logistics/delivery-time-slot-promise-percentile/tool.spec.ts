import { describe, expect, it } from "vitest";
import {
  calculateDeliveryTimeSlotPromisePercentile,
  deliveryTimeSlotPromisePercentileExample,
  runDeliveryTimeSlotPromisePercentile,
} from "./tool.js";

describe("logistics/delivery-time-slot-promise-percentile", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runDeliveryTimeSlotPromisePercentile(
        deliveryTimeSlotPromisePercentileExample.input,
      ),
    ).toEqual({
      ok: true,
      output: deliveryTimeSlotPromisePercentileExample.output,
    });
  });

  it("returns the median at percentile 50 with an even sample", () => {
    const result = runDeliveryTimeSlotPromisePercentile({
      deliveryTimesMinutes: [30, 40, 50, 60],
      promisePercentile: 50,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.promisedSlotMinutes as number).toBe(45);
  });

  it("rejects an empty sample", () => {
    expect(
      runDeliveryTimeSlotPromisePercentile({ deliveryTimesMinutes: [] }).ok,
    ).toBe(false);
  });

  it("rejects non-finite samples and percentiles", () => {
    expect(() =>
      calculateDeliveryTimeSlotPromisePercentile({
        deliveryTimesMinutes: [30, Number.NaN],
      }),
    ).toThrow("index 1");
    expect(() =>
      calculateDeliveryTimeSlotPromisePercentile({
        deliveryTimesMinutes: [30],
        promisePercentile: Number.POSITIVE_INFINITY,
      }),
    ).toThrow("between zero and one hundred");
  });
});
