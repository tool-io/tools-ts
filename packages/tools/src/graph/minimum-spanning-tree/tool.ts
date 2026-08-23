import { resourceLimitIssue } from "../../core/limits.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MinimumSpanningTreeInput = {
  readonly graph: Record<string, unknown>;
};

export type MinimumSpanningTreeOutput = {
  readonly componentCount: number;
  readonly edgeCount: number;
  readonly totalWeight: number;
  readonly treeEdges: readonly string[];
};

type Edge = { left: string; right: string; weight: number };

const compareStrings = (left: string, right: string): number =>
  left < right ? -1 : left > right ? 1 : 0;

const normalizeWeightedGraph = (
  graph: Record<string, unknown>,
  field: string,
): { edges: Edge[]; nodes: Set<string> } => {
  const rawEdges = graph.edges;
  if (!Array.isArray(rawEdges))
    simpleError(
      field,
      'The graph needs an "edges" array of [from, to, weight] triples.',
      "invalid_graph",
    );
  const entries = rawEdges as unknown[];
  const limitIssue = resourceLimitIssue(
    "graphEdges",
    entries.length,
    `${field}.edges`,
  );
  if (limitIssue) simpleError(field, limitIssue.message, limitIssue.code);
  const nodes = new Set<string>();
  const declaredNodes = graph.nodes;
  if (declaredNodes !== undefined && declaredNodes !== null) {
    if (!Array.isArray(declaredNodes))
      simpleError(field, '"nodes" must be an array of names.', "invalid_graph");
    for (const node of declaredNodes as unknown[]) {
      if (typeof node !== "string")
        simpleError(field, '"nodes" entries must be strings.', "invalid_graph");
      nodes.add(node as string);
    }
  }
  const edges: Edge[] = [];
  for (const entry of entries) {
    if (!Array.isArray(entry) || entry.length !== 3)
      simpleError(
        field,
        "Every edge must be a [from, to, weight] triple with a finite numeric weight.",
        "invalid_graph",
      );
    const [left, right, weight] = entry as unknown[];
    if (
      typeof left !== "string" ||
      typeof right !== "string" ||
      left === "" ||
      right === "" ||
      typeof weight !== "number" ||
      !Number.isFinite(weight)
    )
      simpleError(
        field,
        "Every edge must be a [from, to, weight] triple with a finite numeric weight.",
        "invalid_graph",
      );
    // Self-loops can never join components; they are ignored.
    if (left === right) continue;
    nodes.add(left as string);
    nodes.add(right as string);
    edges.push({
      left: left as string,
      right: right as string,
      weight: weight as number,
    });
  }
  const nodeLimitIssue = resourceLimitIssue(
    "graphNodes",
    nodes.size,
    `${field}.nodes`,
  );
  if (nodeLimitIssue)
    simpleError(field, nodeLimitIssue.message, nodeLimitIssue.code);
  return { edges, nodes };
};

/**
 * Builds a minimum spanning tree over the weighted edge list with
 * Kruskal's algorithm: edges sort by weight then endpoint names, and a
 * union-find merges components. Disconnected inputs yield a minimum
 * spanning forest; isolated nodes may be declared in "nodes".
 */
export const calculateMinimumSpanningTree = (
  input: MinimumSpanningTreeInput,
): MinimumSpanningTreeOutput => {
  const { edges, nodes } = normalizeWeightedGraph(input.graph, "graph");
  if (nodes.size === 0)
    simpleError(
      "graph",
      "Provide at least one node through edges or the nodes list.",
      "insufficient_nodes",
    );
  const sorted = [...edges].sort(
    (left, right) =>
      left.weight - right.weight ||
      compareStrings(left.left, right.left) ||
      compareStrings(left.right, right.right),
  );
  const parent = new Map<string, string>(
    [...nodes].map((node) => [node, node]),
  );
  const findRoot = (node: string): string => {
    let root = node;
    while (parent.get(root) !== root) root = parent.get(root)!;
    while (parent.get(node) !== root) {
      const next = parent.get(node)!;
      parent.set(node, root);
      node = next;
    }
    return root;
  };
  const treeEdges: string[] = [];
  let totalWeight = 0;
  let componentCount = nodes.size;
  for (const edge of sorted) {
    const leftRoot = findRoot(edge.left);
    const rightRoot = findRoot(edge.right);
    if (leftRoot === rightRoot) continue;
    if (leftRoot < rightRoot) parent.set(rightRoot, leftRoot);
    else parent.set(leftRoot, rightRoot);
    componentCount -= 1;
    treeEdges.push([edge.left, edge.right].sort(compareStrings).join("|"));
    totalWeight += edge.weight;
  }
  return {
    componentCount,
    edgeCount: treeEdges.length,
    totalWeight: Number(totalWeight.toPrecision(12)),
    treeEdges,
  };
};

export const minimumSpanningTreeExample = {
  input: {
    graph: {
      edges: [
        ["a", "b", 1],
        ["b", "c", 3],
        ["a", "c", 2],
      ],
    },
  },
  output: {
    componentCount: 1,
    edgeCount: 2,
    totalWeight: 3,
    treeEdges: ["a|b", "a|c"],
  },
} satisfies ToolExample<MinimumSpanningTreeInput, MinimumSpanningTreeOutput>;

export const minimumSpanningTreeTool = createSimpleTool({
  calculate: (input) =>
    calculateMinimumSpanningTree({
      graph: input.graph as Record<string, unknown>,
    }),
  description:
    "Find a minimum spanning tree of an edge-weighted graph using Kruskal's algorithm; disconnected graphs get a minimum spanning forest.",
  id: "graph/minimum-spanning-tree",
  inputs: [
    {
      description:
        'Object with an "edges" array of [from, to, weight] triples plus an optional "nodes" array naming isolated vertices.',
      id: "graph",
      kind: "object",
      label: "Weighted graph",
    },
  ],
  outputs: [
    {
      description:
        'Chosen edges as "u|v" name pairs with the lexicographically smaller endpoint first.',
      id: "treeEdges",
      kind: "stringList",
      label: "Tree edges",
    },
    {
      description: "Sum of chosen edge weights.",
      id: "totalWeight",
      kind: "number",
      label: "Total weight",
    },
    {
      description: "Number of chosen edges.",
      id: "edgeCount",
      kind: "integer",
      label: "Edge count",
    },
    {
      description:
        "Remaining component count after merging (one for a connected graph).",
      id: "componentCount",
      kind: "integer",
      label: "Component count",
    },
  ],
  title: "Minimum Spanning Tree Finder",
});
export const runMinimumSpanningTree = minimumSpanningTreeTool.execute;
export default minimumSpanningTreeTool;
