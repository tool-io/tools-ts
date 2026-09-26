import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly budget: number; readonly price: number };
export type Output = { readonly intercept: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    budget: { type: "number", minimum: 0 },
    price: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["budget", "price"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { intercept: { type: "number" } },
  required: ["intercept"],
} as const;
/** Calculate budget line axis intercept from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { budget, price } = request;
  const compute = (): Output => {
    H.domain(budget >= 0);
    H.positive(price);
    return { intercept: budget / price };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { budget: 120, price: 8 },
  output: { intercept: 15 },
} satisfies ToolExample<Input, Output>;
export const budgetLineAxisInterceptTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economics/budget-line-axis-intercept",
    title: "Budget Line Axis Intercept Tool",
    description:
      "Calculate budget line axis intercept from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        budget: { type: "number", minimum: 0 },
        price: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["budget", "price"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { intercept: { type: "number" } },
      required: ["intercept"],
    },
    ports: {
      inputs: [
        {
          id: "budget",
          label: "Budget",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "price",
          label: "Price",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "intercept", label: "Intercept", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = budgetLineAxisInterceptTool.execute;
export default budgetLineAxisInterceptTool;
