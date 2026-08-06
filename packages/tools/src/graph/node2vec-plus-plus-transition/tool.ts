import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Node2vecPlusPlusCandidate = {
  readonly connectedToPrevious: boolean;
  readonly edgeWeight: number;
  readonly isReturn: boolean;
  readonly node: string;
};
export type Node2vecPlusPlusCandidates = {
  readonly candidates: readonly Node2vecPlusPlusCandidate[];
};
export type WeightedTransition = {
  readonly node: string;
  readonly probability: number;
};

const isCandidates = (value: unknown): value is Node2vecPlusPlusCandidates =>
  typeof value === "object" &&
  value !== null &&
  "candidates" in value &&
  Array.isArray(value.candidates) &&
  value.candidates.length > 0 &&
  value.candidates.every(
    (candidate) =>
      typeof candidate === "object" &&
      candidate !== null &&
      "node" in candidate &&
      typeof candidate.node === "string" &&
      "edgeWeight" in candidate &&
      typeof candidate.edgeWeight === "number" &&
      candidate.edgeWeight > 0 &&
      "isReturn" in candidate &&
      typeof candidate.isReturn === "boolean" &&
      "connectedToPrevious" in candidate &&
      typeof candidate.connectedToPrevious === "boolean",
  );

export const calculateNode2vecPlusPlusTransitions = (
  input: Node2vecPlusPlusCandidates,
  p: number,
  q: number,
  threshold: number,
): WeightedTransition[] => {
  const weighted = input.candidates.map((candidate) => {
    const stronglyConnected =
      candidate.connectedToPrevious && candidate.edgeWeight >= threshold;
    const bias = candidate.isReturn ? 1 / p : stronglyConnected ? 1 : 1 / q;
    return { node: candidate.node, weight: candidate.edgeWeight * bias };
  });
  const total = weighted.reduce((sum, candidate) => sum + candidate.weight, 0);
  return weighted.map(({ node, weight }) => ({
    node,
    probability: Number((weight / total).toPrecision(10)),
  }));
};

export const node2vecPlusPlusExample = {
  input: {
    candidates: {
      candidates: [
        { connectedToPrevious: true, edgeWeight: 1, isReturn: true, node: "a" },
        {
          connectedToPrevious: true,
          edgeWeight: 2,
          isReturn: false,
          node: "b",
        },
        {
          connectedToPrevious: false,
          edgeWeight: 0.5,
          isReturn: false,
          node: "c",
        },
      ],
    },
    inOutParameter: 2,
    returnParameter: 1,
    threshold: 1,
  },
  output: {
    probabilities: {
      values: [
        { node: "a", probability: 0.3076923077 },
        { node: "b", probability: 0.6153846154 },
        { node: "c", probability: 0.07692307692 },
      ],
    },
  },
} satisfies ToolExample<
  {
    readonly candidates: Node2vecPlusPlusCandidates;
    readonly inOutParameter: number;
    readonly returnParameter: number;
    readonly threshold: number;
  },
  { readonly probabilities: { readonly values: readonly WeightedTransition[] } }
>;

export const node2vecPlusPlusTool = createSimpleTool({
  id: "graph/node2vec-plus-plus-transition",
  title: "Node2Vec++ Transition Demonstrator",
  description:
    "Demonstrate weighted node2vec-style transitions with a threshold for strong previous-node connections.",
  inputs: [
    {
      format: "graph/node2vec-plus-plus-candidates",
      id: "candidates",
      kind: "object",
      label: "Weighted candidates",
    },
    {
      id: "returnParameter",
      kind: "number",
      label: "Return parameter p",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "inOutParameter",
      kind: "number",
      label: "In-out parameter q",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "threshold",
      kind: "number",
      label: "Connection threshold",
      minimum: 0,
    },
  ],
  outputs: [
    {
      format: "graph/transition-probabilities",
      id: "probabilities",
      kind: "object",
      label: "Weighted transitions",
    },
  ],
  calculate: (input) => {
    if (!isCandidates(input.candidates))
      return simpleError(
        "candidates",
        "Enter at least one valid weighted candidate.",
      );
    return {
      probabilities: {
        values: calculateNode2vecPlusPlusTransitions(
          input.candidates,
          input.returnParameter as number,
          input.inOutParameter as number,
          input.threshold as number,
        ),
      },
    };
  },
});
export const runNode2vecPlusPlus = node2vecPlusPlusTool.execute;
export default node2vecPlusPlusTool;
