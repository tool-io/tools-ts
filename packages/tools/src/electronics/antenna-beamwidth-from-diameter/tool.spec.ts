import { describe, expect, it } from "vitest";
import {
  antennaBeamwidthFromDiameterExample,
  runAntennaBeamwidthFromDiameter,
} from "./tool.js";

const outputOf = (input: {
  dishDiameterMeters: number;
  wavelengthMeters: number;
}) => {
  const result = runAntennaBeamwidthFromDiameter(input);
  if (!result.ok) throw new Error("expected success");
  return result.output as { beamwidthFromDiameterDeg: number };
};

describe("Beamwidth From Diameter", () => {
  it("reproduces the canonical example", () =>
    expect(
      runAntennaBeamwidthFromDiameter(
        antennaBeamwidthFromDiameterExample.input,
      ),
    ).toEqual({
      ok: true,
      output: { beamwidthFromDiameterDeg: 4.2 },
    }));

  it("evaluates seventy wavelengths per diameter", () => {
    const { beamwidthFromDiameterDeg } = outputOf({
      dishDiameterMeters: 1.2,
      wavelengthMeters: 0.06,
    });
    expect(beamwidthFromDiameterDeg).toBeCloseTo((70 * 0.06) / 1.2, 12);
  });

  it("narrows the beam as diameter grows", () => {
    const small = outputOf({
      dishDiameterMeters: 0.5,
      wavelengthMeters: 0.03,
    }).beamwidthFromDiameterDeg;
    const large = outputOf({
      dishDiameterMeters: 1,
      wavelengthMeters: 0.03,
    }).beamwidthFromDiameterDeg;
    expect(large).toBeCloseTo(small / 2, 12);
  });

  it("widens the beam proportionally with wavelength", () => {
    const low = outputOf({
      dishDiameterMeters: 1,
      wavelengthMeters: 0.01,
    }).beamwidthFromDiameterDeg;
    const high = outputOf({
      dishDiameterMeters: 1,
      wavelengthMeters: 0.03,
    }).beamwidthFromDiameterDeg;
    expect(high).toBeCloseTo(3 * low, 12);
  });

  it("is invariant to scaling both inputs equally", () => {
    const base = outputOf({
      dishDiameterMeters: 0.5,
      wavelengthMeters: 0.03,
    }).beamwidthFromDiameterDeg;
    const scaled = outputOf({
      dishDiameterMeters: 2,
      wavelengthMeters: 0.12,
    }).beamwidthFromDiameterDeg;
    expect(scaled).toBeCloseTo(base, 12);
  });

  it("yields seventy degrees for a one-wavelength dish", () =>
    expect(
      outputOf({ dishDiameterMeters: 0.04, wavelengthMeters: 0.04 })
        .beamwidthFromDiameterDeg,
    ).toBe(70));

  it("rejects non-positive diameter or wavelength", () => {
    expect(
      runAntennaBeamwidthFromDiameter({
        dishDiameterMeters: 0,
        wavelengthMeters: 0.03,
      }).ok,
    ).toBe(false);
    expect(
      runAntennaBeamwidthFromDiameter({
        dishDiameterMeters: 0.5,
        wavelengthMeters: -1,
      }).ok,
    ).toBe(false);
  });
});
