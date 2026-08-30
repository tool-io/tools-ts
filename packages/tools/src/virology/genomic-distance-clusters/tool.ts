import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { nonnegative } from "../shared.js";

export type Input = Readonly<{
  readonly sampleIds: readonly string[];
  readonly distanceMatrix: readonly (readonly number[])[];
  readonly maximumDistance: number;
}>;
export type Output = Readonly<{
  readonly clusterIndexes: readonly number[];
  readonly clusterCount: number;
}>;
export const calculate = (input: Input): Output => {
  const n = input.sampleIds.length;
  nonnegative(input.maximumDistance, "maximumDistance");
  if (
    !n ||
    n > 128 ||
    new Set(input.sampleIds).size !== n ||
    input.distanceMatrix.length !== n ||
    input.distanceMatrix.some(
      (row, i) =>
        row.length !== n ||
        row[i] !== 0 ||
        row.some(
          (v, j) =>
            !Number.isFinite(v) || v < 0 || v !== input.distanceMatrix[j]?.[i],
        ),
    )
  )
    simpleError(
      "distanceMatrix",
      "A symmetric nonnegative distance matrix with zero diagonal and distinct samples is required; at most 128 samples.",
    );
  const clusterIndexes = Array<number>(n).fill(-1);
  let clusterCount = 0;
  for (let start = 0; start < n; start++) {
    if (clusterIndexes[start] >= 0) continue;
    clusterIndexes[start] = clusterCount;
    const queue = [start];
    for (let q = 0; q < queue.length; q++)
      for (let j = 0; j < n; j++)
        if (
          clusterIndexes[j] < 0 &&
          input.distanceMatrix[queue[q]][j] <= input.maximumDistance
        ) {
          clusterIndexes[j] = clusterCount;
          queue.push(j);
        }
    clusterCount++;
  }
  return { clusterIndexes, clusterCount };
};
export const exampleInput = {
  sampleIds: ["A", "B", "C"],
  distanceMatrix: [
    [0, 1, 5],
    [1, 0, 6],
    [5, 6, 0],
  ],
  maximumDistance: 2,
} satisfies Input;
export const exampleOutput = {
  clusterIndexes: [0, 0, 1],
  clusterCount: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/genomic-distance-clusters",
  title: "Genomic Distance Clusters",
  description:
    "Group samples into single-linkage components using a supplied genomic-distance threshold; connected membership does not establish transmission.",
  inputs: [
    { id: "sampleIds", label: "Sample ids", kind: "stringList" },
    { id: "distanceMatrix", label: "Distance matrix", kind: "matrix" },
    {
      id: "maximumDistance",
      label: "Maximum distance",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "clusterIndexes", label: "Cluster indexes", kind: "numberList" },
    { id: "clusterCount", label: "Cluster count", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      sampleIds: value.sampleIds as readonly string[],
      distanceMatrix: value.distanceMatrix as readonly (readonly number[])[],
      maximumDistance: value.maximumDistance as number,
    }),
});
export const run = tool.execute;
export default tool;
