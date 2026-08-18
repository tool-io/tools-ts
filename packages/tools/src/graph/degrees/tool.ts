import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { normalizeGraph } from "../normalize-edge-list/tool.js";

export type DegreesInput = {
  readonly directed?: boolean;
  readonly graph: Record<string, unknown>;
};

export type DegreesOutput = {
  readonly table: {
    readonly degree: number[];
    readonly inDegree: number[];
    readonly nodes: string[];
    readonly outDegree: number[];
  };
};

export const degreesExample = {
  input: { directed: false, graph: { b: ["a"], a: ["b", "a"] } },
  output: {
    table: {
      degree: [3, 1],
      inDegree: [3, 1],
      nodes: ["a", "b"],
      outDegree: [3, 1],
    },
  },
} satisfies ToolExample<DegreesInput, DegreesOutput>;

export const calculateDegrees = (input: DegreesInput): DegreesOutput => {
  const graph = normalizeGraph(
    input.graph,
    "graph",
    input.directed ?? false,
  );
  const indexOf = new Map(
    graph.nodes.map((node, position) => [node, position]),
  );
  const inDegree = new Array<number>(graph.nodes.length).fill(0);
  const outDegree = new Array<number>(graph.nodes.length).fill(0);
  const loop = new Array<boolean>(graph.nodes.length).fill(false);
  for (const [source, target] of graph.edges) {
    const sourceIndex = indexOf.get(source)!;
    const targetIndex = indexOf.get(target)!;
    if (sourceIndex === targetIndex && !graph.directed) {
      loop[sourceIndex] = true; // counted as two endpoints below
      continue;
    }
    outDegree[sourceIndex] += 1;
    inDegree[targetIndex] += 1;
  }
  const degree = graph.nodes.map((_, position) => {
    if (graph.directed) return inDegree[position]! + outDegree[position]!;
    return (
      inDegree[position]! +
      outDegree[position]! +
      (loop[position] ? 2 : 0)
    );
  });
  const inOut = graph.directed
    ? graph.nodes.map((_, position) => inDegree[position]!)
    : degree;
  const outValues = graph.directed
    ? graph.nodes.map((_, position) => outDegree[position]!)
    : degree;
  return {
    table: {
      degree,
      inDegree: inOut,
      nodes: [...graph.nodes],
      outDegree: outValues,
    },
  };
};

export const degreesTool = createSimpleTool({
  calculate: (input) => calculateDegrees(input as unknown as DegreesInput),
  description:
    "Count each node's degree, in-degree, and out-degree over an adjacency map.",
  id: "graph/degrees",
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
        "Aligned arrays of node names plus degree, in-degree, and out-degree counts; self-loops add two to an undirected degree.",
      id: "table",
      kind: "object",
      label: "Degrees",
    },
  ],
  title: "Graph Degree Calculator",
});
export const runDegrees = degreesTool.execute;
export default degreesTool;
