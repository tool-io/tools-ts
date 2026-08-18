import type { ToolExample } from "../../core/example.js";
import { resourceLimitIssue } from "../../core/limits.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NormalizedGraph = {
  readonly adjacency: ReadonlyMap<string, readonly string[]>;
  readonly directed: boolean;
  readonly edges: readonly (readonly [string, string])[];
  readonly nodes: readonly string[];
};

const compareStrings = (left: string, right: string): number =>
  left < right ? -1 : left > right ? 1 : 0;

/**
 * Validates an adjacency-map input (`field` names the offending input
 * field in thrown issues) and returns its canonical form: sorted unique
 * nodes, sorted deduplicated neighbor lists, and a deterministic edge
 * list. Undirected graphs store every pair smaller-id first exactly once;
 * directed graphs preserve listed direction once per unique pair.
 */
export const normalizeGraph = (
  value: unknown,
  field: string,
  directed: boolean,
): NormalizedGraph => {
  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value)
  )
    simpleError(
      field,
      "The graph must be an object mapping nodes to neighbor arrays.",
      "invalid_graph",
    );
  const source = value as Record<string, unknown>;
  const nodeSet = new Set<string>(Object.keys(source));
  for (const [node, targets] of Object.entries(source)) {
    if (!Array.isArray(targets))
      simpleError(
        field,
        `Neighbors of "${node}" must be an array.`,
        "invalid_graph",
      );
    for (const target of targets as unknown[])
      if (typeof target !== "string")
        simpleError(
          field,
          `Neighbors of "${node}" must be strings.`,
          "invalid_graph",
        );
      else nodeSet.add(target);
  }
  const limitIssue = resourceLimitIssue("graphNodes", nodeSet.size, field);
  if (limitIssue) simpleError(field, limitIssue.message, limitIssue.code);
  const nodes = [...nodeSet].sort(compareStrings);
  const neighborLists = new Map<string, readonly string[]>(
    nodes.map((node) => {
      const listed = source[node];
      const values = Array.isArray(listed)
        ? [...new Set(listed as string[])].sort(compareStrings)
        : [];
      return [node, values];
    }),
  );
  const seenEdges = new Set<string>();
  const edges: [string, string][] = [];
  for (const node of nodes) {
    for (const target of neighborLists.get(node)!) {
      let source = node;
      let destination = target;
      if (!directed && compareStrings(destination, source) < 0)
        [source, destination] = [destination, source];
      const key = `${source}\u0000${destination}`;
      if (seenEdges.has(key)) continue;
      seenEdges.add(key);
      edges.push(directed ? [node, target] : [source, destination]);
    }
  }
  const edgeIssue = resourceLimitIssue("graphEdges", edges.length, field);
  if (edgeIssue) simpleError(field, edgeIssue.message, edgeIssue.code);
  return { adjacency: neighborLists, directed, edges, nodes };
};

export type NormalizeEdgeListInput = {
  readonly directed?: boolean;
  readonly graph: Record<string, unknown>;
};

export type NormalizeEdgeListOutput = {
  readonly table: {
    readonly directed: boolean;
    readonly edges: [string, string][];
    readonly nodes: string[];
  };
};

export const normalizeEdgeListExample = {
  input: { directed: false, graph: { b: ["a"], a: ["b", "a"] } },
  output: {
    table: {
      directed: false,
      edges: [["a", "a"], ["a", "b"]],
      nodes: ["a", "b"],
    },
  },
} satisfies ToolExample<NormalizeEdgeListInput, NormalizeEdgeListOutput>;

export const calculateNormalizeEdgeList = (
  input: NormalizeEdgeListInput,
): NormalizeEdgeListOutput => {
  const graph = normalizeGraph(
    input.graph,
    "graph",
    input.directed ?? false,
  );
  return {
    table: {
      directed: graph.directed,
      edges: graph.edges.map(([source, target]) => [source, target]),
      nodes: [...graph.nodes],
    },
  };
};

export const normalizeEdgeListTool = createSimpleTool({
  calculate: (input) =>
    calculateNormalizeEdgeList(input as unknown as NormalizeEdgeListInput),
  description:
    "Canonicalize an adjacency map into sorted unique nodes and a deterministic deduplicated edge list.",
  id: "graph/normalize-edge-list",
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
        "Object with sorted node names, deduplicated edges as source-target pairs, and the directed flag.",
      id: "table",
      kind: "object",
      label: "Normalized graph",
    },
  ],
  title: "Graph Edge List Normalizer",
});
export const runNormalizeEdgeList = normalizeEdgeListTool.execute;
export default normalizeEdgeListTool;
