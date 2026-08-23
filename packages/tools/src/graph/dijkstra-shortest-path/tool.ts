import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DijkstraShortestPathInput = {
  readonly nodeCount: number;
  readonly edges?: readonly (readonly number[])[];
  readonly start?: number;
  readonly end?: number;
};

export type DijkstraShortestPathOutput = {
  readonly distances: readonly number[];
  readonly path: readonly number[];
  readonly totalCost: number;
};

/**
 * Dijkstra's algorithm with a binary min-heap; unreachable nodes report -1.
 */
export const calculateDijkstraShortestPath = (
  input: DijkstraShortestPathInput,
): DijkstraShortestPathOutput => {
  const nodeCount = input.nodeCount;
  if (!Number.isSafeInteger(nodeCount) || nodeCount < 1)
    simpleError(
      "nodeCount",
      "Graph must contain at least one node.",
      "empty_graph",
    );
  if (nodeCount > 10_000)
    simpleError(
      "nodeCount",
      "Graph exceeds the supported node limit.",
      "resource_limit_exceeded",
    );
  const start = input.start ?? 0;
  const end = input.end;
  for (const [label, value] of [
    ["start", start],
    ["end", end],
  ] as const) {
    if (value === undefined) continue;
    if (!Number.isSafeInteger(value) || value < 0 || value >= nodeCount)
      simpleError(
        label,
        `${label} must be an existing node index.`,
        "invalid_node",
      );
  }
  const adjacency: number[][][] = Array.from({ length: nodeCount }, () => []);
  for (const edge of input.edges ?? []) {
    if (edge.length !== 3)
      simpleError(
        "edges",
        "Each edge must be [from, to, weight].",
        "invalid_edge",
      );
    const [from, to, weight] = edge as [number, number, number];
    if (
      !Number.isSafeInteger(from) ||
      !Number.isSafeInteger(to) ||
      from < 0 ||
      to < 0 ||
      from >= nodeCount ||
      to >= nodeCount
    )
      simpleError(
        "edges",
        "Edge endpoints must reference existing nodes.",
        "invalid_edge",
      );
    if (!Number.isFinite(weight) || weight < 0)
      simpleError(
        "edges",
        "Edge weights must be non-negative.",
        "negative_weight",
      );
    adjacency[from].push([to, weight]);
  }
  const distances = new Array<number>(nodeCount).fill(Number.POSITIVE_INFINITY);
  const previous = new Array<number>(nodeCount).fill(-1);
  const settled = new Array<boolean>(nodeCount).fill(false);
  distances[start] = 0;
  const heap: [number, number][] = [[0, start]];
  const swap = (a: number, b: number) => {
    [heap[a], heap[b]] = [heap[b]!, heap[a]!];
  };
  const popMin = (): [number, number] | undefined => {
    if (heap.length === 0) return undefined;
    const top = heap[0]!;
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      let index = 0;
      for (;;) {
        const left = index * 2 + 1;
        const right = left + 1;
        let smallest = index;
        if (left < heap.length && heap[left]![0] < heap[smallest]![0])
          smallest = left;
        if (right < heap.length && heap[right]![0] < heap[smallest]![0])
          smallest = right;
        if (smallest === index) break;
        swap(index, smallest);
        index = smallest;
      }
    }
    return top;
  };
  const push = (entry: [number, number]) => {
    heap.push(entry);
    let index = heap.length - 1;
    while (index > 0) {
      const parent = (index - 1) >> 1;
      if (heap[parent]![0] <= heap[index]![0]) break;
      swap(index, parent);
      index = parent;
    }
  };
  for (;;) {
    const entry = popMin();
    if (entry === undefined) break;
    const [distance, node] = entry;
    if (settled[node]) continue;
    settled[node] = true;
    if (distance > distances[node]!) continue;
    for (const [neighbour, weight] of adjacency[node]!) {
      const candidate = distance + weight;
      if (candidate < distances[neighbour]!) {
        distances[neighbour] = candidate;
        previous[neighbour] = node;
        push([candidate, neighbour]);
      }
    }
  }
  const reachableDistances = distances.map((value) =>
    value === Number.POSITIVE_INFINITY ? -1 : value,
  );
  let path: number[] = [];
  let totalCost = -1;
  if (end !== undefined) {
    if (!settled[end])
      simpleError(
        "end",
        "The target node is unreachable from the start node.",
        "not_found",
      );
    totalCost = distances[end]!;
    path = [];
    for (let node = end; node !== -1; node = previous[node]!)
      path.unshift(node);
  }
  return { distances: reachableDistances, path, totalCost };
};

export const dijkstraShortestPathExample = {
  input: {
    nodeCount: 5,
    edges: [
      [0, 1, 10],
      [0, 2, 3],
      [1, 2, 1],
      [2, 1, 4],
      [1, 3, 2],
      [2, 3, 8],
      [3, 4, 7],
    ],
    start: 0,
    end: 4,
  },
  output: { distances: [0, 7, 3, 9, 16], path: [0, 2, 1, 3, 4], totalCost: 16 },
} satisfies ToolExample<DijkstraShortestPathInput, DijkstraShortestPathOutput>;

export const dijkstraShortestPathTool = createSimpleTool({
  id: "graph/dijkstra-shortest-path",
  title: "Dijkstra Shortest Path Calculator",
  description:
    "Find shortest paths from a start node over non-negative weighted directed edges given as [from, to, weight] rows.",
  inputs: [
    {
      description: "Number of nodes; nodes are indices 0..nodeCount-1.",
      id: "nodeCount",
      kind: "integer",
      label: "Node count",
    },
    {
      default: [],
      description:
        "Directed edges as [from, to, weight] rows with non-negative weights.",
      id: "edges",
      kind: "matrix",
      label: "Edges",
    },
    {
      default: 0,
      description: "Start node index.",
      id: "start",
      kind: "integer",
      label: "Start node",
    },
    {
      description: "Target node index; omit to compute distances only.",
      id: "end",
      kind: "integer",
      label: "End node",
      required: false,
    },
  ],
  outputs: [
    {
      description: "Shortest distance per node; -1 marks unreachable nodes.",
      id: "distances",
      kind: "numberList",
      label: "Distances",
    },
    {
      description:
        "Node indices along the shortest path from start to end; empty when end is omitted.",
      id: "path",
      kind: "numberList",
      label: "Path",
    },
    {
      description: "Total path cost; -1 when end is omitted.",
      id: "totalCost",
      kind: "number",
      label: "Total cost",
    },
  ],
  calculate: (input) =>
    calculateDijkstraShortestPath({
      edges: input.edges as readonly (readonly number[])[],
      end: input.end as number | undefined,
      nodeCount: input.nodeCount as number,
      start: input.start as number,
    }),
});

export const runDijkstraShortestPath = dijkstraShortestPathTool.execute;
export default dijkstraShortestPathTool;
