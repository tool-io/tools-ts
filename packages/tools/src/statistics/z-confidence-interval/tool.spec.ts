import { describe, expect, it } from "vitest";
import {
  calculateZConfidenceInterval,
  runZConfidenceInterval,
  zConfidenceIntervalExample,
} from "./tool.js";

describe("Z Confidence Interval Calculator", () => {
  it("calculates the canonical interval", () => {
    const result = calculateZConfidenceInterval(30, 5.4, 1.2, 95);
    expect(result?.[0]).toBeCloseTo(4.970593405507882, 12);
    expect(result?.[1]).toBeCloseTo(5.829406594492118, 12);
  });

  it("supports zero population standard deviation", () =>
    expect(calculateZConfidenceInterval(30, 5.4, 0, 95)).toEqual([5.4, 5.4]));

  it("rejects invalid inputs", () => {
    expect(calculateZConfidenceInterval(0, 5.4, 1.2, 95)).toBeNull();
    expect(calculateZConfidenceInterval(30, 5.4, -1.2, 95)).toBeNull();
    expect(calculateZConfidenceInterval(30, 5.4, 1.2, 97 as 95)).toBeNull();
  });

  it("publishes an executable example", () =>
    expect(runZConfidenceInterval(zConfidenceIntervalExample.input)).toEqual({
      ok: true,
      output: zConfidenceIntervalExample.output,
    }));
});
