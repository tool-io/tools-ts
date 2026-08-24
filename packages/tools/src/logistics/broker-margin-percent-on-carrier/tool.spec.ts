import { describe, expect, it } from "vitest";
import {
  brokerMarginPercentOnCarrierExample,
  calculateBrokerMarginPercentOnCarrier,
  runBrokerMarginPercentOnCarrier,
} from "./tool.js";

describe("broker-margin-percent-on-carrier", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runBrokerMarginPercentOnCarrier(
        brokerMarginPercentOnCarrierExample.input,
      ),
    ).toEqual({
      ok: true,
      output: brokerMarginPercentOnCarrierExample.output,
    });
  });

  it("reports negative margins when paying above the load rate", () => {
    expect(
      runBrokerMarginPercentOnCarrier({
        carrierPayUsd: 3000,
        shipperPayUsd: 2700,
      }),
    ).toEqual({
      ok: true,
      output: { brokerMarginUsd: -300, marginPercentOnCarrier: -10 },
    });
  });

  it("returns a zero spread at break-even", () => {
    expect(
      calculateBrokerMarginPercentOnCarrier({
        carrierPayUsd: 800,
        shipperPayUsd: 800,
      }),
    ).toEqual({ brokerMarginUsd: 0, marginPercentOnCarrier: 0 });
  });

  it("reports the denominator field when carrier pay is zero", () => {
    const result = runBrokerMarginPercentOnCarrier({
      carrierPayUsd: 0,
      shipperPayUsd: 1000,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues).toEqual([
      expect.objectContaining({
        code: "invalid_field",
        field: "carrierPayUsd",
      }),
    ]);
  });

  it.each([
    { carrierPayUsd: Number.NaN, shipperPayUsd: 100 },
    { carrierPayUsd: Number.POSITIVE_INFINITY, shipperPayUsd: 100 },
    { carrierPayUsd: 100, shipperPayUsd: Number.NaN },
    { carrierPayUsd: 100, shipperPayUsd: -1 },
  ])("rejects invalid direct pay values", (input) => {
    expect(() => calculateBrokerMarginPercentOnCarrier(input)).toThrow(
      /must be finite/,
    );
  });

  it("rejects a percentage that overflows", () => {
    const result = runBrokerMarginPercentOnCarrier({
      carrierPayUsd: Number.MIN_VALUE,
      shipperPayUsd: Number.MAX_VALUE,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues).toEqual([
      expect.objectContaining({
        code: "result_out_of_range",
        field: "shipperPayUsd",
      }),
    ]);
  });
});
