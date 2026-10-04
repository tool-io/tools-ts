import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: readonly number[];
  readonly second: readonly number[];
};
export type Output = { readonly product: readonly number[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "array", maxItems: 256, items: { type: "number" } },
    second: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["first", "second"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    product: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["product"],
} as const;
/** Calculate vector 2d complex multiplication pair from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second } = request;
  const compute = (): Output => {
    H.domain(first.length === 2 && second.length === 2);
    return {
      product: [
        first[0] * second[0] - first[1] * second[1],
        first[0] * second[1] + first[1] * second[0],
      ],
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: [2, 3], second: [4, -1] },
  output: { product: [11, 10] },
} satisfies ToolExample<Input, Output>;
export const vector2dComplexMultiplicationPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "vector/vector-2d-complex-multiplication-pair",
    title: "Vector 2d Complex Multiplication Pair Tool",
    description:
      "Calculate vector 2d complex multiplication pair from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "array", maxItems: 256, items: { type: "number" } },
        second: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["first", "second"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        product: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["product"],
    },
    ports: {
      inputs: [
        {
          id: "first",
          label: "First",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "second",
          label: "Second",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "product",
          label: "Product",
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
    },
  },
  calculate,
});
export const run = vector2dComplexMultiplicationPairTool.execute;
export default vector2dComplexMultiplicationPairTool;
