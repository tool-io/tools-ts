import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { possibilisticCMeans } from "../iterative-core.js";

export const example = {
  input: {
    points: [[0], [1], [10], [11]],
    clusters: 2,
    maxIterations: 100,
    fuzzifier: 2,
    scale: 1,
  },
  output: {
    centroids: [[0.5077824837104895], [10.492217516289509]],
    typicalities: [
      [0.7950123031720883, 0.009001982059886225],
      [0.8049721922675177, 0.010976682141846888],
      [0.010976682141846888, 0.804972192267518],
      [0.009001982059886225, 0.7950123031720879],
    ],
    iterations: 51,
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export const tool = createSimpleTool({
  id: "clustering/possibilistic-c-means",
  title: "Possibilistic C-Means Clustering Tool",
  description:
    "Fit possibilistic typicalities independently for each cluster using a caller-supplied squared-distance scale; unlike fuzzy memberships, rows need not sum to one.",
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
    { id: "scale", kind: "number", label: "scale", minimum: 5e-324 },
  ],
  outputs: [
    { id: "centroids", kind: "matrix", label: "centroids" },
    { id: "typicalities", kind: "matrix", label: "typicalities" },
    { id: "iterations", kind: "integer", label: "iterations" },
  ],
  calculate: (input) =>
    possibilisticCMeans(
      input.points as number[][],
      input.clusters as number,
      input.fuzzifier as number,
      input.scale as number,
      input.maxIterations as number,
    ),
});
export type PossibilisticCMeansInput = Readonly<typeof example.input>;
export type PossibilisticCMeansOutput = Readonly<typeof example.output>;
export const possibilisticCMeansTool = tool;
export const runPossibilisticCMeans = tool.execute;
export default tool;
