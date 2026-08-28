import { describe, expect, it } from "vitest";
import { runPolarographyHalfWavePotential } from "./tool.js";
describe("Half-Wave Potential", () => {
  it("calculates a valid result", () =>
    expect(
      runPolarographyHalfWavePotential({
        electronCountInt: 1,
        limitingCurrentMA: 2,
        measuredPotentialVolts: -0.5,
        sampleCurrentMA: 1,
      }),
    ).toEqual({
      ok: true,
      output: { halfWavePotentialVolts: -0.5 },
    }));
  it("rejects invalid input", () =>
    expect(
      runPolarographyHalfWavePotential({
        electronCountInt: 1,
        limitingCurrentMA: 1,
        measuredPotentialVolts: -0.5,
        sampleCurrentMA: 1,
      }).ok,
    ).toBe(false));
});
