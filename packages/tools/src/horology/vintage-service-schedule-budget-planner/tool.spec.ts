import { describe, expect, it } from "vitest";
import {
  planVintageServiceSchedule,
  runVintageServiceSchedule,
  vintageServiceScheduleExample,
} from "./tool.js";

describe("vintage service schedule and budget planner", () => {
  it("reproduces the canonical one-day-before-six-years example", () => {
    expect(
      runVintageServiceSchedule(vintageServiceScheduleExample.input),
    ).toEqual({
      ok: true,
      output: vintageServiceScheduleExample.output,
    });
  });

  it("marks service due at the caller interval", () => {
    expect(
      planVintageServiceSchedule({
        lastServiceDate: "2020-01-15",
        asOfDate: "2025-01-15",
        callerSpecifiedIntervalYears: 5,
        planningHorizonYears: 5,
        quotedServiceCost: 500,
      }),
    ).toMatchObject({
      ageYears: 5,
      nextServiceDue: true,
      servicesDueWithinHorizon: 2,
      yearsUntilNextService: 0,
    });
  });

  it("excludes a next service beyond the planning horizon", () => {
    expect(
      planVintageServiceSchedule({
        lastServiceDate: "2025-01-01",
        asOfDate: "2025-01-01",
        callerSpecifiedIntervalYears: 5,
        planningHorizonYears: 4,
        quotedServiceCost: 500,
      }).plannedServiceBudget,
    ).toBe(0);
  });

  it("rejects dates in reverse order", () => {
    expect(
      runVintageServiceSchedule({
        lastServiceDate: "2025-01-01",
        asOfDate: "2024-01-01",
        callerSpecifiedIntervalYears: 5,
        planningHorizonYears: 5,
        quotedServiceCost: 500,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "date_order_invalid", field: "asOfDate" }] },
      ok: false,
    });
  });

  it("rejects an invalid calendar date", () => {
    expect(
      runVintageServiceSchedule({
        lastServiceDate: "2025-02-29",
        asOfDate: "2025-03-01",
        callerSpecifiedIntervalYears: 5,
        planningHorizonYears: 5,
        quotedServiceCost: 500,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "date_invalid", field: "lastServiceDate" }] },
      ok: false,
    });
  });
});
