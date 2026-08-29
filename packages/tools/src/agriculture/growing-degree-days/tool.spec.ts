import { describe, expect, it } from "vitest";
import { growingDegreeDaysExample, runGrowingDegreeDays } from "./tool.js";

describe("growing degree days calculator", () => {
  it("reproduces its clipped-temperature example", () => {
    expect(runGrowingDegreeDays(growingDegreeDaysExample.input)).toEqual({
      ok: true,
      output: growingDegreeDaysExample.output,
    });
  });

  it("clips a hot day at the upper threshold", () => {
    expect(
      runGrowingDegreeDays({
        baseTemperature: 50,
        dailyHighTemperatures: [100],
        dailyLowTemperatures: [90],
        temperatureUnit: "F",
        upperTemperature: 86,
      }),
    ).toMatchObject({ ok: true, output: { degreeDays: 36 } });
  });

  it("rejects reversed thresholds", () => {
    const result = runGrowingDegreeDays({
      baseTemperature: 50,
      dailyHighTemperatures: [80],
      dailyLowTemperatures: [60],
      temperatureUnit: "F",
      upperTemperature: 50,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "threshold_order_invalid",
        field: "upperTemperature",
      });
  });
});
