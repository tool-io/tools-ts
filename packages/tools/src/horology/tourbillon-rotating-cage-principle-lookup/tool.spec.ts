import { describe, expect, it } from "vitest";
import {
  lookupTourbillonRotatingCagePrinciple,
  runTourbillonCage,
  tourbillonCageExample,
} from "./tool.js";

describe("tourbillon rotating-cage principle lookup", () => {
  it("reproduces the canonical one-minute cage", () => {
    expect(runTourbillonCage(tourbillonCageExample.input)).toEqual({
      ok: true,
      output: tourbillonCageExample.output,
    });
  });

  it("independently calculates a 30-second cage", () => {
    expect(
      lookupTourbillonRotatingCagePrinciple({ cagePeriodSeconds: 30 }),
    ).toMatchObject({
      cageAngularRateDegreesPerSecond: 12,
      cageRevolutionsPerDay: 2880,
      classicOneMinuteCage: false,
    });
  });

  it("does not promise a specific accuracy improvement", () => {
    expect(
      lookupTourbillonRotatingCagePrinciple({ cagePeriodSeconds: 60 })
        .principle,
    ).toContain("does not guarantee");
  });

  it("rejects a zero cage period", () => {
    expect(runTourbillonCage({ cagePeriodSeconds: 0 })).toMatchObject({
      error: {
        issues: [{ code: "cage_period_invalid", field: "cagePeriodSeconds" }],
      },
      ok: false,
    });
  });
});
