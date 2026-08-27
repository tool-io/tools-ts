import { describe, expect, it } from "vitest";
import {
  audioSignalToNoiseAWeightedExample,
  runAudioSignalToNoiseAWeighted,
} from "./tool.js";

const outputOf = (input: {
  aWeightCorrectionDb?: number;
  noiseFloorVrms: number;
  signalVrms: number;
}) => {
  const result = runAudioSignalToNoiseAWeighted(input);
  if (!result.ok) throw new Error("expected success");
  return result.output as { snrAWeightedDb: number };
};

describe("A-Weighted SNR dB", () => {
  it("reproduces the canonical example with zero correction", () =>
    expect(
      runAudioSignalToNoiseAWeighted(audioSignalToNoiseAWeightedExample.input),
    ).toEqual({
      ok: true,
      output: { snrAWeightedDb: 100 },
    }));

  it("defaults the A-weight correction to zero decibels", () =>
    expect(
      runAudioSignalToNoiseAWeighted({ noiseFloorVrms: 1e-4, signalVrms: 2 }),
    ).toEqual(
      runAudioSignalToNoiseAWeighted({
        aWeightCorrectionDb: 0,
        noiseFloorVrms: 1e-4,
        signalVrms: 2,
      }),
    ));

  it("matches twenty log ten of the ratio plus the correction", () => {
    const { snrAWeightedDb } = outputOf({
      aWeightCorrectionDb: 2.3,
      noiseFloorVrms: 3.1e-5,
      signalVrms: 0.9,
    });
    expect(snrAWeightedDb).toBeCloseTo(20 * Math.log10(0.9 / 3.1e-5) + 2.3, 9);
  });

  it("adds twenty decibels per decade of ratio", () => {
    const base = outputOf({
      noiseFloorVrms: 1e-3,
      signalVrms: 1,
    }).snrAWeightedDb;
    const better = outputOf({
      noiseFloorVrms: 1e-4,
      signalVrms: 1,
    }).snrAWeightedDb;
    expect(better - base).toBeCloseTo(20, 12);
  });

  it("shifts exactly by the supplied correction", () => {
    const plain = outputOf({
      noiseFloorVrms: 1e-5,
      signalVrms: 1,
    }).snrAWeightedDb;
    const weighted = outputOf({
      aWeightCorrectionDb: 7,
      noiseFloorVrms: 1e-5,
      signalVrms: 1,
    }).snrAWeightedDb;
    expect(weighted - plain).toBeCloseTo(7, 12);
  });

  it("accepts negative corrections within bounds", () =>
    expect(
      outputOf({
        aWeightCorrectionDb: -12.5,
        noiseFloorVrms: 1e-5,
        signalVrms: 1,
      }).snrAWeightedDb,
    ).toBeCloseTo(87.5, 9));

  it("rejects corrections outside minus fifty to fifty", () => {
    expect(
      runAudioSignalToNoiseAWeighted({
        aWeightCorrectionDb: 50.01,
        noiseFloorVrms: 1e-5,
        signalVrms: 1,
      }).ok,
    ).toBe(false);
    expect(
      runAudioSignalToNoiseAWeighted({
        aWeightCorrectionDb: -50.01,
        noiseFloorVrms: 1e-5,
        signalVrms: 1,
      }).ok,
    ).toBe(false);
  });

  it("rejects non-positive signal or noise levels", () => {
    expect(
      runAudioSignalToNoiseAWeighted({ noiseFloorVrms: 0, signalVrms: 1 }).ok,
    ).toBe(false);
    expect(
      runAudioSignalToNoiseAWeighted({ noiseFloorVrms: 1e-5, signalVrms: -1 })
        .ok,
    ).toBe(false);
  });
});
