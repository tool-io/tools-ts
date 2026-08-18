import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { toolResourceLimits } from "../../core/limits.js";
import { normalizeGraph } from "../normalize-edge-list/tool.js";

export type AdjacencyListToMatrixInput = {
  readonly directed?: boolean;
  readonly graph: Record<string, unknown>;
};

export type AdjacencyListToMatrixOutput = {
  readonly table: {
    readonly matrix: number[][];
    readonly nodes: string[];
  };
};

export const adjacencyListToMatrixExample = {
  input: { directed: true, graph: { a: ["b"], b: [] } },
  output: {
    table: { matrix: [[0, 1], [0, 0]], nodes: ["a", "b"] },
  },
} satisfies ToolExample<
  AdjacencyListToMatrixInput,
  AdjacencyListToMatrixOutput
>;

export const calculateAdjacencyListToMatrix = (
  input: AdjacencyListToMatrixInput,
): AdjacencyListToMatrixOutput => {
  const graph = normalizeGraph(
    input.graph,
    "graph",
    input.directed ?? false,
  );
  if (graph.nodes.length === 0)
    simpleError(
      "graph",
      "Provide at least one node.",
      "insufficient_nodes",
    );
  if (graph.nodes.length > toolResourceLimits.matrixDimension)
    simpleError(
      "graph",
      `The graph must not exceed ${toolResourceLimits.matrixDimension.toLocaleString("en-US")} nodes.`,
      "resource_limit_exceeded",
    );
  const indexOf = new Map(
    graph.nodes.map((node, position) => [node, position]),
  );
  const matrix = graph.nodes.map(() =>
    new Array<number>(graph.nodes.length).fill(0),
  );
  for (const [source, target] of graph.edges) {
    matrix[indexOf.get(source)!]![indexOf.get(target)!] = 1;
    if (!graph.directed && source !== target)
      matrix[indexOf.get(target)!]![indexOf.get(source)!] = 1;
  }
  return { table: { matrix, nodes: [...graph.nodes] } };
};

export const adjacencyListToMatrixTool = createSimpleTool({
  calculate: (input) =>
    calculateAdjacencyListToMatrix(
      input as unknown as AdjacencyListToMatrixInput,
    ),
  description:
    "Convert an adjacency map into a square 0/1 matrix with sorted node order.",
  id: "graph/adjacency-list-to-matrix",
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
        "Sorted node names and the matching 0/1 adjacency matrix.",
      id: "table",
      kind: "object",
      label: "Adjacency matrix",
    },
  ],
  title: "Graph Adjacency List to Matrix Converter",
});
export const runAdjacencyListToMatrix = adjacencyListToMatrixTool.execute;
export default adjacencyListToMatrixTool;
