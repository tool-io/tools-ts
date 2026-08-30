import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly arrays: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly normalizedArrays: readonly (readonly number[])[];
  readonly rankMeans: readonly number[];
}>;

export const calculate = (input: Input): Output => {
  const arrays = input.arrays,
    n = arrays[0]?.length;
  if (arrays.length < 2 || !n || arrays.some((a) => a.length !== n))
    simpleError("arrays", "At least two aligned nonempty arrays are required.");
  const order = arrays.map((a) =>
      a.map((v, i) => ({ v, i })).sort((x, y) => x.v - y.v),
    ),
    rankMeans = Array.from(
      { length: n },
      (_, r) => order.reduce((s, a) => s + a[r].v, 0) / arrays.length,
    ),
    normalizedArrays = order.map((sorted) => {
      const result = Array(n).fill(0);
      for (let i = 0; i < n;) {
        let j = i + 1;
        while (j < n && sorted[j].v === sorted[i].v) j++;
        const mean = rankMeans.slice(i, j).reduce((a, b) => a + b, 0) / (j - i);
        for (let k = i; k < j; k++) result[sorted[k].i] = mean;
        i = j;
      }
      return result;
    });
  return { normalizedArrays, rankMeans };
};

export const exampleInput = {
  arrays: [
    [1, 3, 5],
    [2, 4, 6],
  ],
} satisfies Input;
export const exampleOutput = {
  normalizedArrays: [
    [1.5, 3.5, 5.5],
    [1.5, 3.5, 5.5],
  ],
  rankMeans: [1.5, 3.5, 5.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/quantile-normalization",
  title: "Quantile Normalization",
  description:
    "Quantile-normalize multiple arrays, averaging tied-rank assignments.",
  inputs: [{ id: "arrays", kind: "matrix", label: "Arrays" }],
  outputs: [
    { id: "normalizedArrays", kind: "matrix", label: "Normalized arrays" },
    { id: "rankMeans", kind: "numberList", label: "Rank means" },
  ],
  calculate: (value) =>
    calculate({
      arrays: value.arrays as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
