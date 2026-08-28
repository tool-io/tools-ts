import { describe, expect, it } from "vitest";
import {
  radarCrossSectionFromPowerExample,
  runRadarCrossSectionFromPower,
} from "./tool.js";

const outputOf = (input: {
  antennaGainLinear: number;
  prxWatts: number;
  ptxWatts: number;
  rangeMeters: number;
  wavelengthMeters: number;
}) => {
  const result = runRadarCrossSectionFromPower(input);
  if (!result.ok) throw new Error("expected success");
  return result.output as { computedRcsM2: number };
};

describe("RCS From Received Power", () => {
  it("reproduces the canonical example", () =>
    expect(
      runRadarCrossSectionFromPower(radarCrossSectionFromPowerExample.input),
    ).toEqual({
      ok: true,
      output: { computedRcsM2: 2.4498786512831705 },
    }));

  it("matches the radar equation with the (4 pi)^3 constant", () => {
    const { computedRcsM2 } = outputOf({
      antennaGainLinear: 40,
      prxWatts: 5e-10,
      ptxWatts: 2500,
      rangeMeters: 500,
      wavelengthMeters: 0.015,
    });
    expect(computedRcsM2).toBeCloseTo(
      (5e-10 * Math.pow(4 * Math.PI, 3) * Math.pow(500, 4)) /
        (2500 * 1600 * Math.pow(0.015, 2)),
      9,
    );
  });

  it("grows sixteen-fold when range doubles", () => {
    const base = outputOf({
      antennaGainLinear: 30,
      prxWatts: 1e-12,
      ptxWatts: 1000,
      rangeMeters: 1000,
      wavelengthMeters: 0.03,
    }).computedRcsM2;
    const far = outputOf({
      antennaGainLinear: 30,
      prxWatts: 1e-12,
      ptxWatts: 1000,
      rangeMeters: 2000,
      wavelengthMeters: 0.03,
    }).computedRcsM2;
    expect(far).toBeCloseTo(base * 16, 6);
  });

  it("scales linearly with received power", () => {
    const base = outputOf({
      antennaGainLinear: 30,
      prxWatts: 1e-12,
      ptxWatts: 1000,
      rangeMeters: 1000,
      wavelengthMeters: 0.03,
    }).computedRcsM2;
    const stronger = outputOf({
      antennaGainLinear: 30,
      prxWatts: 2e-12,
      ptxWatts: 1000,
      rangeMeters: 1000,
      wavelengthMeters: 0.03,
    }).computedRcsM2;
    expect(stronger).toBeCloseTo(base * 2, 12);
  });

  it("scales inversely with transmit power and gain squared", () => {
    const base = outputOf({
      antennaGainLinear: 30,
      prxWatts: 1e-12,
      ptxWatts: 1000,
      rangeMeters: 1000,
      wavelengthMeters: 0.03,
    }).computedRcsM2;
    expect(
      outputOf({
        antennaGainLinear: 60,
        prxWatts: 1e-12,
        ptxWatts: 2000,
        rangeMeters: 1000,
        wavelengthMeters: 0.03,
      }).computedRcsM2,
    ).toBeCloseTo(base / 8, 12);
  });

  it("shrinks with wavelength squared", () => {
    const base = outputOf({
      antennaGainLinear: 30,
      prxWatts: 1e-12,
      ptxWatts: 1000,
      rangeMeters: 1000,
      wavelengthMeters: 0.06,
    }).computedRcsM2;
    const shorter = outputOf({
      antennaGainLinear: 30,
      prxWatts: 1e-12,
      ptxWatts: 1000,
      rangeMeters: 1000,
      wavelengthMeters: 0.03,
    }).computedRcsM2;
    expect(shorter).toBeCloseTo(base * 4, 9);
  });

  it("rejects zero or negative powers, range, gain, and wavelength", () => {
    for (const bad of [
      { prxWatts: 0 },
      { ptxWatts: -1 },
      { rangeMeters: 0 },
      { antennaGainLinear: 0 },
      { wavelengthMeters: -0.03 },
    ])
      expect(
        runRadarCrossSectionFromPower({
          ...radarCrossSectionFromPowerExample.input,
          ...bad,
        }).ok,
      ).toBe(false);
  });
});
