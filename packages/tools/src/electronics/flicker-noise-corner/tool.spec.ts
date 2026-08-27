import { describe, expect, it } from "vitest";
import {
  calculateFlickerNoiseCorner,
  flickerNoiseCornerExample,
  runFlickerNoiseCorner,
} from "./tool.js";

describe("Flicker Corner Frequency", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runFlickerNoiseCorner(flickerNoiseCornerExample.input)).toEqual({
      ok: true,
      output: flickerNoiseCornerExample.output,
    });
  });

  it("matches the squared-ratio formula on another pair", () => {
    expect(
      calculateFlickerNoiseCorner({
        flickerUvAt1Hz: 10,
        whiteNoiseUvPerRootHz: 4,
      }).cornerFrequencyHz,
    ).toBe(Math.pow(10 / 4, 2));
  });

  it("returns one hertz when the densities match", () => {
    expect(
      runFlickerNoiseCorner({ flickerUvAt1Hz: 3, whiteNoiseUvPerRootHz: 3 }),
    ).toEqual({ ok: true, output: { cornerFrequencyHz: 1 } });
  });

  it("drops below one hertz when white noise dominates", () => {
    expect(
      calculateFlickerNoiseCorner({
        flickerUvAt1Hz: 1,
        whiteNoiseUvPerRootHz: 10,
      }).cornerFrequencyHz,
    ).toBe(Math.pow(0.1, 2));
  });

  it("rises quadratically as the flicker density grows", () => {
    expect(
      calculateFlickerNoiseCorner({
        ...flickerNoiseCornerExample.input,
        flickerUvAt1Hz: 40,
      }).cornerFrequencyHz,
    ).toBe(400);
  });

  it("rejects non-positive flicker density", () => {
    expect(
      runFlickerNoiseCorner({ flickerUvAt1Hz: 0, whiteNoiseUvPerRootHz: 2 }).ok,
    ).toBe(false);
  });

  it("rejects non-positive white density", () => {
    expect(
      runFlickerNoiseCorner({ flickerUvAt1Hz: 4, whiteNoiseUvPerRootHz: -2 })
        .ok,
    ).toBe(false);
  });
});
