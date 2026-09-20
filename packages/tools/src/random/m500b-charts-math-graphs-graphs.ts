import { simpleError } from "../core/simple.js";
import type { GeneratorRandom } from "./generator-random.js";
import { calculateDegrees } from "../graph/degrees/tool.js";
import { calculateConnectedComponents } from "../graph/connected-components/tool.js";
import { distinct } from "./m500b-charts-math-graphs-support.js";
export type Edge = readonly [string, string];
export const edgeKey = (a: string, b: string, directed = false): string =>
  JSON.stringify(directed || a < b ? [a, b] : [b, a]);
export const adjacency = (
  nodes: readonly string[],
  edges: readonly Edge[],
  directed = false,
): Record<string, string[]> => {
  const graph = Object.fromEntries(nodes.map((n) => [n, [] as string[]]));
  for (const [a, b] of edges) {
    graph[a].push(b);
    if (!directed) graph[b].push(a);
  }
  return graph;
};
export const validateGraph = (
  nodes: readonly string[],
  edges: readonly Edge[],
  directed = false,
): void => {
  distinct(nodes, "nodes");
  const seen = new Set<string>();
  for (const [a, b] of edges) {
    if (a === b || !nodes.includes(a) || !nodes.includes(b))
      simpleError(
        "edges",
        "Endpoints must be distinct declared nodes.",
        "invalid_edge",
      );
    const key = edgeKey(a, b, directed);
    if (seen.has(key))
      simpleError("edges", "Simple edges must be distinct.", "duplicate_edges");
    seen.add(key);
  }
};
export const recursiveTree = (
  nodes: readonly string[],
  random: GeneratorRandom,
): Edge[] => {
  distinct(nodes, "nodes");
  const edges: Edge[] = [];
  for (let i = 1; i < nodes.length; i++)
    edges.push([nodes[random.integer(0, i - 1)], nodes[i]]);
  if (nodes.length === 1) random.unit();
  return edges;
};
export const components = (
  nodes: readonly string[],
  edges: readonly Edge[],
): number =>
  nodes.length === 0
    ? 0
    : calculateConnectedComponents({ graph: adjacency(nodes, edges) }).table
        .componentCount;
export const degrees = (
  nodes: readonly string[],
  edges: readonly Edge[],
): number[] => {
  const table = calculateDegrees({ graph: adjacency(nodes, edges) }).table;
  return nodes.map((n) => {
    const i = table.nodes.indexOf(n);
    if (i < 0) throw new Error("Degree core omitted a declared node");
    return table.degree[i];
  });
};
