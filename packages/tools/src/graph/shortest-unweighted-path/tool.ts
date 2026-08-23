import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { normalizeGraph } from "../normalize-edge-list/tool.js";

export type ShortestUnweightedPathInput = {
  readonly directed?: boolean;
  readonly graph: Record<string, unknown>;
  readonly source: string;
  readonly target: string;
};

export type ShortestUnweightedPathOutput = {
  readonly distance: number;
  readonly found: boolean;
  readonly path: readonly string[];
};

/**
 * Breadth-first search over an unweighted adjacency map: edges all have
 * weight 1, so BFS explores nodes in increasing hop order and the first
 * arrival at the target is a shortest path. Unreachable targets return
 * found=false with distance -1 and an empty path.
 */
export const calculateShortestUnweightedPath = (
  input: ShortestUnweightedPathInput,
): ShortestUnweightedPathOutput => {
  const graph = normalizeGraph(input.graph, "graph", input.directed ?? false);
  if (!graph.adjacency.has(input.source))
    simpleError(
      "source",
      `Node "${input.source}" is not part of the graph.`,
      "unknown_node",
    );
  if (!graph.adjacency.has(input.target))
    simpleError(
      "target",
      `Node "${input.target}" is not part of the graph.`,
      "unknown_node",
    );
  const parents = new Map<string, string | null>([[input.source, null]]);
  const queue = [input.source];
  for (let head = 0; head < queue.length; head += 1) {
    const current = queue[head]!;
    if (current === input.target) break;
    for (const neighbor of graph.adjacency.get(current) ?? [])
      if (!parents.has(neighbor)) {
        parents.set(neighbor, current);
        queue.push(neighbor);
      }
  }
  if (!parents.has(input.target))
    return { distance: -1, found: false, path: [] };
  const path: string[] = [];
  let step: string | null = input.target;
  while (step !== null) {
    path.unshift(step);
    step = parents.get(step) ?? null;
  }
  return { distance: path.length - 1, found: true, path };
};

export const shortestUnweightedPathExample = {
  input: {
    directed: false,
    graph: { a: ["b", "c"], b: ["d"], c: ["d"], d: [] },
    source: "a",
    target: "d",
  },
  output: { distance: 2, found: true, path: ["a", "b", "d"] },
} satisfies ToolExample<
  ShortestUnweightedPathInput,
  ShortestUnweightedPathOutput
>;

export const shortestUnweightedPathTool = createSimpleTool({
  id: "graph/shortest-unweighted-path",
  title: "Shortest Unweighted Path Finder",
  description:
    "Breadth-first shortest path between two nodes of an unweighted graph given as an adjacency map; reports the hop count and node sequence, or no path.",
  inputs: [
    {
      description: "Adjacency object mapping node names to neighbor arrays.",
      id: "graph",
      kind: "object",
      label: "Graph",
    },
    {
      description: "Node where the search starts.",
      id: "source",
      kind: "string",
      label: "Source",
    },
    {
      description: "Node to reach.",
      id: "target",
      kind: "string",
      label: "Target",
    },
    {
      default: false,
      description: "Treat edges as directed when true; undirected by default.",
      id: "directed",
      kind: "boolean",
      label: "Directed",
    },
  ],
  outputs: [
    {
      description: "Edge count of the shortest path; -1 when unreachable.",
      id: "distance",
      kind: "integer",
      label: "Distance",
    },
    {
      description: "True when the target is reachable from the source.",
      id: "found",
      kind: "boolean",
      label: "Found",
    },
    {
      description: "Nodes along the discovered shortest path, source first.",
      id: "path",
      kind: "stringList",
      label: "Path",
    },
  ],
  calculate: (input) =>
    calculateShortestUnweightedPath({
      directed: input.directed as boolean,
      graph: input.graph as Record<string, unknown>,
      source: input.source as string,
      target: input.target as string,
    }),
});

export const runShortestUnweightedPath = shortestUnweightedPathTool.execute;
export default shortestUnweightedPathTool;
