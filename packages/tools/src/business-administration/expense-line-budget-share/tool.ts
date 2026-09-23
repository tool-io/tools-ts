import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly expense: number; readonly budget: number };
export type Output = { readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expense: { type: "number", minimum: 0 },
    budget: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["expense", "budget"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" } },
  required: ["share"],
} as const;
/** Calculate expense line budget share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { expense, budget } = request;
  const compute = (): Output => {
    H.domain(expense >= 0);
    H.positive(budget);
    return { share: expense / budget };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { expense: 30, budget: 100 },
  output: { share: 0.3 },
} satisfies ToolExample<Input, Output>;
export const expenseLineBudgetShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "business-administration/expense-line-budget-share",
    title: "Expense Line Budget Share Tool",
    description:
      "Calculate expense line budget share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expense: { type: "number", minimum: 0 },
        budget: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["expense", "budget"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { share: { type: "number" } },
      required: ["share"],
    },
    ports: {
      inputs: [
        {
          id: "expense",
          label: "Expense",
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
      outputs: [{ id: "share", label: "Share", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = expenseLineBudgetShareTool.execute;
export default expenseLineBudgetShareTool;
