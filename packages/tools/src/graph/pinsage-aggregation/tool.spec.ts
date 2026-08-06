import { describe, expect, it } from "vitest";
import {
  demonstratePinsageAggregation,
  pinsageAggregationExample,
  runPinsageAggregation,
} from "./tool.js";
describe("PinSage Aggregation", () => {
  it("normalizes the embedding", () =>
    expect(
      Math.hypot(
        ...(demonstratePinsageAggregation(
          pinsageAggregationExample.input.features,
          pinsageAggregationExample.input.neighbors,
          0,
          1,
        )?.embedding ?? []),
      ),
    ).toBeCloseTo(1));
  it("publishes an executable example", () =>
    expect(runPinsageAggregation(pinsageAggregationExample.input)).toEqual({
      ok: true,
      output: pinsageAggregationExample.output,
    }));
});
