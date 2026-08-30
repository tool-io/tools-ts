import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SignificantRiskFraudInput = {
  readonly financialStatementMisstatementRisk: boolean;
  readonly managementPressure: boolean;
  readonly minimumFactors: number;
  readonly opportunity: boolean;
  readonly rationalization: boolean;
};

export type SignificantRiskFraudOutput = {
  readonly factorCount: number;
  readonly significantRisk: boolean;
};

export const flagSignificantRiskFraudFactors = (
  input: SignificantRiskFraudInput,
): SignificantRiskFraudOutput => {
  for (const field of [
    "financialStatementMisstatementRisk",
    "managementPressure",
    "opportunity",
    "rationalization",
  ] as const)
    if (typeof input[field] !== "boolean")
      simpleError(
        field,
        `${field} must be a boolean.`,
        "boolean_field_required",
      );
  if (
    !Number.isSafeInteger(input.minimumFactors) ||
    input.minimumFactors < 1 ||
    input.minimumFactors > 3
  )
    simpleError(
      "minimumFactors",
      "The factor threshold must be a whole number from 1 through 3.",
      "invalid_factor_threshold",
    );
  const factorCount =
    Number(input.managementPressure) +
    Number(input.opportunity) +
    Number(input.rationalization);
  return {
    factorCount,
    significantRisk:
      input.financialStatementMisstatementRisk &&
      factorCount >= input.minimumFactors,
  };
};

export const significantRiskFraudExample = {
  input: {
    financialStatementMisstatementRisk: true,
    managementPressure: true,
    minimumFactors: 2,
    opportunity: true,
    rationalization: false,
  },
  output: { factorCount: 2, significantRisk: true },
} satisfies ToolExample<SignificantRiskFraudInput, SignificantRiskFraudOutput>;

export const significantRiskFraudTool = createSimpleTool({
  calculate: (input) =>
    flagSignificantRiskFraudFactors({
      financialStatementMisstatementRisk:
        input.financialStatementMisstatementRisk as boolean,
      managementPressure: input.managementPressure as boolean,
      minimumFactors: input.minimumFactors as number,
      opportunity: input.opportunity as boolean,
      rationalization: input.rationalization as boolean,
    }),
  description:
    "Identify a significant-risk fraud screen only when a financial-statement misstatement risk and at least the selected number of pressure, opportunity, or rationalization factors are present.",
  id: "auditing/significant-risk-fraud-factor-flag-checker",
  inputs: [
    {
      id: "financialStatementMisstatementRisk",
      kind: "boolean",
      label: "Financial-statement misstatement risk",
    },
    {
      id: "managementPressure",
      kind: "boolean",
      label: "Management pressure",
    },
    {
      id: "minimumFactors",
      kind: "integer",
      label: "Minimum fraud factors",
      maximum: 3,
      minimum: 1,
    },
    { id: "opportunity", kind: "boolean", label: "Opportunity" },
    { id: "rationalization", kind: "boolean", label: "Rationalization" },
  ],
  outputs: [
    { id: "factorCount", kind: "integer", label: "Fraud factors", minimum: 0 },
    {
      id: "significantRisk",
      kind: "boolean",
      label: "Significant-risk screen met",
    },
  ],
  title: "Significant Risk Fraud Factor Flag Checker",
});

export const runSignificantRiskFraud = significantRiskFraudTool.execute;
export default significantRiskFraudTool;
