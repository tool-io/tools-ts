import { describe, expect, it } from "vitest";
import {
  lookupFreeSprungIndexComparison,
  regulatorComparisonExample,
  runRegulatorComparison,
} from "./tool.js";

describe("free-sprung versus index regulator comparison lookup", () => {
  it("reproduces the canonical inertia-adjustment statement", () => {
    expect(runRegulatorComparison(regulatorComparisonExample.input)).toEqual({
      ok: true,
      output: regulatorComparisonExample.output,
    });
  });

  it("describes index curb-pin adjustment", () => {
    expect(
      lookupFreeSprungIndexComparison({ comparisonFocus: "indexAdjustment" })
        .verifiedStatement,
    ).toContain("effective hairspring length");
  });

  it("describes Grand Seiko's separate isochronism control", () => {
    expect(
      lookupFreeSprungIndexComparison({
        comparisonFocus: "isochronismAdjustment",
      }).verifiedStatement,
    ).toContain("separate stud movement");
  });

  it("avoids an accuracy guarantee from regulator type", () => {
    expect(
      lookupFreeSprungIndexComparison({
        comparisonFocus: "accuracyClaimCaution",
      }).verifiedStatement,
    ).toContain("does not certify");
  });

  it("rejects an unsupported focus at the public boundary", () => {
    expect(runRegulatorComparison({ comparisonFocus: "price" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "comparisonFocus" }] },
      ok: false,
    });
  });
});
