import { describe, expect, it } from "vitest";
import { runNmrChemicalShiftPpm } from "./tool.js";
describe("Chemical Shift ppm", () => {
  it("calculates a valid result", () =>
    expect(
      runNmrChemicalShiftPpm({
        sampleFreqHz: 600002000,
        referenceFreqHz: 600000000,
        spectrometerMHz: 600,
      }),
    ).toEqual({
      ok: true,
      output: { chemicalShiftPpm: 3.3333333333333335 },
    }));
  it("rejects invalid input", () =>
    expect(
      runNmrChemicalShiftPpm({
        sampleFreqHz: 600002000,
        referenceFreqHz: 600000000,
        spectrometerMHz: 0,
      }).ok,
    ).toBe(false));
});
