import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  sameLength,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly indices: readonly number[];
  readonly values: readonly number[];
  readonly dropZeros: boolean;
};
export type Output = {
  readonly indices: readonly number[];
  readonly values: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    indices: { type: "array", maxItems: 256, items: { type: "integer" } },
    values: { type: "array", maxItems: 256, items: { type: "number" } },
    dropZeros: { type: "boolean" },
  },
  required: ["indices", "values", "dropZeros"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    indices: { type: "array", maxItems: 256, items: { type: "integer" } },
    values: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["indices", "values"],
} as const;
/** Compute vector sparse explicit zero policy from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { indices, values, dropZeros } = input;
  const compute = (): Output => {
    sameLength(indices, values);
    domain(indices.every((x, i) => x >= 0 && (i === 0 || x > indices[i - 1])));
    return {
      indices: indices.filter((_, i) => !dropZeros || values[i] !== 0),
      values: values.filter((x) => !dropZeros || x !== 0),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { indices: [0, 2, 4], values: [3, 0, 5], dropZeros: true },
  output: { indices: [0, 4], values: [3, 5] },
} satisfies ToolExample<Input, Output>;
export const vectorSparseExplicitZeroPolicyTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "vector/vector-sparse-explicit-zero-policy",
  title: "Vector Sparse Explicit Zero Policy Tool",
  description:
    "Compute vector sparse explicit zero policy from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "indices",
        label: "Indices",
        required: true,
        valueType: { type: "list", items: { type: "integer" } },
      },
      {
        id: "values",
        label: "Values",
        required: true,
        valueType: { type: "list", items: { type: "number" } },
      },
      {
        id: "dropZeros",
        label: "Drop Zeros",
        required: true,
        valueType: { type: "boolean" },
      },
    ],
    outputs: [
      {
        id: "indices",
        label: "Indices",
        valueType: { type: "list", items: { type: "integer" } },
      },
      {
        id: "values",
        label: "Values",
        valueType: { type: "list", items: { type: "number" } },
      },
    ],
  },
});
export const run = vectorSparseExplicitZeroPolicyTool.execute;
export default vectorSparseExplicitZeroPolicyTool;
