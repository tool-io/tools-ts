import { describe, expect, it } from "vitest";
import { runSpecificHumidity } from "./tool.js";
describe("Specific Humidity Calculator", () => {
  it("calculates a valid result", () =>
    expect(
      runSpecificHumidity({ pressureHpa: 1013.25, vaporPressureHpa: 20 }),
    ).toEqual({
      ok: true,
      output: { specificHumidityGPerKg: 12.369616879953066 },
    }));
  it("rejects invalid input", () =>
    expect(
      runSpecificHumidity({ pressureHpa: 1013.25, vaporPressureHpa: 3000 }).ok,
    ).toBe(false));
});
