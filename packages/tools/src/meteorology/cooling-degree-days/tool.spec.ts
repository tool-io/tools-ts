import { describe, expect, it } from "vitest";
import { coolingDegreeDaysExample, runCoolingDegreeDays } from "./tool.js";

describe("cooling degree days calculator", () => {
  it("reproduces the NWS 78°F mean example", () => {
    expect(runCoolingDegreeDays(coolingDegreeDaysExample.input)).toEqual({
      ok: true,
      output: coolingDegreeDaysExample.output,
    });
  });

  it("accumulates only means above the chosen base", () => {
    expect(
      runCoolingDegreeDays({
        baseTemperature: 18,
        dailyHighTemperatures: [28, 20],
        dailyLowTemperatures: [18, 10],
        temperatureUnit: "C",
      }),
    ).toMatchObject({ ok: true, output: { degreeDays: 5 } });
  });

  it("rejects a low above its daily high", () => {
    const result = runCoolingDegreeDays({
      baseTemperature: 18,
      dailyHighTemperatures: [20],
      dailyLowTemperatures: [21],
      temperatureUnit: "C",
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "low_above_high",
        field: "dailyLowTemperatures.0",
      });
  });
});
