import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CostToCostPercentCompleteInput = {
  readonly contractPrice: number;
  readonly costIncurredToDate: number;
  readonly estimatedCostToComplete: number;
};

export type CostToCostPercentCompleteOutput = {
  readonly completionFraction: number;
  readonly estimatedTotalCost: number;
  readonly revenueRecognizedToDate: number;
};

export const computeCostToCostPercentComplete = (
  input: CostToCostPercentCompleteInput,
): CostToCostPercentCompleteOutput => {
  if (!Number.isFinite(input.contractPrice) || input.contractPrice < 0)
    simpleError(
      "contractPrice",
      "The contract price must be a finite non-negative number.",
      "invalid_contract_price",
    );
  if (
    !Number.isFinite(input.costIncurredToDate) ||
    input.costIncurredToDate < 0
  )
    simpleError(
      "costIncurredToDate",
      "Cost incurred to date must be a finite non-negative number.",
      "invalid_cost_incurred",
    );
  if (
    !Number.isFinite(input.estimatedCostToComplete) ||
    input.estimatedCostToComplete < 0
  )
    simpleError(
      "estimatedCostToComplete",
      "Estimated cost to complete must be a finite non-negative number.",
      "invalid_estimated_cost_to_complete",
    );
  const estimatedTotalCost =
    input.costIncurredToDate + input.estimatedCostToComplete;
  if (!Number.isFinite(estimatedTotalCost))
    simpleError(
      "estimatedCostToComplete",
      "The combined estimated cost is outside the representable numeric range.",
      "result_not_finite",
    );
  if (!(estimatedTotalCost > 0))
    simpleError(
      "",
      "Estimated total cost is zero, so percent complete is undefined.",
      "zero_estimated_total_cost",
    );
  const completionFraction = input.costIncurredToDate / estimatedTotalCost;
  const revenueRecognizedToDate = input.contractPrice * completionFraction;
  if (!Number.isFinite(revenueRecognizedToDate))
    simpleError(
      "contractPrice",
      "Revenue recognized to date is outside the representable numeric range.",
      "result_not_finite",
    );
  return {
    completionFraction: completionFraction === 0 ? 0 : completionFraction,
    estimatedTotalCost,
    revenueRecognizedToDate:
      revenueRecognizedToDate === 0 ? 0 : revenueRecognizedToDate,
  };
};

export const costToCostPercentCompleteExample = {
  input: {
    contractPrice: 1_000_000,
    costIncurredToDate: 400_000,
    estimatedCostToComplete: 600_000,
  },
  output: {
    completionFraction: 0.4,
    estimatedTotalCost: 1_000_000,
    revenueRecognizedToDate: 400_000,
  },
} satisfies ToolExample<
  CostToCostPercentCompleteInput,
  CostToCostPercentCompleteOutput
>;

export const costToCostPercentCompleteTool = createSimpleTool({
  calculate: (input) =>
    computeCostToCostPercentComplete({
      contractPrice: input.contractPrice as number,
      costIncurredToDate: input.costIncurredToDate as number,
      estimatedCostToComplete: input.estimatedCostToComplete as number,
    }),
  description:
    "Recompute construction percent complete and cumulative revenue from costs incurred to date, estimated cost to complete, and contract price using the cost-to-cost method.",
  id: "auditing/construction-percent-complete-cost-to-cost-independent-recompute",
  inputs: [
    {
      description: "Total agreed contract price.",
      id: "contractPrice",
      kind: "number",
      label: "Contract price",
      minimum: 0,
    },
    {
      description: "Costs incurred on the contract through the reporting date.",
      id: "costIncurredToDate",
      kind: "number",
      label: "Cost incurred to date",
      minimum: 0,
    },
    {
      description:
        "Estimated remaining cost to finish the contract at the reporting date.",
      id: "estimatedCostToComplete",
      kind: "number",
      label: "Estimated cost to complete",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Cost incurred to date plus estimated cost to complete.",
      id: "estimatedTotalCost",
      kind: "number",
      label: "Estimated total cost",
    },
    {
      description:
        "Fraction of estimated total cost incurred so far, from 0 through 1.",
      id: "completionFraction",
      kind: "number",
      label: "Completion fraction",
      minimum: 0,
      maximum: 1,
    },
    {
      description:
        "Contract price times the completion fraction, the cumulative revenue to date.",
      id: "revenueRecognizedToDate",
      kind: "number",
      label: "Revenue recognized to date",
    },
  ],
  title: "Construction Percent Complete Cost-to-Cost Recompute",
});

export const runCostToCostPercentComplete =
  costToCostPercentCompleteTool.execute;
export default costToCostPercentCompleteTool;
