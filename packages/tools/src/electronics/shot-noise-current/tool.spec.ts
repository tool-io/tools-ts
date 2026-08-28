import { describe, expect, it } from "vitest";
import {
  calculateShotNoiseCurrent,
  runShotNoiseCurrent,
  shotNoiseCurrentExample,
} from "./tool.js";

describe("Shot Noise Current", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runShotNoiseCurrent(shotNoiseCurrentExample.input)).toEqual({
      ok: true,
      output: shotNoiseCurrentExample.output,
    });
  });

  it("matches the square-root formula on another operating point", () => {
    expect(
      calculateShotNoiseCurrent({
        averageCurrentAmps: 0.02,
        bandwidthHz: 250000,
      }).shotNoiseCurrentA,
    ).toBe(Math.sqrt(2 * 1.602176634e-19 * 0.02 * 250000));
  });

  it("scales with the square root of current", () => {
    expect(
      calculateShotNoiseCurrent({
        averageCurrentAmps: 0.004,
        bandwidthHz: 1000000,
      }).shotNoiseCurrentA,
    ).toBeCloseTo(2 * 1.7900707438534376e-8, 24);
  });

  it("scales with the square root of bandwidth", () => {
    expect(
      calculateShotNoiseCurrent({
        averageCurrentAmps: 0.001,
        bandwidthHz: 4000000,
      }).shotNoiseCurrentA,
    ).toBeCloseTo(2 * 1.7900707438534376e-8, 24);
  });

  it("rejects non-positive current", () => {
    expect(
      runShotNoiseCurrent({ averageCurrentAmps: 0, bandwidthHz: 1000000 }).ok,
    ).toBe(false);
  });

  it("rejects non-positive bandwidth", () => {
    expect(
      runShotNoiseCurrent({ averageCurrentAmps: 0.001, bandwidthHz: -1 }).ok,
    ).toBe(false);
  });
});
