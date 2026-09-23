import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly purchase: number;
  readonly training: number;
  readonly maintenance: number;
  readonly reimbursed: number;
  readonly budget: number;
};
export type Output = {
  readonly gross: number;
  readonly net: number;
  readonly remainingBudget: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    purchase: { type: "number", minimum: 0 },
    training: { type: "number", minimum: 0 },
    maintenance: { type: "number", minimum: 0 },
    reimbursed: { type: "number", minimum: 0 },
    budget: { type: "number", minimum: 0 },
  },
  required: ["purchase", "training", "maintenance", "reimbursed", "budget"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gross: { type: "number" },
    net: { type: "number" },
    remainingBudget: { type: "number" },
  },
  required: ["gross", "net", "remainingBudget"],
} as const;
/** Calculate biosecurity protective expense reconcile from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { purchase, training, maintenance, reimbursed, budget } = request;
  const compute = (): Output => {
    H.domain(
      purchase >= 0 &&
        training >= 0 &&
        maintenance >= 0 &&
        reimbursed >= 0 &&
        budget >= 0,
    );
    return {
      gross: purchase + training + maintenance,
      net: purchase + training + maintenance - reimbursed,
      remainingBudget: budget - purchase - training - maintenance + reimbursed,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    purchase: 100,
    training: 40,
    maintenance: 20,
    reimbursed: 30,
    budget: 200,
  },
  output: { gross: 160, net: 130, remainingBudget: 70 },
} satisfies ToolExample<Input, Output>;
export const biosecurityProtectiveExpenseReconcileTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biosecurity/biosecurity-protective-expense-reconcile",
      title: "Biosecurity Protective Expense Reconcile Tool",
      description:
        "Calculate biosecurity protective expense reconcile from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          purchase: { type: "number", minimum: 0 },
          training: { type: "number", minimum: 0 },
          maintenance: { type: "number", minimum: 0 },
          reimbursed: { type: "number", minimum: 0 },
          budget: { type: "number", minimum: 0 },
        },
        required: [
          "purchase",
          "training",
          "maintenance",
          "reimbursed",
          "budget",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          gross: { type: "number" },
          net: { type: "number" },
          remainingBudget: { type: "number" },
        },
        required: ["gross", "net", "remainingBudget"],
      },
      ports: {
        inputs: [
          {
            id: "purchase",
            label: "Purchase",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "training",
            label: "Training",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "maintenance",
            label: "Maintenance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "reimbursed",
            label: "Reimbursed",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "budget",
            label: "Budget",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "gross", label: "Gross", valueType: { type: "number" } },
          { id: "net", label: "Net", valueType: { type: "number" } },
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
export const run = biosecurityProtectiveExpenseReconcileTool.execute;
export default biosecurityProtectiveExpenseReconcileTool;
