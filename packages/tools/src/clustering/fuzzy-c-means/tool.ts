import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { fuzzyCMeans } from "../iterative-core.js";

export const example = {
  input: {
    points: [[0], [1], [10], [11]],
    clusters: 2,
    maxIterations: 100,
    fuzzifier: 2,
  },
  output: {
    centroids: [[0.4998109359300063], [10.500189064069994]],
    memberships: [
      [0.997739348559382, 0.0022606514406180948],
      [0.9972355906757125, 0.0027644093242873086],
      [0.0027644093242873012, 0.9972355906757128],
      [0.0022606514406181013, 0.997739348559382],
    ],
    iterations: 4,
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export const tool = createSimpleTool({
  id: "clustering/fuzzy-c-means",
  title: "Fuzzy C-Means Clustering Tool",
  description:
    "Fit fuzzy c-means memberships that sum to one across clusters for each point; fuzzifier must exceed one.",
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
    { id: "fuzzifier", kind: "number", label: "fuzzifier", minimum: 1.000001 },
  ],
  outputs: [
    { id: "centroids", kind: "matrix", label: "centroids" },
    { id: "memberships", kind: "matrix", label: "memberships" },
    { id: "iterations", kind: "integer", label: "iterations" },
  ],
  calculate: (input) =>
    fuzzyCMeans(
      input.points as number[][],
      input.clusters as number,
      input.fuzzifier as number,
      input.maxIterations as number,
    ),
});
export type FuzzyCMeansInput = Readonly<typeof example.input>;
export type FuzzyCMeansOutput = Readonly<typeof example.output>;
export const fuzzyCMeansTool = tool;
export const runFuzzyCMeans = tool.execute;
export default tool;
