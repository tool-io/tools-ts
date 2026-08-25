import { describe, expect, it } from "vitest";
import {
  calculateEpirbDetectionRange,
  epirbDetectionRangeExample,
  runEpirbDetectionRange,
} from "./tool.js";

describe("EPIRB Satellite Footprint Radius", () => {
  it("calculates the canonical example exactly", () => {
    expect(runEpirbDetectionRange(epirbDetectionRangeExample.input)).toEqual({
      ok: true,
      output: { coverageRadiusNm: 1685.962564825905 },
    });
  });

  it("applies the default satellite altitude", () => {
    expect(runEpirbDetectionRange({})).toEqual({
      ok: true,
      output: { coverageRadiusNm: 1685.962564825905 },
    });
  });

  it("grows with satellite altitude", () => {
    const low = runEpirbDetectionRange({ satelliteAltitudeKm: 500 });
    const high = runEpirbDetectionRange({ satelliteAltitudeKm: 1000 });
    if (!low.ok || !high.ok) throw new Error("expected success");
    expect(Number(high.output.coverageRadiusNm)).toBeGreaterThan(
      Number(low.output.coverageRadiusNm),
    );
  });

  it("returns zero footprint at zero altitude", () => {
    expect(calculateEpirbDetectionRange({ satelliteAltitudeKm: 0 })).toEqual({
      coverageRadiusNm: 0,
    });
  });

  it("accepts fractional altitudes", () => {
    expect(runEpirbDetectionRange({ satelliteAltitudeKm: 850.5 }).ok).toBe(
      true,
    );
  });

  it("rejects negative altitudes", () => {
    expect(runEpirbDetectionRange({ satelliteAltitudeKm: -1 })).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "satelliteAltitudeKm" }],
      },
      ok: false,
    });
  });

  it("rejects non-finite altitudes", () => {
    expect(runEpirbDetectionRange({ satelliteAltitudeKm: Number.NaN }).ok).toBe(
      false,
    );
  });

  it("rejects unknown fields and null input", () => {
    expect(
      runEpirbDetectionRange({
        beaconId: "27B2",
        satelliteAltitudeKm: 850,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "beaconId" }] },
      ok: false,
    });
    expect(runEpirbDetectionRange(null).ok).toBe(false);
  });
});
