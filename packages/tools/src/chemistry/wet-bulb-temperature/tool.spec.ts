import { describe, expect, it } from "vitest";
import { runWetBulbTemperature } from "./tool.js";
describe("Wet Bulb Approximation", () => {
  it("calculates a valid result", () =>
    expect(
      runWetBulbTemperature({
        relativeHumidityPercent: 70,
        temperatureC: 30,
      }),
    ).toEqual({
      ok: true,
      output: { wetBulbCelsius: 25.59566236334207 },
    }));
  it("rejects invalid input", () =>
    expect(
      runWetBulbTemperature({
        relativeHumidityPercent: 150,
        temperatureC: 30,
      }).ok,
    ).toBe(false));
});
