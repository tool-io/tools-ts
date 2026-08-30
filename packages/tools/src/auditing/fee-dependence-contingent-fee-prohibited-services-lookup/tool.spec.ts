import { describe, expect, it } from "vitest";
import {
  assessFeeDependenceRisk,
  feeDependenceExample,
  runFeeDependence,
} from "./tool.js";

describe("fee dependence independence risk", () => {
  it("reproduces its canonical example", () => {
    expect(runFeeDependence(feeDependenceExample.input)).toEqual({
      ok: true,
      output: feeDependenceExample.output,
    });
  });

  it("classifies contingent fees as high risk", () => {
    expect(
      assessFeeDependenceRisk({
        contingentFee: true,
        elevatedFeeThresholdPercent: 15,
        feePercentOfRevenue: 1,
        nonAuditServices: [],
        outOfScopeServices: [],
      }).independenceRisk,
    ).toBe("high");
  });

  it("flags a fee exactly at the elevated threshold", () => {
    expect(
      assessFeeDependenceRisk({
        contingentFee: false,
        elevatedFeeThresholdPercent: 15,
        feePercentOfRevenue: 15,
        nonAuditServices: [],
        outOfScopeServices: [],
      }).riskFactors,
    ).toEqual(["fee_dependence_threshold"]);
  });

  it("rejects a negative fee percentage", () => {
    expect(
      runFeeDependence({
        contingentFee: false,
        elevatedFeeThresholdPercent: 15,
        feePercentOfRevenue: -1,
        nonAuditServices: [],
        outOfScopeServices: [],
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "feePercentOfRevenue" }],
      },
      ok: false,
    });
  });
});
