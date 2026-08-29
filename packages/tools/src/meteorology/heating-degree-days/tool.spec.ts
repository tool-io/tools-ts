import { describe, expect, it } from "vitest";
import { heatingDegreeDaysExample, runHeatingDegreeDays } from "./tool.js";

describe("heating degree days calculator", () => {
  it("reproduces the NWS 29°F mean example", () => {
    expect(runHeatingDegreeDays(heatingDegreeDaysExample.input)).toEqual({
      ok: true,
      output: heatingDegreeDaysExample.output,
    });
  });

  it("accumulates only means below the chosen base", () => {
    expect(
      runHeatingDegreeDays({
        baseTemperature: 18,
        dailyHighTemperatures: [12, 22],
        dailyLowTemperatures: [8, 18],
        temperatureUnit: "C",
      }),
    ).toMatchObject({ ok: true, output: { degreeDays: 8 } });
  });

  it("rejects mismatched daily lists", () => {
    const result = runHeatingDegreeDays({
      baseTemperature: 18,
      dailyHighTemperatures: [12, 10],
      dailyLowTemperatures: [8],
      temperatureUnit: "C",
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "temperature_lists_mismatch",
        field: "dailyLowTemperatures",
      });
  });
});
