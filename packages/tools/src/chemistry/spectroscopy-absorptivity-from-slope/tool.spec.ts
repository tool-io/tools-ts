import { describe, expect, it } from "vitest";
import {
  runSpectroscopyAbsorptivityFromSlope,
  spectroscopyAbsorptivityFromSlopeExample,
} from "./tool.js";
describe("Absorptivity From Slope", () => {
  it("publishes an executable example", () =>
    expect(
      runSpectroscopyAbsorptivityFromSlope(
        spectroscopyAbsorptivityFromSlopeExample.input,
      ),
    ).toEqual({
      ok: true,
      output: spectroscopyAbsorptivityFromSlopeExample.output,
    }));
  it("equals the slope for a one centimeter cell", () =>
    expect(
      runSpectroscopyAbsorptivityFromSlope({
        calibrationSlope: 15000,
        pathLengthCm: 1,
      }),
    ).toEqual({ ok: true, output: { molarAbsorptivity: 15000 } }));
  it("halves absorptivity for a doubled cell", () =>
    expect(
      runSpectroscopyAbsorptivityFromSlope({
        calibrationSlope: 15000,
        pathLengthCm: 4,
      }),
    ).toEqual({ ok: true, output: { molarAbsorptivity: 3750 } }));
  it("matches a typical dye calibration closely", () => {
    const result = runSpectroscopyAbsorptivityFromSlope({
      calibrationSlope: 42000.5,
      pathLengthCm: 2,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.molarAbsorptivity).toBeCloseTo(21000.25, 6);
  });
  it("rejects zero slope", () =>
    expect(
      runSpectroscopyAbsorptivityFromSlope({
        calibrationSlope: 0,
        pathLengthCm: 1,
      }).ok,
    ).toBe(false));
  it("rejects negative slope", () =>
    expect(
      runSpectroscopyAbsorptivityFromSlope({
        calibrationSlope: -6000,
        pathLengthCm: 2,
      }).ok,
    ).toBe(false));
  it("rejects zero path length", () =>
    expect(
      runSpectroscopyAbsorptivityFromSlope({
        calibrationSlope: 6000,
        pathLengthCm: 0,
      }).ok,
    ).toBe(false));
});
