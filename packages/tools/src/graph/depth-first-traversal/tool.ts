import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { normalizeGraph } from "../normalize-edge-list/tool.js";

export type DepthFirstTraversalInput = {
  readonly graph: Record<string, unknown>;
  readonly start: string;
};

export type DepthFirstTraversalOutput = {
  readonly depths: Record<string, number>;
  readonly visitOrder: readonly string[];
};

export const depthFirstTraversalExample = {
  input: { graph: { a: ["b", "c"], b: ["d"], c: [], d: [] }, start: "a" },
  output: {
    depths: { a: 0, b: 1, c: 1, d: 2 },
    visitOrder: ["a", "b", "d", "c"],
  },
} satisfies ToolExample<DepthFirstTraversalInput, DepthFirstTraversalOutput>;

export const calculateDepthFirstTraversal = (
  input: DepthFirstTraversalInput,
): DepthFirstTraversalOutput => {
  const graph = normalizeGraph(input.graph, "graph", true);
  if (!graph.adjacency.has(input.start))
    return simpleError(
      "start",
      `Start node "${input.start}" is not part of the graph.`,
      "unknown_start",
    );
  const visited = new Set<string>();
  const depths = new Map<string, number>();
  const visitOrder: string[] = [];
  const stack: [string, number][] = [[input.start, 0]];
  while (stack.length > 0) {
    const [node, depth] = stack.pop()!;
    if (visited.has(node)) continue;
    visited.add(node);
    depths.set(node, depth);
    visitOrder.push(node);
    const neighbors = graph.adjacency.get(node) ?? [];
    for (let index = neighbors.length - 1; index >= 0; index -= 1)
      if (!visited.has(neighbors[index]!))
        stack.push([neighbors[index]!, depth + 1]);
  }
  return { depths: Object.fromEntries(depths), visitOrder };
};

export const depthFirstTraversalTool = createSimpleTool({
  calculate: (input) =>
    calculateDepthFirstTraversal({
      graph: input.graph as Record<string, unknown>,
      start: input.start as string,
    }),
  description:
    "Visit every node reachable from a start node in iterative depth-first preorder over directed edges, descending into the smallest-numbered neighbor first and reporting each node's depth.",
  id: "graph/depth-first-traversal",
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
      description: "Nodes in preorder visit sequence.",
      id: "visitOrder",
      kind: "stringList",
      label: "Visit order",
    },
    {
      description: "Traversal depth of each visited node from the start node.",
      id: "depths",
      kind: "object",
      label: "Depths",
    },
  ],
  title: "Graph Depth-First Traversal",
});

export const runDepthFirstTraversal = depthFirstTraversalTool.execute;
export default depthFirstTraversalTool;
