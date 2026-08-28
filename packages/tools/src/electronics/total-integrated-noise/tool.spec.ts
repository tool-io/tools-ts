import { describe, expect, it } from "vitest";
import {
  calculateTotalIntegratedNoise,
  runTotalIntegratedNoise,
  totalIntegratedNoiseExample,
} from "./tool.js";

describe("Integrated Noise µVrms", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runTotalIntegratedNoise(totalIntegratedNoiseExample.input)).toEqual({
      ok: true,
      output: totalIntegratedNoiseExample.output,
    });
  });

  it("matches the density times root-bandwidth formula", () => {
    expect(
      calculateTotalIntegratedNoise({
        bandwidthHz: 1000000,
        densityNVPerRootHz: 25,
      }).integratedNoiseUvRms,
    ).toBe((25 * Math.sqrt(1000000)) / 1000);
  });

  it("scales with the square root of bandwidth", () => {
    expect(
      calculateTotalIntegratedNoise({
        bandwidthHz: 40000,
        densityNVPerRootHz: 2,
      }).integratedNoiseUvRms,
    ).toBeCloseTo((2 * 200) / 1000, 9);
  });

  it("scales linearly with the noise density", () => {
    expect(
      calculateTotalIntegratedNoise({
        ...totalIntegratedNoiseExample.input,
        densityNVPerRootHz: 7,
      }).integratedNoiseUvRms,
    ).toBe(0.014);
  });

  it("rejects non-positive density", () => {
    expect(
      runTotalIntegratedNoise({ bandwidthHz: 4, densityNVPerRootHz: 0 }).ok,
    ).toBe(false);
  });

  it("rejects non-positive bandwidth", () => {
    expect(
      runTotalIntegratedNoise({ bandwidthHz: -4, densityNVPerRootHz: 1 }).ok,
    ).toBe(false);
  });
});
