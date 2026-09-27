import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly recorded: number; readonly expected: number };
export type Output = { readonly difference: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recorded: { type: "number", minimum: 0 },
    expected: { type: "number", minimum: 0 },
  },
  required: ["recorded", "expected"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { difference: { type: "number" } },
  required: ["difference"],
} as const;
/** Audit explicitly supplied food-lot quantities without a food-safety release decision. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recorded, expected } = request;
  const compute = (): Output => {
    H.domain(recorded >= 0 && expected >= 0);
    return { difference: recorded - expected };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recorded: 98, expected: 100 },
  output: { difference: -2 },
} satisfies ToolExample<Input, Output>;
export const foodLotQuantityDifferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-safety/food-lot-quantity-difference",
    title: "Food Lot Quantity Difference Tool",
    description:
      "Audit explicitly supplied food-lot quantities without a food-safety release decision.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recorded: { type: "number", minimum: 0 },
        expected: { type: "number", minimum: 0 },
      },
      required: ["recorded", "expected"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { difference: { type: "number" } },
      required: ["difference"],
    },
    ports: {
      inputs: [
        {
          id: "recorded",
          label: "Recorded",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "expected",
          label: "Expected",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "difference",
          label: "Difference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = foodLotQuantityDifferenceTool.execute;
export default foodLotQuantityDifferenceTool;
