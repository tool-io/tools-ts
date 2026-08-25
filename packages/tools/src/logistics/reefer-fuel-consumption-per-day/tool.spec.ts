import { describe, expect, it } from "vitest";
import {
  reeferFuelConsumptionPerDayExample,
  runReeferFuelConsumptionPerDay,
} from "./tool.js";

describe("reefer-fuel-consumption-per-day", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runReeferFuelConsumptionPerDay(reeferFuelConsumptionPerDayExample.input),
    ).toEqual({
      ok: true,
      output: reeferFuelConsumptionPerDayExample.output,
    });
  });

  it("defaults to one day and full-time operation when omitted", () => {
    const result = runReeferFuelConsumptionPerDay({
      consumptionLitersPerHour: 2,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.litersPerDay as number).toBe(48);
    expect(result.output.totalTripLiters as number).toBe(48);
  });
  it("rejects operating hours above twenty-four", () => {
    expect(
      runReeferFuelConsumptionPerDay({
        consumptionLitersPerHour: 3.2,
        operatingHoursPerDay: 30,
      }).ok,
    ).toBe(false);
  });
});
