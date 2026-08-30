import { describe, expect, it } from "vitest";
import {
  backcastingMilestoneExample,
  planBackcastingMilestones,
  runBackcastingMilestone,
} from "./tool.js";

describe("backcasting milestone reverse planner", () => {
  it("reproduces its canonical example", () => {
    expect(runBackcastingMilestone(backcastingMilestoneExample.input)).toEqual({
      ok: true,
      output: backcastingMilestoneExample.output,
    });
  });

  it("supports a declining path", () => {
    expect(
      planBackcastingMilestones({
        changePerStep: -10,
        currentValue: 100,
        currentYear: 2026,
        steps: 2,
        targetValue: 80,
        targetYear: 2028,
      }).projectedValues,
    ).toEqual([100, 90, 80]);
  });

  it("reports a target gap", () => {
    expect(
      planBackcastingMilestones({
        changePerStep: 10,
        currentValue: 100,
        currentYear: 2026,
        steps: 2,
        targetValue: 150,
        targetYear: 2028,
      }).gapToTarget,
    ).toBe(30);
  });

  it("rejects a target year before the current year", () => {
    expect(
      runBackcastingMilestone({
        changePerStep: 1,
        currentValue: 1,
        currentYear: 2026,
        steps: 1,
        targetValue: 2,
        targetYear: 2025,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_target_year", field: "targetYear" }] },
      ok: false,
    });
  });
});
