import { describe, expect, it } from "vitest";
import { runRelativeHumidity } from "./tool.js";
describe("Relative Humidity Calculator", () => {
  it("calculates a valid result", () =>
    expect(
      runRelativeHumidity({
        actualVaporPressureHpa: 15,
        saturationVaporPressureHpa: 30,
      }),
    ).toEqual({
      ok: true,
      output: { relativeHumidityPercent: 50 },
    }));
  it("rejects invalid input", () =>
    expect(
      runRelativeHumidity({
        actualVaporPressureHpa: 35,
        saturationVaporPressureHpa: 30,
      }).ok,
    ).toBe(false));
});
