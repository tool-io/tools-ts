import { simpleError } from "../core/simple.js";
import { calculateConnectedComponents } from "../graph/connected-components/tool.js";
import type { GeneratorRandom } from "./generator-random.js";

export type SimpleEdge = readonly [number, number];
export type WeightedEdge = readonly [number, number, number];
export const nodeCountSchema = {
  description: "Number of vertices, labeled 0 through nodeCount - 1.",
  maximum: 32,
  minimum: 2,
  type: "integer",
} as const;
export const edgeCountSchema = {
  description:
    "Exact number of generated edges; feasibility is checked against the selected construction.",
  maximum: 496,
  minimum: 0,
  type: "integer",
} as const;
export const graphEdgesSchema = {
  items: {
    items: { minimum: 0, type: "integer" },
    maxItems: 2,
    minItems: 2,
    type: "array",
  },
  maxItems: 496,
  type: "array",
} as const;
export const nodeListSchema = {
  items: { minimum: 0, type: "integer" },
  maxItems: 32,
  type: "array",
} as const;
export const weightedEdgesSchema = {
  items: {
    items: { type: "integer" },
    maxItems: 3,
    minItems: 3,
    type: "array",
  },
  maxItems: 496,
  type: "array",
} as const;
export const weightSchema = {
  description:
    "Safe-integer edge weight in caller-selected consistent units; the inclusive sampling range must also have a safe-integer width.",
  type: "integer",
} as const;

export const graphNodes = (nodeCount: number): number[] =>
  Array.from({ length: nodeCount }, (_, i) => i);
export const possibleSimpleEdges = (nodeCount: number): SimpleEdge[] =>
  graphNodes(nodeCount).flatMap((a) =>
    graphNodes(nodeCount)
      .slice(a + 1)
      .map((b): SimpleEdge => [a, b]),
  );
export const canonicalEdges = (edges: readonly SimpleEdge[]): SimpleEdge[] =>
  edges
    .map(([a, b]): SimpleEdge => (a < b ? [a, b] : [b, a]))
    .sort((a, b) => a[0] - b[0] || a[1] - b[1]);
export const graphAdjacency = (
  nodeCount: number,
  edges: readonly SimpleEdge[],
): Record<string, string[]> => {
  const result = Object.fromEntries(
    graphNodes(nodeCount).map((node) => [String(node), [] as string[]]),
  );
  for (const [a, b] of edges) {
    result[String(a)].push(String(b));
    result[String(b)].push(String(a));
  }
  return result;
};

/** A random recursive tree on a shuffled order, then a finite shuffled edge subset. */
export const connectedSimpleEdges = (
  nodeCount: number,
  edgeCount: number,
  random: GeneratorRandom,
): SimpleEdge[] => {
  if (
    edgeCount < nodeCount - 1 ||
    edgeCount > (nodeCount * (nodeCount - 1)) / 2
  )
    simpleError(
      "edgeCount",
      "A connected simple graph needs nodeCount - 1 through nodeCount × (nodeCount - 1) / 2 edges.",
      "infeasible_edge_count",
    );
  const order = random.shuffle(graphNodes(nodeCount));
  const tree = order
    .slice(1)
    .map((node, i): SimpleEdge => [node, order[random.integer(0, i)]]);
  return extendSimpleEdges(nodeCount, edgeCount, tree, random);
};
export const extendSimpleEdges = (
  nodeCount: number,
  edgeCount: number,
  mandatory: readonly SimpleEdge[],
  random: GeneratorRandom,
): SimpleEdge[] => {
  const required = canonicalEdges(mandatory);
  const keys = new Set(required.map(([a, b]) => `${a},${b}`));
  if (keys.size !== required.length)
    throw new Error(
      "A simple-graph construction supplied repeated mandatory edges.",
    );
  const remaining = possibleSimpleEdges(nodeCount).filter(
    ([a, b]) => !keys.has(`${a},${b}`),
  );
  const needed = edgeCount - required.length;
  if (needed < 0 || needed > remaining.length)
    simpleError(
      "edgeCount",
      "The requested edge count cannot satisfy the planted graph structure.",
      "infeasible_edge_count",
    );
  return canonicalEdges([
    ...required,
    ...random.shuffle(remaining).slice(0, needed),
  ]);
};
export const verifiedComponentCount = (
  nodeCount: number,
  edges: readonly SimpleEdge[],
): number =>
  calculateConnectedComponents({ graph: graphAdjacency(nodeCount, edges) })
    .table.componentCount;
