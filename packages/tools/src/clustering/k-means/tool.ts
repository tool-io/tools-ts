import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { kMeans } from "../iterative-core.js";

export const example = {
  input: { points: [[0], [1], [10], [11]], clusters: 2, maxIterations: 100 },
  output: { centroids: [[0.5], [10.5]], labels: [0, 0, 1, 1], iterations: 1 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export const tool = createSimpleTool({
  id: "clustering/k-means",
  title: "K-Means Clustering Tool",
  description:
    "Cluster numeric points by iterative nearest-centroid assignment and arithmetic centroid updates. Farthest-point deterministic initialization avoids random results.",
  inputs: [
    { id: "points", kind: "matrix", label: "points" },
    {
      id: "clusters",
      kind: "integer",
      label: "clusters",
      minimum: 1,
      maximum: 100,
    },
    {
      id: "maxIterations",
      kind: "integer",
      label: "max Iterations",
      minimum: 1,
      maximum: 1000,
    },
  ],
  outputs: [
    { id: "centroids", kind: "matrix", label: "centroids" },
    { id: "labels", kind: "numberList", label: "labels" },
    { id: "iterations", kind: "integer", label: "iterations" },
  ],
  calculate: (input) =>
    kMeans(
      input.points as number[][],
      input.clusters as number,
      input.maxIterations as number,
    ),
});
export type KMeansInput = Readonly<typeof example.input>;
export type KMeansOutput = Readonly<typeof example.output>;
export const kMeansTool = tool;
export const runKMeans = tool.execute;
export default tool;
