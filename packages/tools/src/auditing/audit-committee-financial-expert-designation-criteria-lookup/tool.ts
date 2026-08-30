import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AuditCommitteeExpertInput = {
  readonly accountingOrAuditExperience: boolean;
  readonly auditCommitteeUnderstanding: boolean;
  readonly financialReportingOversight: boolean;
  readonly governanceExperience: boolean;
  readonly internalControlExperience: boolean;
};

export type AuditCommitteeExpertOutput = {
  readonly criteriaMet: number;
  readonly financialExpert: boolean;
  readonly unmetCriteria: ReadonlyArray<string>;
};

export const evaluateAuditCommitteeExpert = (
  input: AuditCommitteeExpertInput,
): AuditCommitteeExpertOutput => {
  const criteria: readonly (readonly [string, boolean])[] = [
    ["accounting or audit experience", input.accountingOrAuditExperience],
    ["financial reporting oversight", input.financialReportingOversight],
    ["internal control experience", input.internalControlExperience],
    ["audit committee understanding", input.auditCommitteeUnderstanding],
    ["governance experience", input.governanceExperience],
  ];
  for (const [criterion, met] of criteria)
    if (typeof met !== "boolean")
      simpleError(
        criterion.replaceAll(" ", ""),
        `${criterion} must be a boolean.`,
        "boolean_field_required",
      );
  const unmetCriteria = criteria
    .filter(([, met]) => !met)
    .map(([criterion]) => criterion);
  return {
    criteriaMet: criteria.length - unmetCriteria.length,
    financialExpert: unmetCriteria.length === 0,
    unmetCriteria,
  };
};

export const auditCommitteeExpertExample = {
  input: {
    accountingOrAuditExperience: true,
    auditCommitteeUnderstanding: true,
    financialReportingOversight: true,
    governanceExperience: false,
    internalControlExperience: true,
  },
  output: {
    criteriaMet: 4,
    financialExpert: false,
    unmetCriteria: ["governance experience"],
  },
} satisfies ToolExample<AuditCommitteeExpertInput, AuditCommitteeExpertOutput>;

export const auditCommitteeExpertTool = createSimpleTool({
  calculate: (input) =>
    evaluateAuditCommitteeExpert({
      accountingOrAuditExperience: input.accountingOrAuditExperience as boolean,
      auditCommitteeUnderstanding: input.auditCommitteeUnderstanding as boolean,
      financialReportingOversight: input.financialReportingOversight as boolean,
      governanceExperience: input.governanceExperience as boolean,
      internalControlExperience: input.internalControlExperience as boolean,
    }),
  description:
    "Evaluate five caller-supplied experience and understanding criteria and report unmet criteria without making an independence determination.",
  id: "auditing/audit-committee-financial-expert-designation-criteria-lookup",
  inputs: [
    {
      id: "accountingOrAuditExperience",
      kind: "boolean",
      label: "Accounting or audit experience",
    },
    {
      id: "auditCommitteeUnderstanding",
      kind: "boolean",
      label: "Audit committee understanding",
    },
    {
      id: "financialReportingOversight",
      kind: "boolean",
      label: "Financial reporting oversight",
    },
    {
      id: "governanceExperience",
      kind: "boolean",
      label: "Governance experience",
    },
    {
      id: "internalControlExperience",
      kind: "boolean",
      label: "Internal control experience",
    },
  ],
  outputs: [
    {
      id: "criteriaMet",
      kind: "integer",
      label: "Criteria met",
      minimum: 0,
    },
    { id: "financialExpert", kind: "boolean", label: "Financial expert" },
    { id: "unmetCriteria", kind: "stringList", label: "Unmet criteria" },
  ],
  title: "Audit Committee Financial Expert Designation Criteria Lookup",
});

export const runAuditCommitteeExpert = auditCommitteeExpertTool.execute;
export default auditCommitteeExpertTool;
