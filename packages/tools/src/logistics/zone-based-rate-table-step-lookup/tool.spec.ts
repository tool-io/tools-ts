import { describe, expect, it } from "vitest";
import {
  calculateZoneBasedRateTableStepLookup,
  zoneBasedRateTableStepLookupExample,
  runZoneBasedRateTableStepLookup,
} from "./tool.js";

describe("zone-based-rate-table-step-lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runZoneBasedRateTableStepLookup(
        zoneBasedRateTableStepLookupExample.input,
      ),
    ).toEqual({
      ok: true,
      output: zoneBasedRateTableStepLookupExample.output,
    });
  });

  it("returns the first row for zone one", () => {
    const result = runZoneBasedRateTableStepLookup({
      rateTableUsd: [215.4, 268.9],
      zoneNumber: 1,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.rateUsd as number).toBe(215.4);
  });
  it("rejects zones beyond the table length", () => {
    expect(
      runZoneBasedRateTableStepLookup({ rateTableUsd: [100], zoneNumber: 2 })
        .ok,
    ).toBe(false);
  });

  it("rejects fractional zones and invalid unselected rates", () => {
    expect(() =>
      calculateZoneBasedRateTableStepLookup({
        rateTableUsd: [100],
        zoneNumber: 1.5,
      }),
    ).toThrow("positive whole number");
    expect(() =>
      calculateZoneBasedRateTableStepLookup({
        rateTableUsd: [100, Number.NaN],
        zoneNumber: 1,
      }),
    ).toThrow("zone 2");
  });
});
