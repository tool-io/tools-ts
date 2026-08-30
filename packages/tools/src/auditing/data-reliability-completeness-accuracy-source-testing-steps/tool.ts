import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DataReliabilityInput = {
  readonly accuracyTested: boolean;
  readonly completenessTested: boolean;
  readonly reconciliationDifference: number;
  readonly sourceIndependent: boolean;
  readonly tolerance: number;
};

export type DataReliabilityOutput = {
  readonly assessment: "conditional" | "reliable" | "unreliable";
  readonly criteriaMet: number;
  readonly criterionCount: number;
  readonly withinTolerance: boolean;
};

export const assessDataReliability = (
  input: DataReliabilityInput,
): DataReliabilityOutput => {
  for (const field of [
    "accuracyTested",
    "completenessTested",
    "sourceIndependent",
  ] as const)
    if (typeof input[field] !== "boolean")
      simpleError(
        field,
        `${field} must be a boolean.`,
        "boolean_field_required",
      );
  if (!Number.isFinite(input.reconciliationDifference))
    simpleError(
      "reconciliationDifference",
      "Reconciliation difference must be finite.",
      "invalid_reconciliation_difference",
    );
  if (!Number.isFinite(input.tolerance) || input.tolerance < 0)
    simpleError(
      "tolerance",
      "Tolerance must be finite and nonnegative.",
      "invalid_tolerance",
    );
  const criteriaMet =
    Number(input.sourceIndependent) +
    Number(input.completenessTested) +
    Number(input.accuracyTested) +
    Number(Math.abs(input.reconciliationDifference) <= input.tolerance);
  return {
    assessment:
      criteriaMet === 4
        ? "reliable"
        : criteriaMet >= 2
          ? "conditional"
          : "unreliable",
    criteriaMet,
    criterionCount: 4,
    withinTolerance:
      Math.abs(input.reconciliationDifference) <= input.tolerance,
  };
};

export const dataReliabilityExample = {
  input: {
    accuracyTested: true,
    completenessTested: true,
    reconciliationDifference: 25,
    sourceIndependent: true,
    tolerance: 50,
  },
  output: {
    assessment: "reliable",
    criteriaMet: 4,
    criterionCount: 4,
    withinTolerance: true,
  },
} satisfies ToolExample<DataReliabilityInput, DataReliabilityOutput>;

export const dataReliabilityTool = createSimpleTool({
  calculate: (input) =>
    assessDataReliability({
      accuracyTested: input.accuracyTested as boolean,
      completenessTested: input.completenessTested as boolean,
      reconciliationDifference: input.reconciliationDifference as number,
      sourceIndependent: input.sourceIndependent as boolean,
      tolerance: input.tolerance as number,
    }),
  description:
    "Assess supplied data-source independence, completeness, accuracy, and reconciliation facts against a tolerance for use in further audit work.",
  id: "auditing/data-reliability-completeness-accuracy-source-testing-steps",
  inputs: [
    { id: "accuracyTested", kind: "boolean", label: "Accuracy tested" },
    { id: "completenessTested", kind: "boolean", label: "Completeness tested" },
    {
      description:
        "Signed difference between the data and an independent source.",
      id: "reconciliationDifference",
      kind: "number",
      label: "Reconciliation difference",
    },
    { id: "sourceIndependent", kind: "boolean", label: "Source independent" },
    { id: "tolerance", kind: "number", label: "Tolerance", minimum: 0 },
  ],
  outputs: [
    {
      enum: ["conditional", "reliable", "unreliable"],
      id: "assessment",
      kind: "string",
      label: "Reliability assessment",
    },
    {
      id: "criteriaMet",
      kind: "integer",
      label: "Criteria met",
      minimum: 0,
    },
    {
      id: "criterionCount",
      kind: "integer",
      label: "Criteria checked",
      minimum: 4,
    },
    { id: "withinTolerance", kind: "boolean", label: "Within tolerance" },
  ],
  title: "Data Reliability Completeness Accuracy Source Testing Steps",
});

export const runDataReliability = dataReliabilityTool.execute;
export default dataReliabilityTool;
