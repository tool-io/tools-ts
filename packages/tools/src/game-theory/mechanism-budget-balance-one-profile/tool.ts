import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly paymentsToMechanism: readonly number[];
  readonly externalCost: number;
};
export type Output = {
  readonly netRevenue: number;
  readonly surplusAfterCost: number;
  readonly budgetBalanced: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    paymentsToMechanism: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    externalCost: { type: "number" },
  },
  required: ["paymentsToMechanism", "externalCost"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netRevenue: { type: "number" },
    surplusAfterCost: { type: "number" },
    budgetBalanced: { type: "boolean" },
  },
  required: ["netRevenue", "surplusAfterCost", "budgetBalanced"],
} as const;
/** Positive payments flow to the mechanism; exact balance includes the supplied external cost. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { paymentsToMechanism, externalCost } = request;
  const compute = (): Output => {
    return {
      netRevenue: paymentsToMechanism.reduce((a, b) => a + b, 0),
      surplusAfterCost:
        paymentsToMechanism.reduce((a, b) => a + b, 0) - externalCost,
      budgetBalanced:
        paymentsToMechanism.reduce((a, b) => a + b, 0) === externalCost,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { paymentsToMechanism: [10, -4, -6], externalCost: 0 },
  output: { netRevenue: 0, surplusAfterCost: 0, budgetBalanced: true },
} satisfies ToolExample<Input, Output>;
export const mechanismBudgetBalanceOneProfileTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "game-theory/mechanism-budget-balance-one-profile",
    title: "Mechanism Budget Balance One Profile Tool",
    description:
      "Positive payments flow to the mechanism; exact balance includes the supplied external cost.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        paymentsToMechanism: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        externalCost: { type: "number" },
      },
      required: ["paymentsToMechanism", "externalCost"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netRevenue: { type: "number" },
        surplusAfterCost: { type: "number" },
        budgetBalanced: { type: "boolean" },
      },
      required: ["netRevenue", "surplusAfterCost", "budgetBalanced"],
    },
    ports: {
      inputs: [
        {
          id: "paymentsToMechanism",
          label: "Payments To Mechanism",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "externalCost",
          label: "External Cost",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "netRevenue",
          label: "Net Revenue",
          valueType: { type: "number" },
        },
        {
          id: "surplusAfterCost",
          label: "Surplus After Cost",
          valueType: { type: "number" },
        },
        {
          id: "budgetBalanced",
          label: "Budget Balanced",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = mechanismBudgetBalanceOneProfileTool.execute;
export default mechanismBudgetBalanceOneProfileTool;
