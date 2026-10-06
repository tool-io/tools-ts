import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly spentAmount: number;
  readonly allocatedBudget: number;
};
export type Output = {
  readonly executionRatio: number;
  readonly remainingBudget: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    spentAmount: { type: "number", minimum: 0 },
    allocatedBudget: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["spentAmount", "allocatedBudget"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    executionRatio: { type: "number" },
    remainingBudget: { type: "number" },
  },
  required: ["executionRatio", "remainingBudget"],
} as const;
/** Compare explicit spending with a positive allocated budget in the same currency, preserving overspending. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { spentAmount, allocatedBudget } = request;
  const compute = (): Output => {
    H.domain(spentAmount >= 0, "spentAmount");
    (H.domain(allocatedBudget > 0, "allocatedBudget"), allocatedBudget);
    return {
      executionRatio: spentAmount / allocatedBudget,
      remainingBudget: allocatedBudget - spentAmount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { spentAmount: 750, allocatedBudget: 1000 },
  output: { executionRatio: 0.75, remainingBudget: 250 },
} satisfies ToolExample<Input, Output>;
export const farmPolicyBudgetExecutionRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agricultural-policy", "agricultural policy", "agriculture"],
      keywords: ["agricultural policy", "agriculture"],
    },
    id: "agricultural-policy/farm-policy-budget-execution-ratio",
    title: "Farm Policy Budget Execution Ratio",
    description:
      "Compare explicit spending with a positive allocated budget in the same currency, preserving overspending.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        spentAmount: { type: "number", minimum: 0 },
        allocatedBudget: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["spentAmount", "allocatedBudget"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        executionRatio: { type: "number" },
        remainingBudget: { type: "number" },
      },
      required: ["executionRatio", "remainingBudget"],
    },
    ports: {
      inputs: [
        {
          id: "spentAmount",
          label: "Spent Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "allocatedBudget",
          label: "Allocated Budget",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "executionRatio",
          label: "Execution Ratio",
          valueType: { type: "number" },
        },
        {
          id: "remainingBudget",
          label: "Remaining Budget",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = farmPolicyBudgetExecutionRatioTool.execute;
export default farmPolicyBudgetExecutionRatioTool;
