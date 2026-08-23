import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { normalizeGraph } from "../normalize-edge-list/tool.js";

export type TopologicalSortInput = {
  readonly graph: Record<string, unknown>;
};

export type TopologicalSortOutput = {
  readonly order: readonly string[];
};

const compareStrings = (left: string, right: string): number =>
  left < right ? -1 : left > right ? 1 : 0;

export const topologicalSortExample = {
  input: { graph: { a: ["c"], b: ["c"], c: [] } },
  output: { order: ["a", "b", "c"] },
} satisfies ToolExample<TopologicalSortInput, TopologicalSortOutput>;

export const calculateTopologicalSort = (
  input: TopologicalSortInput,
): TopologicalSortOutput => {
  const graph = normalizeGraph(input.graph, "graph", true);
  if (graph.nodes.length === 0)
    return simpleError(
      "graph",
      "Provide at least one node.",
      "insufficient_nodes",
    );
  const heap: string[] = [];
  const swap = (a: number, b: number): void => {
    const held = heap[a]!;
    heap[a] = heap[b]!;
    heap[b] = held;
  };
  const pushHeap = (node: string): void => {
    heap.push(node);
    let index = heap.length - 1;
    while (index > 0) {
      const parent = (index - 1) >> 1;
      if (compareStrings(heap[parent]!, heap[index]!) <= 0) break;
      swap(parent, index);
      index = parent;
    }
  };
  const popHeap = (): string => {
    const top = heap[0]!;
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      let index = 0;
      for (;;) {
        const left = 2 * index + 1;
        const right = left + 1;
        let smallest = index;
        if (
          left < heap.length &&
          compareStrings(heap[left]!, heap[smallest]!) < 0
        )
          smallest = left;
        if (
          right < heap.length &&
          compareStrings(heap[right]!, heap[smallest]!) < 0
        )
          smallest = right;
        if (smallest === index) break;
        swap(index, smallest);
        index = smallest;
      }
    }
    return top;
  };
  const indegree = new Map<string, number>(
    graph.nodes.map((node) => [node, 0]),
  );
  for (const [, target] of graph.edges)
    indegree.set(target, indegree.get(target)! + 1);
  for (const node of graph.nodes) if (indegree.get(node) === 0) pushHeap(node);
  const order: string[] = [];
  while (heap.length > 0) {
    const node = popHeap();
    order.push(node);
    for (const target of graph.adjacency.get(node) ?? []) {
      const remaining = indegree.get(target)! - 1;
      indegree.set(target, remaining);
      if (remaining === 0) pushHeap(target);
    }
  }
  if (order.length < graph.nodes.length)
    return simpleError(
      "graph",
      "The graph contains at least one cycle; no topological order exists.",
      "cyclic_graph",
    );
  return { order };
};

export const topologicalSortTool = createSimpleTool({
  calculate: (input) =>
    calculateTopologicalSort({
      graph: input.graph as Record<string, unknown>,
    }),
  description:
    "Order the nodes of a directed acyclic graph with Kahn's algorithm, always emitting the lexicographically smallest available node first.",
  id: "graph/topological-sort",
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
        "Nodes ordered so every edge points from earlier to later entries.",
      id: "order",
      kind: "stringList",
      label: "Topological order",
    },
  ],
  title: "Graph Topological Sort",
});

export const runTopologicalSort = topologicalSortTool.execute;
export default topologicalSortTool;
