import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tripleProduct: number;
  readonly permutation: readonly number[];
};
export type Output = { readonly value: number; readonly sign: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tripleProduct: { type: "number" },
    permutation: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["tripleProduct", "permutation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { value: { type: "number" }, sign: { type: "integer" } },
  required: ["value", "sign"],
} as const;
/** Calculate vector scalar triple permutation sign from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tripleProduct, permutation } = request;
  const compute = (): Output => {
    H.domain(
      permutation.length === 3 &&
        new Set(permutation).size === 3 &&
        permutation.every((x) => x >= 0 && x <= 2),
    );
    let inversions = 0;
    for (let i = 0; i < 3; i++)
      for (let j = i + 1; j < 3; j++)
        if (permutation[i] > permutation[j]) inversions++;
    const sign = inversions % 2 === 0 ? 1 : -1;
    return { value: sign * tripleProduct, sign };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { tripleProduct: 6, permutation: [1, 0, 2] },
  output: { value: -6, sign: -1 },
} satisfies ToolExample<Input, Output>;
export const vectorScalarTriplePermutationSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "vector/vector-scalar-triple-permutation-sign",
    title: "Vector Scalar Triple Permutation Sign Tool",
    description:
      "Calculate vector scalar triple permutation sign from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tripleProduct: { type: "number" },
        permutation: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["tripleProduct", "permutation"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { value: { type: "number" }, sign: { type: "integer" } },
      required: ["value", "sign"],
    },
    ports: {
      inputs: [
        {
          id: "tripleProduct",
          label: "Triple Product",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "permutation",
          label: "Permutation",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        { id: "value", label: "Value", valueType: { type: "number" } },
        { id: "sign", label: "Sign", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = vectorScalarTriplePermutationSignTool.execute;
export default vectorScalarTriplePermutationSignTool;
