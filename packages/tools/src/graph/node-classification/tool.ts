import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NeighborScores = {
  readonly scores: readonly number[];
  readonly weight: number;
};
export type NeighborScoreSet = {
  readonly neighbors: readonly NeighborScores[];
};
export type NodeClassification = {
  readonly classScores: readonly number[];
  readonly predictedClass: number;
  readonly probabilities: readonly number[];
};

const validNeighbors = (
  value: unknown,
  dimensions: number,
): value is NeighborScoreSet =>
  typeof value === "object" &&
  value !== null &&
  "neighbors" in value &&
  Array.isArray(value.neighbors) &&
  value.neighbors.every(
    (neighbor) =>
      typeof neighbor === "object" &&
      neighbor !== null &&
      "scores" in neighbor &&
      Array.isArray(neighbor.scores) &&
      neighbor.scores.length === dimensions &&
      neighbor.scores.every(
        (score: unknown) => typeof score === "number" && Number.isFinite(score),
      ) &&
      "weight" in neighbor &&
      typeof neighbor.weight === "number" &&
      neighbor.weight >= 0,
  );

export const demonstrateNodeClassification = (
  ownScores: readonly number[],
  neighbors: NeighborScoreSet,
  selfWeight: number,
): NodeClassification => {
  const combined = ownScores.map(
    (score, classIndex) =>
      selfWeight * score +
      neighbors.neighbors.reduce(
        (sum, neighbor) =>
          sum + neighbor.weight * (neighbor.scores[classIndex] ?? 0),
        0,
      ),
  );
  const maximum = Math.max(...combined);
  const exponentials = combined.map((value) => Math.exp(value - maximum));
  const total = exponentials.reduce((sum, value) => sum + value, 0);
  const probabilities = exponentials.map((value) => value / total);
  return {
    classScores: combined.map((value) => Number(value.toPrecision(10))),
    predictedClass: probabilities.indexOf(Math.max(...probabilities)),
    probabilities: probabilities.map((value) => Number(value.toPrecision(10))),
  };
};

export const nodeClassificationExample = {
  input: {
    neighbors: {
      neighbors: [
        { scores: [0, 1, 0], weight: 2 },
        { scores: [0, 0, 1], weight: 1 },
      ],
    },
    ownScores: [1, 0, 0],
    selfWeight: 1,
  },
  output: {
    classification: {
      classScores: [1, 2, 1],
      predictedClass: 1,
      probabilities: [0.2119415576, 0.5761168848, 0.2119415576],
    },
  },
} satisfies ToolExample<
  {
    readonly neighbors: NeighborScoreSet;
    readonly ownScores: readonly number[];
    readonly selfWeight: number;
  },
  { readonly classification: NodeClassification }
>;

export const nodeClassificationTool = createSimpleTool({
  id: "graph/node-classification",
  title: "Node Classification Demonstrator",
  description:
    "Combine a node's class scores with weighted neighbor scores and predict a class.",
  inputs: [
    {
      format: "vector/class-scores",
      id: "ownScores",
      kind: "numberList",
      label: "Node scores",
    },
    {
      format: "graph/neighbor-scores",
      id: "neighbors",
      kind: "object",
      label: "Neighbor scores",
    },
    { id: "selfWeight", kind: "number", label: "Self weight", minimum: 0 },
  ],
  outputs: [
    {
      format: "classification/result",
      id: "classification",
      kind: "object",
      label: "Classification",
    },
  ],
  calculate: (input) => {
    const ownScores = input.ownScores as number[];
    if (
      ownScores.length < 2 ||
      !validNeighbors(input.neighbors, ownScores.length)
    )
      return simpleError(
        "neighbors",
        "Neighbor scores must match at least two node class scores.",
      );
    return {
      classification: demonstrateNodeClassification(
        ownScores,
        input.neighbors,
        input.selfWeight as number,
      ),
    };
  },
});
export const runNodeClassification = nodeClassificationTool.execute;
export default nodeClassificationTool;
