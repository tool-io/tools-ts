import { describe, expect, it } from "vitest";
import {
  calculateSolarWatchDarkRuntime,
  runSolarDarkRuntime,
  solarDarkRuntimeExample,
} from "./tool.js";

describe("solar watch dark-runtime calculator", () => {
  it("reproduces the canonical 180-day capacity example", () => {
    expect(runSolarDarkRuntime(solarDarkRuntimeExample.input)).toEqual({
      ok: true,
      output: solarDarkRuntimeExample.output,
    });
  });

  it("scales runtime directly with stored energy", () => {
    expect(
      calculateSolarWatchDarkRuntime({
        usableStoredEnergyMilliampHours: 100,
        averageDailyConsumptionMilliampHours: 2,
      }).modeledDarkRuntimeDays,
    ).toBe(50);
  });

  it("converts days using a mean Gregorian month", () => {
    expect(
      calculateSolarWatchDarkRuntime({
        usableStoredEnergyMilliampHours: 30.4375,
        averageDailyConsumptionMilliampHours: 1,
      }).modeledDarkRuntimeMonths,
    ).toBe(1);
  });

  it("rejects zero daily consumption", () => {
    expect(
      runSolarDarkRuntime({
        usableStoredEnergyMilliampHours: 100,
        averageDailyConsumptionMilliampHours: 0,
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "daily_consumption_invalid",
            field: "averageDailyConsumptionMilliampHours",
          },
        ],
      },
      ok: false,
    });
  });

  it("rejects zero stored energy", () => {
    expect(
      runSolarDarkRuntime({
        usableStoredEnergyMilliampHours: 0,
        averageDailyConsumptionMilliampHours: 1,
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "stored_energy_invalid",
            field: "usableStoredEnergyMilliampHours",
          },
        ],
      },
      ok: false,
    });
  });
});
