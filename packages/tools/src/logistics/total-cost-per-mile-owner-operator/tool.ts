import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TotalCostPerMileOwnerOperatorInput = {
  readonly fixedCostsUsd: number;
  readonly milesDriven: number;
  readonly variableCostsUsd: number;
};

export type TotalCostPerMileOwnerOperatorOutput = {
  readonly costPerMileUsd: number;
  readonly totalCostUsd: number;
};

export const calculateTotalCostPerMileOwnerOperator = (
  input: TotalCostPerMileOwnerOperatorInput,
): TotalCostPerMileOwnerOperatorOutput => {
  if (!Number.isFinite(input.milesDriven) || input.milesDriven <= 0)
    return simpleError(
      "milesDriven",
      "Miles driven must be finite and greater than zero.",
      "invalid_miles",
    );
  for (const key of ["fixedCostsUsd", "variableCostsUsd"] as const) {
    if (!Number.isFinite(input[key]) || input[key] < 0)
      return simpleError(
        key,
        "Operating costs must be finite and non-negative.",
        "invalid_cost",
      );
  }
  const totalCostUsd = input.fixedCostsUsd + input.variableCostsUsd;
  const costPerMileUsd = totalCostUsd / input.milesDriven;
  if (
    !Number.isFinite(totalCostUsd) ||
    !Number.isFinite(costPerMileUsd) ||
    (totalCostUsd > 0 && costPerMileUsd <= 0)
  )
    return simpleError(
      "fixedCostsUsd",
      "The total or per-mile cost is outside the representable range.",
      "cost_out_of_range",
    );
  return { totalCostUsd, costPerMileUsd };
};

export const totalCostPerMileOwnerOperatorExample = {
  input: { fixedCostsUsd: 1450, milesDriven: 2800, variableCostsUsd: 2050 },
  output: { costPerMileUsd: 1.25, totalCostUsd: 3500 },
} satisfies ToolExample<
  TotalCostPerMileOwnerOperatorInput,
  TotalCostPerMileOwnerOperatorOutput
>;

export const totalCostPerMileOwnerOperatorTool = createSimpleTool({
  id: "logistics/total-cost-per-mile-owner-operator",
  title: "Total Cost Per Mile Owner Operator Calculator",
  description:
    "Combine fixed and variable operating costs and spread them over miles driven to get cost per mile.",
  inputs: [
    {
      description:
        "Fixed costs such as insurance, permits and payments in USD.",
      id: "fixedCostsUsd",
      kind: "number",
      label: "Fixed costs",
      minimum: 0,
      unit: "USD",
    },
    {
      description: "Variable costs such as fuel and maintenance in USD.",
      id: "variableCostsUsd",
      kind: "number",
      label: "Variable costs",
      minimum: 0,
      unit: "USD",
    },
    {
      description: "Miles driven in the same period as the costs.",
      id: "milesDriven",
      kind: "number",
      label: "Miles driven",
      minimum: Number.MIN_VALUE,
      unit: "mi",
    },
  ],
  outputs: [
    {
      description: "Total operating cost in USD.",
      id: "totalCostUsd",
      kind: "number",
      label: "Total cost",
      minimum: 0,
      unit: "USD",
    },
    {
      description: "Operating cost per mile in USD.",
      id: "costPerMileUsd",
      kind: "number",
      label: "Cost/mile",
      minimum: 0,
      unit: "USD/mi",
    },
  ],
  calculate: (input) =>
    calculateTotalCostPerMileOwnerOperator({
      fixedCostsUsd: input.fixedCostsUsd as number,
      milesDriven: input.milesDriven as number,
      variableCostsUsd: input.variableCostsUsd as number,
    }),
});

export const runTotalCostPerMileOwnerOperator =
  totalCostPerMileOwnerOperatorTool.execute;
export default totalCostPerMileOwnerOperatorTool;
