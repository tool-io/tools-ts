import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ContingencyConsistencyInput = {
  readonly highEstimate: number;
  readonly lowEstimate: number;
  readonly policyMinimum: number;
  readonly recordedAmount: number;
  readonly requiresPolicyMinimum: boolean;
};

export type ContingencyConsistencyOutput = {
  readonly estimateRange: number;
  readonly meetsPolicyMinimum: boolean;
  readonly recordedAmount: number;
  readonly withinEstimateRange: boolean;
};

export const checkContingencyAccrualConsistency = (
  input: ContingencyConsistencyInput,
): ContingencyConsistencyOutput => {
  for (const [field, value] of [
    ["highEstimate", input.highEstimate],
    ["lowEstimate", input.lowEstimate],
    ["policyMinimum", input.policyMinimum],
    ["recordedAmount", input.recordedAmount],
  ] as const)
    if (!Number.isFinite(value) || value < 0)
      simpleError(
        field,
        `${field} must be finite and nonnegative.`,
        "invalid_accrual_value",
      );
  if (input.lowEstimate > input.highEstimate)
    simpleError(
      "highEstimate",
      "High estimate must not be below low estimate.",
      "invalid_estimate_range",
    );
  if (typeof input.requiresPolicyMinimum !== "boolean")
    simpleError(
      "requiresPolicyMinimum",
      "Policy applicability must be a boolean.",
      "boolean_field_required",
    );
  return {
    estimateRange: input.highEstimate - input.lowEstimate,
    meetsPolicyMinimum:
      !input.requiresPolicyMinimum ||
      input.recordedAmount >= input.policyMinimum,
    recordedAmount: input.recordedAmount,
    withinEstimateRange:
      input.recordedAmount >= input.lowEstimate &&
      input.recordedAmount <= input.highEstimate,
  };
};

export const contingencyConsistencyExample = {
  input: {
    highEstimate: 500_000,
    lowEstimate: 300_000,
    policyMinimum: 400_000,
    recordedAmount: 350_000,
    requiresPolicyMinimum: true,
  },
  output: {
    estimateRange: 200_000,
    meetsPolicyMinimum: false,
    recordedAmount: 350_000,
    withinEstimateRange: true,
  },
} satisfies ToolExample<
  ContingencyConsistencyInput,
  ContingencyConsistencyOutput
>;

export const contingencyConsistencyTool = createSimpleTool({
  calculate: (input) =>
    checkContingencyAccrualConsistency({
      highEstimate: input.highEstimate as number,
      lowEstimate: input.lowEstimate as number,
      policyMinimum: input.policyMinimum as number,
      recordedAmount: input.recordedAmount as number,
      requiresPolicyMinimum: input.requiresPolicyMinimum as boolean,
    }),
  description:
    "Check a recorded contingency accrual against a supplied estimate range and an explicitly applicable policy minimum.",
  id: "auditing/contingency-range-accrual-policy-consistency-checker",
  inputs: [
    { id: "highEstimate", kind: "number", label: "High estimate", minimum: 0 },
    { id: "lowEstimate", kind: "number", label: "Low estimate", minimum: 0 },
    {
      id: "policyMinimum",
      kind: "number",
      label: "Policy minimum",
      minimum: 0,
    },
    {
      id: "recordedAmount",
      kind: "number",
      label: "Recorded accrual",
      minimum: 0,
    },
    {
      id: "requiresPolicyMinimum",
      kind: "boolean",
      label: "Policy minimum applies",
    },
  ],
  outputs: [
    {
      id: "estimateRange",
      kind: "number",
      label: "Estimate range",
      minimum: 0,
    },
    {
      id: "meetsPolicyMinimum",
      kind: "boolean",
      label: "Meets policy minimum",
    },
    {
      id: "recordedAmount",
      kind: "number",
      label: "Recorded accrual",
      minimum: 0,
    },
    {
      id: "withinEstimateRange",
      kind: "boolean",
      label: "Within estimate range",
    },
  ],
  title: "Contingency Range Accrual Policy Consistency Checker",
});

export const runContingencyConsistency = contingencyConsistencyTool.execute;
export default contingencyConsistencyTool;
