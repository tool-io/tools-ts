import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Sox404ScopeInput = {
  readonly auditorAttestationRequired: boolean;
  readonly financialReportingRisk: boolean;
  readonly integratedAudit: boolean;
  readonly managementAssessmentRequired: boolean;
  readonly materialWeaknessIdentified: boolean;
};

export type Sox404ScopeOutput = {
  readonly scope:
    | "auditor_attestation_only"
    | "dual_attestation"
    | "further_evaluation"
    | "integrated_dual_opinion"
    | "management_only"
    | "not_required";
};

export const classifySox404Scope = (
  input: Sox404ScopeInput,
): Sox404ScopeOutput => {
  for (const field of [
    "auditorAttestationRequired",
    "financialReportingRisk",
    "integratedAudit",
    "managementAssessmentRequired",
    "materialWeaknessIdentified",
  ] as const)
    if (typeof input[field] !== "boolean")
      simpleError(
        field,
        `${field} must be a boolean.`,
        "boolean_field_required",
      );
  if (!input.financialReportingRisk) return { scope: "not_required" };
  if (
    input.materialWeaknessIdentified &&
    input.managementAssessmentRequired &&
    input.auditorAttestationRequired &&
    input.integratedAudit
  )
    return { scope: "integrated_dual_opinion" };
  if (input.managementAssessmentRequired && input.auditorAttestationRequired)
    return { scope: "dual_attestation" };
  if (input.managementAssessmentRequired) return { scope: "management_only" };
  if (input.auditorAttestationRequired)
    return { scope: "auditor_attestation_only" };
  return { scope: "further_evaluation" };
};

export const sox404ScopeExample = {
  input: {
    auditorAttestationRequired: true,
    financialReportingRisk: true,
    integratedAudit: true,
    managementAssessmentRequired: true,
    materialWeaknessIdentified: true,
  },
  output: { scope: "integrated_dual_opinion" },
} satisfies ToolExample<Sox404ScopeInput, Sox404ScopeOutput>;

export const sox404ScopeTool = createSimpleTool({
  calculate: (input) =>
    classifySox404Scope({
      auditorAttestationRequired: input.auditorAttestationRequired as boolean,
      financialReportingRisk: input.financialReportingRisk as boolean,
      integratedAudit: input.integratedAudit as boolean,
      managementAssessmentRequired:
        input.managementAssessmentRequired as boolean,
      materialWeaknessIdentified: input.materialWeaknessIdentified as boolean,
    }),
  description:
    "Classify a caller-supplied Section 404 scope using risk, weakness, management-assessment, auditor-attestation, and integrated-audit facts for professional review.",
  id: "auditing/sox-404-integrated-audit-dual-opinion-scope-lookup",
  inputs: [
    {
      id: "auditorAttestationRequired",
      kind: "boolean",
      label: "Auditor attestation required",
    },
    {
      id: "financialReportingRisk",
      kind: "boolean",
      label: "Financial reporting risk",
    },
    { id: "integratedAudit", kind: "boolean", label: "Integrated audit" },
    {
      id: "managementAssessmentRequired",
      kind: "boolean",
      label: "Management assessment required",
    },
    {
      id: "materialWeaknessIdentified",
      kind: "boolean",
      label: "Material weakness identified",
    },
  ],
  outputs: [
    {
      enum: [
        "auditor_attestation_only",
        "dual_attestation",
        "further_evaluation",
        "integrated_dual_opinion",
        "management_only",
        "not_required",
      ],
      id: "scope",
      kind: "string",
      label: "Attestation scope category",
    },
  ],
  title: "SOX 404 Integrated Audit Dual Opinion Scope Lookup",
});

export const runSox404Scope = sox404ScopeTool.execute;
export default sox404ScopeTool;
