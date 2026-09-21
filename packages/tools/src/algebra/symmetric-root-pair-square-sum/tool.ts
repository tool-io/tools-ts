import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly sum: number; readonly product: number };
export type Output = { readonly squareSum: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { sum: { type: "number" }, product: { type: "number" } },
  required: ["sum", "product"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { squareSum: { type: "number" } },
  required: ["squareSum"],
} as const;
/** Calculate symmetric root pair square sum from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { sum, product } = input;
  const compute = (): Output => {
    return { squareSum: sum * sum - 2 * product };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { sum: 5, product: 6 },
  output: { squareSum: 13 },
} satisfies ToolExample<Input, Output>;
export const symmetricRootPairSquareSumTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "algebra/symmetric-root-pair-square-sum",
    title: "Symmetric Root Pair Square Sum Tool",
    description:
      "Calculate symmetric root pair square sum from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { sum: { type: "number" }, product: { type: "number" } },
      required: ["sum", "product"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { squareSum: { type: "number" } },
      required: ["squareSum"],
    },
    ports: {
      inputs: [
        {
          id: "sum",
          label: "Sum",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "product",
          label: "Product",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "squareSum", label: "Square Sum", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = symmetricRootPairSquareSumTool.execute;
export default symmetricRootPairSquareSumTool;
