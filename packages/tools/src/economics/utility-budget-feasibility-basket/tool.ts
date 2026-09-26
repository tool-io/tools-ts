import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  quantities: readonly number[];
  prices: readonly number[];
  budget: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "quantities", label: "Quantities", kind: "numberList" },
  { id: "prices", label: "Prices", kind: "numberList" },
  { id: "budget", label: "Budget", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.quantities.length === i.prices.length && i.budget >= 0);
  [...i.quantities, ...i.prices].forEach((x) => H.check(x >= 0));
  const cost = i.quantities.reduce((s, x, j) => s + x * i.prices[j], 0);
  return H.finish({
    expenditure: cost,
    feasible: cost <= i.budget,
    remainingBudget: i.budget - cost,
  });
};
export const example = {
  input: { quantities: [2, 3], prices: [4, 1], budget: 10 },
  output: { result: { expenditure: 11, feasible: false, remainingBudget: -1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "economics/utility-budget-feasibility-basket",
  title: "Economics: Utility Budget Feasibility Basket Tool",
  description:
    "Check one explicitly priced nonnegative consumption basket against an explicit budget without maximizing utility or predicting choices.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          expenditure: { type: "number" },
          feasible: { type: "boolean" },
          remainingBudget: { type: "number" },
        },
        required: ["expenditure", "feasible", "remainingBudget"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
