import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly a: number;
  readonly b: number;
  readonly c: number;
  readonly d: number;
};
export type Output = { readonly sum: number; readonly product: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    a: { type: "number" },
    b: { type: "number" },
    c: { type: "number" },
    d: { type: "number" },
  },
  required: ["a", "b", "c", "d"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { sum: { type: "number" }, product: { type: "number" } },
  required: ["sum", "product"],
} as const;
/** Calculate matrix 2x2 eigenvalue sum product from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { a, b, c, d } = input;
  const compute = (): Output => {
    return { sum: a + d, product: a * d - b * c };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { a: 1, b: 2, c: 3, d: 4 },
  output: { sum: 5, product: -2 },
} satisfies ToolExample<Input, Output>;
export const matrix2x2EigenvalueSumProductTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "matrix/matrix-2x2-eigenvalue-sum-product",
    title: "Matrix 2x2 Eigenvalue Sum Product Tool",
    description:
      "Calculate matrix 2x2 eigenvalue sum product from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        a: { type: "number" },
        b: { type: "number" },
        c: { type: "number" },
        d: { type: "number" },
      },
      required: ["a", "b", "c", "d"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { sum: { type: "number" }, product: { type: "number" } },
      required: ["sum", "product"],
    },
    ports: {
      inputs: [
        { id: "a", label: "A", required: true, valueType: { type: "number" } },
        { id: "b", label: "B", required: true, valueType: { type: "number" } },
        { id: "c", label: "C", required: true, valueType: { type: "number" } },
        { id: "d", label: "D", required: true, valueType: { type: "number" } },
      ],
      outputs: [
        { id: "sum", label: "Sum", valueType: { type: "number" } },
        { id: "product", label: "Product", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = matrix2x2EigenvalueSumProductTool.execute;
export default matrix2x2EigenvalueSumProductTool;
