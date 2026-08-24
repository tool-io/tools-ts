import { describe, expect, it } from "vitest";
import {
  calculateFillRateLineItemPercent,
  fillRateLineItemPercentExample,
  runFillRateLineItemPercent,
} from "./tool.js";

describe("fill-rate-line-item-percent", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runFillRateLineItemPercent(fillRateLineItemPercentExample.input),
    ).toEqual({
      ok: true,
      output: fillRateLineItemPercentExample.output,
    });
  });

  it("handles a perfect fill", () => {
    expect(
      runFillRateLineItemPercent({
        lineItemsOrdered: 250,
        lineItemsShippedInFull: 250,
      }),
    ).toEqual({ ok: true, output: { fillRatePercent: 100 } });
  });

  it("rejects zero ordered lines", () => {
    const result = runFillRateLineItemPercent({
      lineItemsOrdered: 0,
      lineItemsShippedInFull: 5,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0]).toMatchObject({
      code: "invalid_field",
      field: "lineItemsOrdered",
    });
  });

  it("rejects fractional and overfilled line counts", () => {
    expect(() =>
      calculateFillRateLineItemPercent({
        lineItemsOrdered: 10,
        lineItemsShippedInFull: 1.5,
      }),
    ).toThrow("safe integer");
    expect(() =>
      calculateFillRateLineItemPercent({
        lineItemsOrdered: 10,
        lineItemsShippedInFull: 11,
      }),
    ).toThrow("no greater than");
  });
});
