import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PercentageOfCompletionInput = {
  readonly contractPrice: number;
  readonly estimatedTotalCosts: number;
  readonly costsIncurredToDate: number;
};

export type PercentageOfCompletionOutput = {
  readonly completionPercent: number;
  readonly revenueToDate: number;
};

export const percentageOfCompletionExample = {
  input: {
    contractPrice: 15000000,
    costsIncurredToDate: 3000000,
    estimatedTotalCosts: 10000000,
  },
  output: { completionPercent: 0.3, revenueToDate: 4500000 },
} satisfies ToolExample<
  PercentageOfCompletionInput,
  PercentageOfCompletionOutput
>;

export const calculatePercentageOfCompletion = (
  input: PercentageOfCompletionInput,
): PercentageOfCompletionOutput => {
  if (
    !Number.isFinite(input.costsIncurredToDate) ||
    input.costsIncurredToDate < 0
  )
    simpleError(
      "costsIncurredToDate",
      "Costs incurred to date must be a finite non-negative number.",
      "invalid_costs_incurred",
    );
  if (
    !Number.isFinite(input.estimatedTotalCosts) ||
    input.estimatedTotalCosts <= 0
  )
    simpleError(
      "estimatedTotalCosts",
      "Estimated total costs must be finite and greater than zero.",
      "positive_total_costs_required",
    );
  if (!Number.isFinite(input.contractPrice) || input.contractPrice < 0)
    simpleError(
      "contractPrice",
      "The contract price must be a finite non-negative number.",
      "invalid_contract_price",
    );
  if (input.costsIncurredToDate > input.estimatedTotalCosts)
    simpleError(
      "estimatedTotalCosts",
      "Estimated total costs must not be less than costs already incurred.",
      "estimated_cost_below_incurred",
    );
  const completionPercent =
    input.costsIncurredToDate / input.estimatedTotalCosts;
  const revenueToDate = completionPercent * input.contractPrice;
  if (!Number.isFinite(revenueToDate))
    simpleError(
      "costsIncurredToDate",
      "The revenue amount is outside the representable numeric range.",
      "result_not_finite",
    );
  return {
    completionPercent: completionPercent === 0 ? 0 : completionPercent,
    revenueToDate: revenueToDate === 0 ? 0 : revenueToDate,
  };
};

export const percentageOfCompletionTool = createSimpleTool({
  calculate: (input) =>
    calculatePercentageOfCompletion({
      contractPrice: input.contractPrice as number,
      costsIncurredToDate: input.costsIncurredToDate as number,
      estimatedTotalCosts: input.estimatedTotalCosts as number,
    }),
  description:
    "Recognize construction revenue to date under the cost-to-cost percentage-of-completion method: costs incurred divided by estimated total costs times the contract price.",
  id: "accounting/percentage-of-completion-revenue-to-date",
  inputs: [
    {
      description: "Total price agreed for the contract.",
      id: "contractPrice",
      kind: "number",
      label: "Contract price",
      minimum: 0,
    },
    {
      description:
        "Direct costs incurred on the contract through the date of measurement.",
      id: "costsIncurredToDate",
      kind: "number",
      label: "Costs incurred to date",
      minimum: 0,
    },
    {
      description:
        "Estimated total cost to complete the entire contract; must be greater than zero.",
      id: "estimatedTotalCosts",
      kind: "number",
      label: "Estimated total costs",
    },
  ],
  outputs: [
    {
      description:
        "Fraction of the contract completed on a cost-to-cost basis, between 0 and 1.",
      id: "completionPercent",
      kind: "number",
      label: "Completion percent",
    },
    {
      description:
        "Cumulative revenue recognized to date under the cost-to-cost method.",
      id: "revenueToDate",
      kind: "number",
      label: "Revenue to date",
    },
  ],
  title: "Percentage of Completion Calculator",
});
export const runPercentageOfCompletion = percentageOfCompletionTool.execute;
export default percentageOfCompletionTool;
