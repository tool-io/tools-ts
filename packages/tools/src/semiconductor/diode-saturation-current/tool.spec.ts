import { describe, expect, it } from "vitest";
import { calculateDiodeSaturationCurrent, diodeSaturationCurrentExample, runDiodeSaturationCurrent } from "./tool.js";

describe("diode saturation current calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDiodeSaturationCurrent(diodeSaturationCurrentExample.input)).toEqual({
      ok: true,
      output: diodeSaturationCurrentExample.output,
    });
  });

  it("scales the extracted saturation current with ideality", () => {
    const vt = (1.380649e-23 * 300) / 1.602176634e-19;
    const one = calculateDiodeSaturationCurrent({
      forwardCurrentMa: 1,
      forwardVoltageV: 0.12,
      idealityFactor: 1,
      temperatureK: 300,
    }).saturationCurrentPicoA;
    const two = calculateDiodeSaturationCurrent({
      forwardCurrentMa: 1,
      forwardVoltageV: 0.12,
      idealityFactor: 2,
      temperatureK: 300,
    }).saturationCurrentPicoA;
    expect(two / one).toBeCloseTo(Math.exp(0.12 / (2 * vt)), 9);
  });

  it("rejects non-positive bias points through execution", () => {
    for (const bad of [{ forwardCurrentMa: 0, forwardVoltageV: 0.65 }, { forwardCurrentMa: 1, forwardVoltageV: -1 }])
      expect(runDiodeSaturationCurrent(bad as never).ok).toBe(false);
  });
});
