import { describe, expect, it } from "vitest";
import {
  calculateClaimsFrequencyPerShipmentPercent,
  claimsFrequencyPerShipmentPercentExample,
  runClaimsFrequencyPerShipmentPercent,
} from "./tool.js";

describe("claims-frequency-per-shipment-percent", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runClaimsFrequencyPerShipmentPercent(
        claimsFrequencyPerShipmentPercentExample.input,
      ),
    ).toEqual({
      ok: true,
      output: claimsFrequencyPerShipmentPercentExample.output,
    });
  });

  it("handles a claim-free period", () => {
    expect(
      runClaimsFrequencyPerShipmentPercent({
        cargoClaimsFiled: 0,
        shipmentsDelivered: 9000,
      }),
    ).toEqual({ ok: true, output: { claimsFrequencyPercent: 0 } });
  });

  it("allows more than one claim filing per delivered shipment", () => {
    expect(
      calculateClaimsFrequencyPerShipmentPercent({
        cargoClaimsFiled: 3,
        shipmentsDelivered: 2,
      }),
    ).toEqual({ claimsFrequencyPercent: 150 });
  });

  it("reports zero shipments through the public contract", () => {
    const result = runClaimsFrequencyPerShipmentPercent({
      cargoClaimsFiled: 3,
      shipmentsDelivered: 0,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues).toEqual([
      expect.objectContaining({
        code: "invalid_field",
        field: "shipmentsDelivered",
      }),
    ]);
  });

  it("rejects fractional, negative, and non-finite direct counts", () => {
    expect(() =>
      calculateClaimsFrequencyPerShipmentPercent({
        cargoClaimsFiled: 1.5,
        shipmentsDelivered: 10,
      }),
    ).toThrow("non-negative safe integer");
    expect(() =>
      calculateClaimsFrequencyPerShipmentPercent({
        cargoClaimsFiled: -1,
        shipmentsDelivered: 10,
      }),
    ).toThrow("non-negative safe integer");
    expect(() =>
      calculateClaimsFrequencyPerShipmentPercent({
        cargoClaimsFiled: 1,
        shipmentsDelivered: Number.POSITIVE_INFINITY,
      }),
    ).toThrow("positive safe integer");
  });
});
