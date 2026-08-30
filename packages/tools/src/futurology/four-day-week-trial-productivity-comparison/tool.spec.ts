import { describe, expect, it } from "vitest";
import {
  compareFourDayWeekTrialFindings,
  fourDayWeekFindingsExample,
  runFourDayWeekFindings,
} from "./tool.js";

describe("four-day-week trial productivity comparison", () => {
  it("reproduces its canonical example", () => {
    expect(runFourDayWeekFindings(fourDayWeekFindingsExample.input)).toEqual({
      ok: true,
      output: fourDayWeekFindingsExample.output,
    });
  });

  it("reports an output-per-hour improvement", () => {
    expect(
      compareFourDayWeekTrialFindings({
        baselineOutputIndex: 100,
        baselineWeeklyHours: 40,
        trialOutputIndex: 100,
        trialWeeklyHours: 32,
      }).hoursPerOutputChangePercent,
    ).toBe(25);
  });

  it("reports zero output-per-hour change for proportional reductions", () => {
    expect(
      compareFourDayWeekTrialFindings({
        baselineOutputIndex: 100,
        baselineWeeklyHours: 40,
        trialOutputIndex: 80,
        trialWeeklyHours: 32,
      }).hoursPerOutputChangePercent,
    ).toBe(0);
  });

  it("rejects a nonpositive baseline output", () => {
    expect(
      runFourDayWeekFindings({
        baselineOutputIndex: 0,
        baselineWeeklyHours: 40,
        trialOutputIndex: 80,
        trialWeeklyHours: 32,
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "finding_value_required", field: "baselineOutputIndex" },
        ],
      },
      ok: false,
    });
  });
});
