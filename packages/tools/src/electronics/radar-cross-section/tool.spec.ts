import { describe, expect, it } from "vitest";
import { runRadarCrossSection } from "./tool.js";
describe("RCS From Power Ratio", () => {
  const baseInput = {
    gainLinear: 100,
    ptxWatts: 1000,
    rangeMeters: 1000,
    receivedWatts: 1e-12,
    wavelengthMeters: 0.03,
  };
  it("calculates cross section from the radar equation", () =>
    expect(runRadarCrossSection(baseInput)).toEqual({
      ok: true,
      output: { radarCrossSectionM2: 0.22048907861546532 },
    }));
  it("scales linearly with received power", () =>
    expect(
      runRadarCrossSection({ ...baseInput, receivedWatts: 2e-12 }),
    ).toEqual({
      ok: true,
      output: { radarCrossSectionM2: 0.44097815723093065 },
    }));
  it("rejects a zero received power", () =>
    expect(runRadarCrossSection({ ...baseInput, receivedWatts: 0 }).ok).toBe(
      false,
    ));
  it("rejects a zero transmit power", () =>
    expect(runRadarCrossSection({ ...baseInput, ptxWatts: 0 }).ok).toBe(false));
  it("rejects a zero gain", () =>
    expect(runRadarCrossSection({ ...baseInput, gainLinear: 0 }).ok).toBe(
      false,
    ));
  it("rejects a zero range", () =>
    expect(runRadarCrossSection({ ...baseInput, rangeMeters: 0 }).ok).toBe(
      false,
    ));
  it("rejects a negative wavelength", () =>
    expect(
      runRadarCrossSection({ ...baseInput, wavelengthMeters: -0.03 }).ok,
    ).toBe(false));
});
