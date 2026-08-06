import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const rectangular = (matrix: readonly (readonly number[])[]) =>
  matrix.length > 0 &&
  (matrix[0]?.length ?? 0) > 0 &&
  matrix.every((row) => row.length === matrix[0]!.length);
export const scaledDotProductAttention = (
  queries: readonly (readonly number[])[],
  keys: readonly (readonly number[])[],
  values: readonly (readonly number[])[],
): number[][] | null => {
  if (
    !rectangular(queries) ||
    !rectangular(keys) ||
    !rectangular(values) ||
    queries[0]!.length !== keys[0]!.length ||
    keys.length !== values.length
  )
    return null;
  const scale = Math.sqrt(keys[0]!.length);
  return queries.map((query) => {
    const scores = keys.map(
      (key) =>
        query.reduce((sum, value, index) => sum + value * key[index]!, 0) /
        scale,
    );
    const maximum = Math.max(...scores),
      weights = scores.map((score) => Math.exp(score - maximum));
    const total = weights.reduce((sum, weight) => sum + weight, 0);
    return values[0]!.map((_, column) =>
      Number(
        (
          values.reduce(
            (sum, row, index) => sum + row[column]! * weights[index]!,
            0,
          ) / total
        ).toPrecision(12),
      ),
    );
  });
};
export const scaledDotProductAttentionExample = {
  input: {
    keys: [
      [1, 0],
      [0, 1],
    ],
    queries: [[1, 0]],
    values: [
      [10, 0],
      [0, 20],
    ],
  },
  output: { attendedValues: [[6.69761549327, 6.60476901347]] },
} satisfies ToolExample<
  {
    readonly keys: readonly (readonly number[])[];
    readonly queries: readonly (readonly number[])[];
    readonly values: readonly (readonly number[])[];
  },
  { readonly attendedValues: readonly (readonly number[])[] }
>;
export const scaledDotProductAttentionTool = createSimpleTool({
  id: "machine-learning/scaled-dot-product-attention",
  title: "Scaled Dot-Product Attention Calculator",
  description:
    "Apply softmax-scaled query-key attention weights to value vectors.",
  inputs: [
    { format: "matrix/query", id: "queries", kind: "matrix", label: "Queries" },
    { format: "matrix/key", id: "keys", kind: "matrix", label: "Keys" },
    { format: "matrix/value", id: "values", kind: "matrix", label: "Values" },
  ],
  outputs: [
    {
      format: "matrix/attention",
      id: "attendedValues",
      kind: "matrix",
      label: "Attended values",
    },
  ],
  calculate: (input) => {
    const attendedValues = scaledDotProductAttention(
      input.queries as number[][],
      input.keys as number[][],
      input.values as number[][],
    );
    if (!attendedValues)
      return simpleError(
        "keys",
        "Queries and keys must share a width; keys and values must share a row count.",
      );
    return { attendedValues };
  },
});
export const runScaledDotProductAttention =
  scaledDotProductAttentionTool.execute;
export default scaledDotProductAttentionTool;
