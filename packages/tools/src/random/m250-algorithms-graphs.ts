import type { GeneratorRandom } from "./generator-random.js";
import {
  arraySchema,
  integerSchema,
  labelSchema,
  objectSchema,
} from "./m250-algorithms-common.js";

export type AlgorithmEdge = readonly [number, number];
export const algorithmEdgesSchema = arraySchema(
  arraySchema(integerSchema(0, 11), 2, 2),
  144,
);
export const algorithmNodesSchema = arraySchema(labelSchema, 12, 1);
export const algorithmAdjacencySchema = {
  type: "object",
  additionalProperties: arraySchema(labelSchema, 24),
} as const;
export const algorithmTraversalSchema = objectSchema({
  visitOrder: algorithmNodesSchema,
  depths: { type: "object", additionalProperties: integerSchema(0, 11) },
});
export const algorithmNodeNames = (count: number): string[] =>
  Array.from({ length: count }, (_, i) => `n${String(i).padStart(2, "0")}`);
export const algorithmCanonicalEdges = (
  edges: readonly AlgorithmEdge[],
): AlgorithmEdge[] =>
  edges
    .map(([a, b]): AlgorithmEdge => (a < b ? [a, b] : [b, a]))
    .sort((a, b) => a[0] - b[0] || a[1] - b[1]);
export const algorithmAdjacency = (
  nodes: readonly string[],
  edges: readonly AlgorithmEdge[],
  directed: boolean,
  duplicates = false,
): Record<string, string[]> => {
  const graph: Record<string, string[]> = Object.fromEntries(
    nodes.map((node) => [node, []]),
  );
  for (const [a, b] of edges) {
    graph[nodes[a]].push(nodes[b]);
    if (duplicates) graph[nodes[a]].push(nodes[b]);
    if (!directed && a !== b) graph[nodes[b]].push(nodes[a]);
  }
  return graph;
};
export const algorithmRandomEdges = (
  count: number,
  probability: number,
  directed: boolean,
  loops: boolean,
  random: GeneratorRandom,
): AlgorithmEdge[] => {
  const edges: AlgorithmEdge[] = [];
  for (let a = 0; a < count; a += 1)
    for (let b = directed ? 0 : a; b < count; b += 1) {
      if (!loops && a === b) continue;
      if (random.unit() < probability) edges.push([a, b]);
    }
  return edges;
};
