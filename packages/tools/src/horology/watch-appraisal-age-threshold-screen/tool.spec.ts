import { describe, expect, it } from "vitest";
import {
  runWatchAppraisalAge,
  screenWatchAppraisalAge,
  watchAppraisalAgeExample,
} from "./tool.js";

describe("watch appraisal-age threshold screen", () => {
  it("reproduces the canonical leap-year boundary example", () => {
    expect(runWatchAppraisalAge(watchAppraisalAgeExample.input)).toEqual({
      ok: true,
      output: watchAppraisalAgeExample.output,
    });
  });

  it("accepts an appraisal exactly at the caller limit", () => {
    expect(
      screenWatchAppraisalAge({
        appraisalDate: "2025-01-01",
        asOfDate: "2025-01-31",
        maximumAllowedAgeDays: 30,
      }).withinCallerAgeLimit,
    ).toBe(true);
  });

  it("flags an appraisal one day beyond the limit", () => {
    expect(
      screenWatchAppraisalAge({
        appraisalDate: "2025-01-01",
        asOfDate: "2025-02-01",
        maximumAllowedAgeDays: 30,
      }),
    ).toMatchObject({ daysPastAllowedAge: 1, withinCallerAgeLimit: false });
  });

  it("allows a same-day appraisal under a zero-day policy", () => {
    expect(
      screenWatchAppraisalAge({
        appraisalDate: "2025-01-01",
        asOfDate: "2025-01-01",
        maximumAllowedAgeDays: 0,
      }).withinCallerAgeLimit,
    ).toBe(true);
  });

  it("rejects an as-of date before the appraisal", () => {
    expect(
      runWatchAppraisalAge({
        appraisalDate: "2025-01-02",
        asOfDate: "2025-01-01",
        maximumAllowedAgeDays: 365,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "date_order_invalid", field: "asOfDate" }] },
      ok: false,
    });
  });
});
