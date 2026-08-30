import { describe, expect, it } from "vitest";
import {
  runSocReportUsage,
  selectSocReportUsage,
  socReportUsageExample,
} from "./tool.js";

describe("SOC 1 versus SOC 2 usage lookup", () => {
  it("reproduces its canonical example", () => {
    expect(runSocReportUsage(socReportUsageExample.input)).toEqual({
      ok: true,
      output: socReportUsageExample.output,
    });
  });

  it("recommends SOC 2 for a sole financial-reporting objective", () => {
    expect(
      selectSocReportUsage({
        financialReportingReliabilityPrimary: true,
        periodLengthMonths: 12,
        reportType: "soc2",
        securityAvailabilityPrimary: false,
      }).recommendation,
    ).toBe("soc2");
  });

  it("requires evaluation for mixed objectives", () => {
    expect(
      selectSocReportUsage({
        financialReportingReliabilityPrimary: true,
        periodLengthMonths: 12,
        reportType: "soc1",
        securityAvailabilityPrimary: true,
      }),
    ).toMatchObject({
      recommendation: "requires_evaluation",
      rationale: "no_primary_objective",
      reportTypeMatchesRecommendation: false,
    });
  });

  it("rejects a zero report period", () => {
    expect(
      runSocReportUsage({
        financialReportingReliabilityPrimary: true,
        periodLengthMonths: 0,
        reportType: "soc2",
        securityAvailabilityPrimary: false,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "periodLengthMonths" }],
      },
      ok: false,
    });
  });
});
