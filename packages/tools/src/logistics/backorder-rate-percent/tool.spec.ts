import { describe, expect, it } from "vitest";
import {
  backorderRatePercentExample,
  calculateBackorderRatePercent,
  runBackorderRatePercent,
} from "./tool.js";

describe("backorder-rate-percent", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runBackorderRatePercent(backorderRatePercentExample.input)).toEqual({
      ok: true,
      output: backorderRatePercentExample.output,
    });
  });

  it("handles a fully stocked period", () => {
    expect(
      runBackorderRatePercent({
        lineItemsBackordered: 0,
        lineItemsOrdered: 800,
      }),
    ).toEqual({ ok: true, output: { backorderRatePercent: 0 } });
  });

  it("rejects zero ordered lines", () => {
    const result = runBackorderRatePercent({
      lineItemsBackordered: 1,
      lineItemsOrdered: 0,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0]).toMatchObject({
      code: "invalid_field",
      field: "lineItemsOrdered",
    });
  });

  it("rejects more backordered lines than ordered lines", () => {
    const result = runBackorderRatePercent({
      lineItemsBackordered: 101,
      lineItemsOrdered: 100,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0]).toMatchObject({
      code: "invalid_backorders",
      field: "lineItemsBackordered",
    });
  });

  it("rejects fractional counts in both public and direct entry points", () => {
    expect(
      runBackorderRatePercent({
        lineItemsBackordered: 0.5,
        lineItemsOrdered: 10,
      }).ok,
    ).toBe(false);
    expect(() =>
      calculateBackorderRatePercent({
        lineItemsBackordered: 1,
        lineItemsOrdered: 10.5,
      }),
    ).toThrowError("positive safe integer");
  });
});
