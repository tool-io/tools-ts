import { describe, expect, it } from "vitest";
import {
  classifySox404Scope,
  runSox404Scope,
  sox404ScopeExample,
} from "./tool.js";

describe("SOX 404 integrated audit scope lookup", () => {
  it("reproduces its canonical example", () => {
    expect(runSox404Scope(sox404ScopeExample.input)).toEqual({
      ok: true,
      output: sox404ScopeExample.output,
    });
  });

  it("classifies management-only supplied scope", () => {
    expect(
      classifySox404Scope({
        auditorAttestationRequired: false,
        financialReportingRisk: true,
        integratedAudit: false,
        managementAssessmentRequired: true,
        materialWeaknessIdentified: false,
      }).scope,
    ).toBe("management_only");
  });

  it("sends no supplied requirements to further evaluation", () => {
    expect(
      classifySox404Scope({
        auditorAttestationRequired: false,
        financialReportingRisk: true,
        integratedAudit: false,
        managementAssessmentRequired: false,
        materialWeaknessIdentified: false,
      }).scope,
    ).toBe("further_evaluation");
  });

  it("rejects a malformed scope fact", () => {
    expect(
      runSox404Scope({
        auditorAttestationRequired: 1,
        financialReportingRisk: true,
        integratedAudit: true,
        managementAssessmentRequired: true,
        materialWeaknessIdentified: true,
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "invalid_field", field: "auditorAttestationRequired" },
        ],
      },
      ok: false,
    });
  });
});
