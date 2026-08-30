import { describe, expect, it } from "vitest";
import {
  checkContingencyAccrualConsistency,
  contingencyConsistencyExample,
  runContingencyConsistency,
} from "./tool.js";

describe("contingency range accrual policy consistency", () => {
  it("reproduces its canonical example", () => {
    expect(
      runContingencyConsistency(contingencyConsistencyExample.input),
    ).toEqual({
      ok: true,
      output: contingencyConsistencyExample.output,
    });
  });

  it("ignores policy minimum when it is inapplicable", () => {
    expect(
      checkContingencyAccrualConsistency({
        highEstimate: 500,
        lowEstimate: 300,
        policyMinimum: 400,
        recordedAmount: 350,
        requiresPolicyMinimum: false,
      }).meetsPolicyMinimum,
    ).toBe(true);
  });

  it("flags an accrual above the estimate range", () => {
    expect(
      checkContingencyAccrualConsistency({
        highEstimate: 500,
        lowEstimate: 300,
        policyMinimum: 0,
        recordedAmount: 501,
        requiresPolicyMinimum: false,
      }).withinEstimateRange,
    ).toBe(false);
  });

  it("rejects a reversed estimate range", () => {
    expect(
      runContingencyConsistency({
        highEstimate: 100,
        lowEstimate: 200,
        policyMinimum: 0,
        recordedAmount: 150,
        requiresPolicyMinimum: false,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_estimate_range", field: "highEstimate" }],
      },
      ok: false,
    });
  });
});
