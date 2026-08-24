import { describe, expect, it } from "vitest";
import {
  calculateFirstAttemptDeliverySuccessPercent,
  firstAttemptDeliverySuccessPercentExample,
  runFirstAttemptDeliverySuccessPercent,
} from "./tool.js";

describe("first-attempt-delivery-success-percent", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runFirstAttemptDeliverySuccessPercent(
        firstAttemptDeliverySuccessPercentExample.input,
      ),
    ).toEqual({
      ok: true,
      output: firstAttemptDeliverySuccessPercentExample.output,
    });
  });

  it("handles fractional percentages", () => {
    expect(
      runFirstAttemptDeliverySuccessPercent({
        firstAttemptDeliveries: 1,
        totalDeliveryStops: 3,
      }),
    ).toEqual({
      ok: true,
      output: { firstAttemptSuccessPercent: 33.33333333333333 },
    });
  });

  it("rejects zero stops", () => {
    const result = runFirstAttemptDeliverySuccessPercent({
      firstAttemptDeliveries: 5,
      totalDeliveryStops: 0,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0]).toMatchObject({
      code: "invalid_field",
      field: "totalDeliveryStops",
    });
  });

  it("rejects fractional and impossible success counts", () => {
    expect(() =>
      calculateFirstAttemptDeliverySuccessPercent({
        firstAttemptDeliveries: 1.5,
        totalDeliveryStops: 10,
      }),
    ).toThrow("safe integer");
    expect(() =>
      calculateFirstAttemptDeliverySuccessPercent({
        firstAttemptDeliveries: 11,
        totalDeliveryStops: 10,
      }),
    ).toThrow("no greater than");
  });
});
