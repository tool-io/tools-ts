import { describe, expect, it } from "vitest";
import { runMostProbableSpeed } from "./tool.js";
describe("Most Probable Speed", () => {
  it("calculates a valid result", () =>
    expect(
      runMostProbableSpeed({ molarMassKgPerMol: 0.032, temperatureK: 300 }),
    ).toEqual({
      ok: true,
      output: { mostProbableSpeedMetersPerSecond: 394.836895549922 },
    }));
  it("rejects invalid input", () =>
    expect(
      runMostProbableSpeed({ molarMassKgPerMol: 0.032, temperatureK: 0 }).ok,
    ).toBe(false));
});
