import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PinsageNeighbor = {
  readonly node: number;
  readonly visits: number;
};
export type PinsageNeighbors = {
  readonly neighbors: readonly PinsageNeighbor[];
};
export type PinsageAggregation = {
  readonly embedding: readonly number[];
  readonly neighborAggregate: readonly number[];
  readonly normalizedVisitWeights: readonly {
    readonly node: number;
    readonly weight: number;
  }[];
  readonly target: number;
};

const validNeighbors = (
  value: unknown,
  nodeCount: number,
): value is PinsageNeighbors =>
  typeof value === "object" &&
  value !== null &&
  "neighbors" in value &&
  Array.isArray(value.neighbors) &&
  value.neighbors.length > 0 &&
  value.neighbors.length <= 100_000 &&
  value.neighbors.every(
    (neighbor) =>
      typeof neighbor === "object" &&
      neighbor !== null &&
      "node" in neighbor &&
      Number.isSafeInteger(neighbor.node) &&
      Number(neighbor.node) >= 0 &&
      Number(neighbor.node) < nodeCount &&
      "visits" in neighbor &&
      typeof neighbor.visits === "number" &&
      Number.isFinite(neighbor.visits) &&
      neighbor.visits > 0,
  );

export const demonstratePinsageAggregation = (
  features: readonly (readonly number[])[],
  neighbors: PinsageNeighbors,
  target: number,
  selfWeight: number,
): PinsageAggregation | null => {
  const visitTotal = neighbors.neighbors.reduce(
    (sum, neighbor) => sum + neighbor.visits,
    0,
  );
  if (!Number.isFinite(visitTotal) || visitTotal <= 0) return null;
  const neighborAggregate = (features[0] ?? []).map((_, dimension) =>
    neighbors.neighbors.reduce(
      (sum, neighbor) =>
        sum +
        (neighbor.visits / visitTotal) *
          (features[neighbor.node]?.[dimension] ?? 0),
      0,
    ),
  );
  const combined = neighborAggregate.map(
    (value, dimension) =>
      value + selfWeight * (features[target]?.[dimension] ?? 0),
  );
  const norm = combined.reduce((result, value) => Math.hypot(result, value), 0);
  if (!Number.isFinite(norm) || norm === 0) return null;
  return {
    embedding: combined.map((value) => Number((value / norm).toPrecision(10))),
    neighborAggregate: neighborAggregate.map((value) =>
      Number(value.toPrecision(10)),
    ),
    normalizedVisitWeights: neighbors.neighbors.map((neighbor) => ({
      node: neighbor.node,
      weight: Number((neighbor.visits / visitTotal).toPrecision(10)),
    })),
    target,
  };
};

export const pinsageAggregationExample = {
  input: {
    features: [
      [1, 0],
      [0, 1],
      [1, 1],
    ],
    neighbors: {
      neighbors: [
        { node: 1, visits: 3 },
        { node: 2, visits: 1 },
      ],
    },
    selfWeight: 1,
    target: 0,
  },
  output: {
    aggregation: {
      embedding: [0.7808688094, 0.6246950476],
      neighborAggregate: [0.25, 1],
      normalizedVisitWeights: [
        { node: 1, weight: 0.75 },
        { node: 2, weight: 0.25 },
      ],
      target: 0,
    },
  },
} satisfies ToolExample<
  {
    readonly features: readonly (readonly number[])[];
    readonly neighbors: PinsageNeighbors;
    readonly selfWeight: number;
    readonly target: number;
  },
  { readonly aggregation: PinsageAggregation }
>;

export const pinsageAggregationTool = createSimpleTool({
  id: "graph/pinsage-aggregation",
  title: "PinSage Aggregation Demonstrator",
  description:
    "Demonstrate PinSage-style importance pooling from random-walk visit counts and node features.",
  inputs: [
    {
      format: "matrix/node-features",
      id: "features",
      kind: "matrix",
      label: "Node features",
    },
    {
      format: "graph/visited-neighbors",
      id: "neighbors",
      kind: "object",
      label: "Sampled neighbors",
    },
    { id: "target", kind: "integer", label: "Target node", minimum: 0 },
    { id: "selfWeight", kind: "number", label: "Self weight", minimum: 0 },
  ],
  outputs: [
    {
      format: "graph/pinsage-aggregation",
      id: "aggregation",
      kind: "object",
      label: "PinSage aggregation",
    },
  ],
  calculate: (input) => {
    const features = input.features as number[][];
    if (
      (input.target as number) >= features.length ||
      !validNeighbors(input.neighbors, features.length)
    )
      return simpleError(
        "neighbors",
        "Enter valid neighbor indices and positive visit counts.",
      );
    const aggregation = demonstratePinsageAggregation(
      features,
      input.neighbors,
      input.target as number,
      input.selfWeight as number,
    );
    if (!aggregation)
      return simpleError(
        "features",
        "Features must produce a nonzero finite embedding.",
      );
    return { aggregation };
  },
});
export const runPinsageAggregation = pinsageAggregationTool.execute;
export default pinsageAggregationTool;
