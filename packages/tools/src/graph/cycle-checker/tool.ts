import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { normalizeGraph } from "../normalize-edge-list/tool.js";

export type CycleCheckerInput = {
  readonly graph: Record<string, unknown>;
};

export type CycleCheckerOutput = {
  readonly hasCycle: boolean;
  readonly resolvedCount: number;
  readonly unresolvedNodes: readonly string[];
};

export const cycleCheckerExample = {
  input: { graph: { a: ["b"], b: ["c"], c: ["a"] } },
  output: {
    hasCycle: true,
    resolvedCount: 0,
    unresolvedNodes: ["a", "b", "c"],
  },
} satisfies ToolExample<CycleCheckerInput, CycleCheckerOutput>;

export const calculateCycleChecker = (
  input: CycleCheckerInput,
): CycleCheckerOutput => {
  const graph = normalizeGraph(input.graph, "graph", true);
  if (graph.nodes.length === 0)
    return simpleError(
      "graph",
      "Provide at least one node.",
      "insufficient_nodes",
    );
  const indegree = new Map<string, number>(
    graph.nodes.map((node) => [node, 0]),
  );
  for (const [, target] of graph.edges)
    indegree.set(target, indegree.get(target)! + 1);
  const queue = graph.nodes.filter((node) => indegree.get(node) === 0);
  let resolvedCount = 0;
  for (let head = 0; head < queue.length; head += 1) {
    const node = queue[head]!;
    resolvedCount += 1;
    for (const target of graph.adjacency.get(node) ?? []) {
      const remaining = indegree.get(target)! - 1;
      indegree.set(target, remaining);
      if (remaining === 0) queue.push(target);
    }
  }
  const unresolvedNodes = graph.nodes.filter((node) => indegree.get(node)! > 0);
  return {
    hasCycle: unresolvedNodes.length > 0,
    resolvedCount,
    unresolvedNodes,
  };
};

export const cycleCheckerTool = createSimpleTool({
  calculate: (input) =>
    calculateCycleChecker({ graph: input.graph as Record<string, unknown> }),
  description:
    "Detect whether a directed graph contains a cycle using Kahn's algorithm and report which nodes could not be resolved.",
  id: "graph/cycle-checker",
  inputs: [
    {
      description:
        "Adjacency map from node name to an array of neighbor names; edges follow the listed direction.",
      id: "graph",
      kind: "object",
      label: "Adjacency map",
    },
  ],
  outputs: [
    {
      description:
        "True when at least one cycle (including self-loops) exists.",
      id: "hasCycle",
      kind: "boolean",
      label: "Has cycle",
    },
    {
      description: "Nodes removable by repeatedly peeling zero-indegree nodes.",
      id: "resolvedCount",
      kind: "integer",
      label: "Resolved nodes",
    },
    {
      description:
        "Sorted nodes on or reachable from a cycle that remain unprocessed.",
      id: "unresolvedNodes",
      kind: "stringList",
      label: "Unresolved nodes",
    },
  ],
  title: "Graph Cycle Checker",
});

export const runCycleChecker = cycleCheckerTool.execute;
export default cycleCheckerTool;
