import { describe, expect, it } from "vitest";
import { runBarometricFormula } from "./tool.js";
describe("Barometric Pressure", () => {
  it("calculates a valid result", () =>
    expect(
      runBarometricFormula({ altitudeMeters: 1500, temperatureK: 288.15 }),
    ).toEqual({
      ok: true,
      output: { pressureHpa: 848.1696166679793 },
    }));
  it("rejects invalid input", () =>
    expect(
      runBarometricFormula({ altitudeMeters: 12001, temperatureK: 288.15 }).ok,
    ).toBe(false));
});
