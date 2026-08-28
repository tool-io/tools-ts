import { describe, expect, it } from "vitest";
import { runRootMeanSquareSpeed } from "./tool.js";
describe("RMS Speed Calculator", () => {
  it("calculates a valid result", () =>
    expect(
      runRootMeanSquareSpeed({ molarMassKgPerMol: 0.032, temperatureK: 300 }),
    ).toEqual({
      ok: true,
      output: { rmsSpeedMetersPerSecond: 483.57446286094347 },
    }));
  it("rejects invalid input", () =>
    expect(
      runRootMeanSquareSpeed({ molarMassKgPerMol: 0.032, temperatureK: 0 }).ok,
    ).toBe(false));
});
