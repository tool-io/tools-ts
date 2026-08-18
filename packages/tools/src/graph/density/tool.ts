import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";
import { normalizeGraph } from "../normalize-edge-list/tool.js";

export type DensityInput = {
  readonly directed?: boolean;
  readonly graph: Record<string, unknown>;
};

export type DensityOutput = {
  readonly density: number;
};

export const densityExample = {
  input: { directed: false, graph: { b: ["a"], a: ["b"] } },
  output: { density: 1 },
} satisfies ToolExample<DensityInput, DensityOutput>;

export const calculateDensity = (input: DensityInput): DensityOutput => {
  const graph = normalizeGraph(
    input.graph,
    "graph",
    input.directed ?? false,
  );
  const nodeCount = graph.nodes.length;
  if (nodeCount < 2)
    simpleError(
      "graph",
      "Density needs at least two nodes.",
      "insufficient_nodes",
    );
  const realEdges = graph.edges.filter(
    ([source, target]) => source !== target,
  ).length;
  const possible = nodeCount * (nodeCount - 1);
  const density =
    (graph.directed ? realEdges : 2 * realEdges) / possible;
  return { density: roundStatistic(density) };
};

export const densityTool = createSimpleTool({
  calculate: (input) => calculateDensity(input as unknown as DensityInput),
  description:
    "Compute how many of the possible node pairs are connected, ignoring self-loops.",
  id: "graph/density",
  inputs: [
    {
      description:
        "Adjacency map from node name to an array of neighbor names.",
      id: "graph",
      kind: "object",
      label: "Adjacency map",
    },
    {
      default: false,
      description:
        "Treat listed neighbors as one-directional instead of mutual.",
      id: "directed",
      kind: "boolean",
      label: "Directed",
    },
  ],
  outputs: [
    {
      description:
        "Ratio of present edges to possible edges between zero and one.",
      format: "probability",
      id: "density",
      kind: "number",
      label: "Density",
    },
  ],
  title: "Graph Density Calculator",
});
export const runDensity = densityTool.execute;
export default densityTool;
