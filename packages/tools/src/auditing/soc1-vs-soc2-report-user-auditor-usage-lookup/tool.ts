import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SocReportUsageInput = {
  readonly financialReportingReliabilityPrimary: boolean;
  readonly periodLengthMonths: number;
  readonly reportType: "soc1" | "soc2";
  readonly securityAvailabilityPrimary: boolean;
};

export type SocReportUsageOutput = {
  readonly rationale:
    "financial_reporting" | "no_primary_objective" | "security_availability";
  readonly recommendation: "requires_evaluation" | "soc1" | "soc2";
  readonly reportTypeMatchesRecommendation: boolean;
};

export const selectSocReportUsage = (
  input: SocReportUsageInput,
): SocReportUsageOutput => {
  if (!["soc1", "soc2"].includes(input.reportType))
    simpleError(
      "reportType",
      "SOC report type is invalid.",
      "invalid_report_type",
    );
  for (const field of [
    "financialReportingReliabilityPrimary",
    "securityAvailabilityPrimary",
  ] as const)
    if (typeof input[field] !== "boolean")
      simpleError(
        field,
        `${field} must be a boolean.`,
        "boolean_field_required",
      );
  if (
    !Number.isSafeInteger(input.periodLengthMonths) ||
    input.periodLengthMonths < 1
  )
    simpleError(
      "periodLengthMonths",
      "Period length must be a positive whole number of months.",
      "invalid_period_length",
    );
  const recommendation =
    input.securityAvailabilityPrimary &&
    !input.financialReportingReliabilityPrimary
      ? "soc1"
      : input.financialReportingReliabilityPrimary &&
          !input.securityAvailabilityPrimary
        ? "soc2"
        : "requires_evaluation";
  return {
    rationale:
      recommendation === "soc1"
        ? "security_availability"
        : recommendation === "soc2"
          ? "financial_reporting"
          : "no_primary_objective",
    recommendation,
    reportTypeMatchesRecommendation:
      recommendation !== "requires_evaluation" &&
      recommendation === input.reportType,
  };
};

export const socReportUsageExample = {
  input: {
    financialReportingReliabilityPrimary: false,
    periodLengthMonths: 12,
    reportType: "soc1",
    securityAvailabilityPrimary: true,
  },
  output: {
    rationale: "security_availability",
    recommendation: "soc1",
    reportTypeMatchesRecommendation: true,
  },
} satisfies ToolExample<SocReportUsageInput, SocReportUsageOutput>;

export const socReportUsageTool = createSimpleTool({
  calculate: (input) =>
    selectSocReportUsage({
      financialReportingReliabilityPrimary:
        input.financialReportingReliabilityPrimary as boolean,
      periodLengthMonths: input.periodLengthMonths as number,
      reportType: input.reportType as SocReportUsageInput["reportType"],
      securityAvailabilityPrimary: input.securityAvailabilityPrimary as boolean,
    }),
  description:
    "Route a supplied SOC report type and primary objective to a narrow SOC 1, SOC 2, or further-evaluation category for professional selection.",
  id: "auditing/soc1-vs-soc2-report-user-auditor-usage-lookup",
  inputs: [
    {
      id: "financialReportingReliabilityPrimary",
      kind: "boolean",
      label: "Financial reporting reliability primary",
    },
    {
      description: "Length of the system-description period in whole months.",
      id: "periodLengthMonths",
      kind: "integer",
      label: "Period length months",
      minimum: 1,
    },
    {
      enum: ["soc1", "soc2"],
      id: "reportType",
      kind: "string",
      label: "SOC report type",
    },
    {
      id: "securityAvailabilityPrimary",
      kind: "boolean",
      label: "Security availability primary",
    },
  ],
  outputs: [
    {
      enum: [
        "financial_reporting",
        "no_primary_objective",
        "security_availability",
      ],
      id: "rationale",
      kind: "string",
      label: "Usage rationale",
    },
    {
      enum: ["requires_evaluation", "soc1", "soc2"],
      id: "recommendation",
      kind: "string",
      label: "Report recommendation",
    },
    {
      id: "reportTypeMatchesRecommendation",
      kind: "boolean",
      label: "Report type matches",
    },
  ],
  title: "SOC 1 vs SOC 2 Report User Auditor Usage Lookup",
});

export const runSocReportUsage = socReportUsageTool.execute;
export default socReportUsageTool;
