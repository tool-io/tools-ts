import { describe, expect, it } from "vitest";
import {
  calculateRadarReceivedPower,
  radarReceivedPowerExample,
  runRadarReceivedPower,
} from "./tool.js";

describe("Radar Received Power", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runRadarReceivedPower(radarReceivedPowerExample.input)).toEqual({
      ok: true,
      output: radarReceivedPowerExample.output,
    });
  });

  it("matches the radar range equation on another operating point", () => {
    expect(
      calculateRadarReceivedPower({
        antennaGainLinear: 20,
        ptxWatts: 500,
        radarCrossSectionM2: 5,
        rangeMeters: 2000,
        wavelengthMeters: 0.1,
      }).receivedPowerWatts,
    ).toBe((500 * 20 ** 2 * 0.1 ** 2 * 5) / (1984.4017 * 2000 ** 4));
  });

  it("falls by sixteen dB when the range doubles", () => {
    const near = calculateRadarReceivedPower(
      radarReceivedPowerExample.input,
    ).receivedPowerWatts;
    const far = calculateRadarReceivedPower({
      ...radarReceivedPowerExample.input,
      rangeMeters: 2000,
    }).receivedPowerWatts;
    expect(10 * Math.log10(near / far)).toBeCloseTo(12.041199826559243, 9);
  });

  it("scales linearly with transmit power and cross section", () => {
    const base = calculateRadarReceivedPower({
      ...radarReceivedPowerExample.input,
      ptxWatts: 200,
      radarCrossSectionM2: 2,
    }).receivedPowerWatts;
    expect(base).toBeCloseTo(4 * 4.535372046899577e-15, 27);
  });

  it("returns zero for a zero cross section", () => {
    expect(
      runRadarReceivedPower({
        ...radarReceivedPowerExample.input,
        radarCrossSectionM2: 0,
      }),
    ).toEqual({ ok: true, output: { receivedPowerWatts: 0 } });
  });

  it("rejects non-positive transmit power, gain, wavelength, or range", () => {
    expect(
      runRadarReceivedPower({ ...radarReceivedPowerExample.input, ptxWatts: 0 })
        .ok,
    ).toBe(false);
    expect(
      runRadarReceivedPower({
        ...radarReceivedPowerExample.input,
        antennaGainLinear: -1,
      }).ok,
    ).toBe(false);
    expect(
      runRadarReceivedPower({
        ...radarReceivedPowerExample.input,
        wavelengthMeters: 0,
      }).ok,
    ).toBe(false);
    expect(
      runRadarReceivedPower({
        ...radarReceivedPowerExample.input,
        rangeMeters: 0,
      }).ok,
    ).toBe(false);
  });

  it("rejects a negative cross section", () => {
    expect(
      runRadarReceivedPower({
        ...radarReceivedPowerExample.input,
        radarCrossSectionM2: -1,
      }).ok,
    ).toBe(false);
  });
});
