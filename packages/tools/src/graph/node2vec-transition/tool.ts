import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Node2vecCandidate = {
  readonly edgeWeight: number;
  readonly node: string;
  readonly relation: "in" | "out" | "return";
};
export type Node2vecCandidates = {
  readonly candidates: readonly Node2vecCandidate[];
};
export type Node2vecTransition = {
  readonly node: string;
  readonly probability: number;
  readonly relation: Node2vecCandidate["relation"];
};

const isCandidates = (value: unknown): value is Node2vecCandidates =>
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
      candidate.node.length > 0 &&
      "edgeWeight" in candidate &&
      typeof candidate.edgeWeight === "number" &&
      candidate.edgeWeight > 0 &&
      "relation" in candidate &&
      ["return", "in", "out"].includes(String(candidate.relation)),
  );

export const calculateNode2vecTransitions = (
  input: Node2vecCandidates,
  returnParameter: number,
  inOutParameter: number,
): Node2vecTransition[] => {
  const weighted = input.candidates.map((candidate) => ({
    ...candidate,
    weight:
      candidate.edgeWeight *
      (candidate.relation === "return"
        ? 1 / returnParameter
        : candidate.relation === "out"
          ? 1 / inOutParameter
          : 1),
  }));
  const total = weighted.reduce((sum, candidate) => sum + candidate.weight, 0);
  return weighted.map(({ node, relation, weight }) => ({
    node,
    probability: Number((weight / total).toPrecision(10)),
    relation,
  }));
};

export const node2vecTransitionExample = {
  input: {
    candidates: {
      candidates: [
        { edgeWeight: 1, node: "a", relation: "return" },
        { edgeWeight: 2, node: "b", relation: "in" },
        { edgeWeight: 1, node: "c", relation: "out" },
      ],
    },
    inOutParameter: 2,
    returnParameter: 1,
  },
  output: {
    probabilities: {
      values: [
        { node: "a", probability: 0.2857142857, relation: "return" },
        { node: "b", probability: 0.5714285714, relation: "in" },
        { node: "c", probability: 0.1428571429, relation: "out" },
      ],
    },
  },
} satisfies ToolExample<
  {
    readonly candidates: Node2vecCandidates;
    readonly inOutParameter: number;
    readonly returnParameter: number;
  },
  { readonly probabilities: { readonly values: readonly Node2vecTransition[] } }
>;

export const node2vecTransitionTool = createSimpleTool({
  id: "graph/node2vec-transition",
  title: "Node2vec Transition Demonstrator",
  description:
    "Calculate second-order node2vec transition probabilities from return, neighborhood, and outward candidates.",
  inputs: [
    {
      format: "graph/node2vec-candidates",
      id: "candidates",
      kind: "object",
      label: "Candidates",
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
  ],
  outputs: [
    {
      format: "graph/transition-probabilities",
      id: "probabilities",
      kind: "object",
      label: "Transition probabilities",
    },
  ],
  calculate: (input) => {
    if (!isCandidates(input.candidates))
      return simpleError(
        "candidates",
        "Enter at least one valid transition candidate.",
      );
    return {
      probabilities: {
        values: calculateNode2vecTransitions(
          input.candidates,
          input.returnParameter as number,
          input.inOutParameter as number,
        ),
      },
    };
  },
});

export const runNode2vecTransition = node2vecTransitionTool.execute;
export default node2vecTransitionTool;
