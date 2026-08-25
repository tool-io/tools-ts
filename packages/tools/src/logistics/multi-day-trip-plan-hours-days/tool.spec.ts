import { describe, expect, it } from "vitest";
import {
  multiDayTripPlanHoursDaysExample,
  runMultiDayTripPlanHoursDays,
} from "./tool.js";

describe("multi-day-trip-plan-hours-days", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runMultiDayTripPlanHoursDays(multiDayTripPlanHoursDaysExample.input),
    ).toEqual({
      ok: true,
      output: multiDayTripPlanHoursDaysExample.output,
    });
  });

  it("fits an overnight trip into one day", () => {
    expect(runMultiDayTripPlanHoursDays({ tripMiles: 495 })).toEqual({
      ok: true,
      output: { plannedDrivingDays: 1, totalDriveHours: 9 },
    });
  });

  it("rejects zero planning speed", () => {
    expect(
      runMultiDayTripPlanHoursDays({ planningSpeedMph: 0, tripMiles: 100 }).ok,
    ).toBe(false);
  });
});
