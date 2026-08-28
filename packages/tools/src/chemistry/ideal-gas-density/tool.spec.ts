import { describe, expect, it } from "vitest";
import { runIdealGasDensity } from "./tool.js";
describe("Ideal Gas Density", () => {
  it("calculates a valid result", () =>
    expect(
      runIdealGasDensity({
        molarMassGPerMol: 28.97,
        pressureAtm: 1,
        temperatureK: 273.15,
      }),
    ).toEqual({
      ok: true,
      output: { densityGPL: 1.2924975177564701 },
    }));
  it("rejects invalid input", () =>
    expect(
      runIdealGasDensity({
        molarMassGPerMol: -1,
        pressureAtm: 1,
        temperatureK: 273.15,
      }).ok,
    ).toBe(false));
});
