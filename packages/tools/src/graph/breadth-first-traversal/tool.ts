import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { normalizeGraph } from "../normalize-edge-list/tool.js";

export type BreadthFirstTraversalInput = {
  readonly graph: Record<string, unknown>;
  readonly start: string;
};

export type BreadthFirstTraversalOutput = {
  readonly depths: Record<string, number>;
  readonly visitOrder: readonly string[];
};

export const breadthFirstTraversalExample = {
  input: { graph: { a: ["b", "c"], b: ["d"], c: [], d: [] }, start: "a" },
  output: {
    depths: { a: 0, b: 1, c: 1, d: 2 },
    visitOrder: ["a", "b", "c", "d"],
  },
} satisfies ToolExample<
  BreadthFirstTraversalInput,
  BreadthFirstTraversalOutput
>;

export const calculateBreadthFirstTraversal = (
  input: BreadthFirstTraversalInput,
): BreadthFirstTraversalOutput => {
  const graph = normalizeGraph(input.graph, "graph", true);
  if (!graph.adjacency.has(input.start))
    return simpleError(
      "start",
      `Start node "${input.start}" is not part of the graph.`,
      "unknown_start",
    );
  const depths = new Map<string, number>([[input.start, 0]]);
  const queue: string[] = [input.start];
  const visitOrder: string[] = [];
  while (queue.length > 0) {
    const node = queue.shift()!;
    visitOrder.push(node);
    for (const neighbor of graph.adjacency.get(node) ?? [])
      if (!depths.has(neighbor)) {
        depths.set(neighbor, depths.get(node)! + 1);
        queue.push(neighbor);
      }
  }
  return { depths: Object.fromEntries(depths), visitOrder };
};

export const breadthFirstTraversalTool = createSimpleTool({
  calculate: (input) =>
    calculateBreadthFirstTraversal({
      graph: input.graph as Record<string, unknown>,
      start: input.start as string,
    }),
  description:
    "Visit every node reachable from a start node in breadth-first order over directed edges, visiting neighbors in ascending order and reporting each node's depth.",
  id: "graph/breadth-first-traversal",
  inputs: [
    {
      description:
        "Adjacency map from node name to an array of neighbor names.",
      id: "graph",
      kind: "object",
      label: "Adjacency map",
    },
    {
      description: "Node where the traversal begins.",
      id: "start",
      kind: "string",
      label: "Start node",
    },
  ],
  outputs: [
    {
      description: "Nodes in the order they were first visited.",
      id: "visitOrder",
      kind: "stringList",
      label: "Visit order",
    },
    {
      description:
        "Minimum edge count from the start node for each visited node.",
      id: "depths",
      kind: "object",
      label: "Depths",
    },
  ],
  title: "Graph Breadth-First Traversal",
});

export const runBreadthFirstTraversal = breadthFirstTraversalTool.execute;
export default breadthFirstTraversalTool;
