import { describe, expect, it } from "vitest";
import {
  auditCommitteeExpertExample,
  evaluateAuditCommitteeExpert,
  runAuditCommitteeExpert,
} from "./tool.js";

describe("audit committee financial expert criteria", () => {
  it("reproduces its canonical example", () => {
    expect(runAuditCommitteeExpert(auditCommitteeExpertExample.input)).toEqual({
      ok: true,
      output: auditCommitteeExpertExample.output,
    });
  });

  it("classifies a member meeting all supplied criteria", () => {
    expect(
      evaluateAuditCommitteeExpert({
        accountingOrAuditExperience: true,
        auditCommitteeUnderstanding: true,
        financialReportingOversight: true,
        governanceExperience: true,
        internalControlExperience: true,
      }).financialExpert,
    ).toBe(true);
  });

  it("lists every unmet criterion", () => {
    expect(
      evaluateAuditCommitteeExpert({
        accountingOrAuditExperience: false,
        auditCommitteeUnderstanding: false,
        financialReportingOversight: true,
        governanceExperience: false,
        internalControlExperience: true,
      }).unmetCriteria,
    ).toEqual([
      "accounting or audit experience",
      "audit committee understanding",
      "governance experience",
    ]);
  });

  it("rejects a malformed criterion flag", () => {
    expect(
      runAuditCommitteeExpert({
        accountingOrAuditExperience: 1,
        auditCommitteeUnderstanding: true,
        financialReportingOversight: true,
        governanceExperience: true,
        internalControlExperience: true,
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "invalid_field", field: "accountingOrAuditExperience" },
        ],
      },
      ok: false,
    });
  });
});
