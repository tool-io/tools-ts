import { describe, expect, it } from "vitest";
import { runAntennaBeamwidth } from "./tool.js";

describe("Beamwidth Approx", () => {
  it("calculates a valid result", () =>
    expect(
      runAntennaBeamwidth({ wavelengthMeters: 0.03, dishDiameterMeters: 0.45 }),
    ).toEqual({
      ok: true,
      output: { beamwidthDegrees: 4.666666666666667 },
    }));
  it("narrows as the dish grows", () =>
    expect(
      runAntennaBeamwidth({ wavelengthMeters: 0.03, dishDiameterMeters: 0.9 }),
    ).toEqual({
      ok: true,
      output: { beamwidthDegrees: 2.3333333333333335 },
    }));
  it("widens with longer wavelengths", () =>
    expect(
      runAntennaBeamwidth({ wavelengthMeters: 0.06, dishDiameterMeters: 0.45 }),
    ).toEqual({
      ok: true,
      output: { beamwidthDegrees: 9.333333333333334 },
    }));
  it("supports large ground-station dishes", () =>
    expect(
      runAntennaBeamwidth({ wavelengthMeters: 0.07, dishDiameterMeters: 7 }),
    ).toEqual({
      ok: true,
      output: { beamwidthDegrees: 0.7000000000000001 },
    }));
  it("rejects zero wavelength", () =>
    expect(
      runAntennaBeamwidth({ wavelengthMeters: 0, dishDiameterMeters: 0.45 }).ok,
    ).toBe(false));
  it("rejects negative wavelength", () =>
    expect(
      runAntennaBeamwidth({ wavelengthMeters: -0.03, dishDiameterMeters: 0.45 })
        .ok,
    ).toBe(false));
  it("rejects zero diameter", () =>
    expect(
      runAntennaBeamwidth({ wavelengthMeters: 0.03, dishDiameterMeters: 0 }).ok,
    ).toBe(false));
});
