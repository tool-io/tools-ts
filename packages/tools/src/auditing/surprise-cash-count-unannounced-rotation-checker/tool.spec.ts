import { describe, expect, it } from "vitest";
import {
  checkSurpriseCashCount,
  runSurpriseCashCount,
  surpriseCashCountExample,
} from "./tool.js";

describe("surprise cash count checker", () => {
  it("reproduces its canonical example", () => {
    expect(runSurpriseCashCount(surpriseCashCountExample.input)).toEqual({
      ok: true,
      output: surpriseCashCountExample.output,
    });
  });

  it("accepts an unannounced independently selected count", () => {
    expect(
      checkSurpriseCashCount({
        countObservations: 1,
        countTeamIndependent: true,
        locationSelectedByAuditor: true,
        performedOnScheduledDate: false,
        wasAnnounced: false,
      }).validSurpriseCount,
    ).toBe(true);
  });

  it("reports multiple surprise-count violations", () => {
    expect(
      checkSurpriseCashCount({
        countObservations: 1,
        countTeamIndependent: false,
        locationSelectedByAuditor: false,
        performedOnScheduledDate: false,
        wasAnnounced: true,
      }).violations,
    ).toEqual([
      "count_was_announced",
      "location_not_selected_by_auditor",
      "count_team_not_independent",
    ]);
  });

  it("rejects a zero observation count", () => {
    expect(
      runSurpriseCashCount({
        countObservations: 0,
        countTeamIndependent: true,
        locationSelectedByAuditor: true,
        performedOnScheduledDate: false,
        wasAnnounced: false,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "countObservations" }],
      },
      ok: false,
    });
  });
});
