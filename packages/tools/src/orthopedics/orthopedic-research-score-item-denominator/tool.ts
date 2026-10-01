import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly weightedScores: readonly number[];
  readonly eligibleWeights: readonly number[];
  readonly missingWeights: readonly number[];
};
export type Output = {
  readonly weightedSum: number;
  readonly observedWeight: number;
  readonly totalWeight: number;
  readonly observedWeightedMean: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weightedScores: { type: "array", maxItems: 256, items: { type: "number" } },
    eligibleWeights: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    missingWeights: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["weightedScores", "eligibleWeights", "missingWeights"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weightedSum: { type: "number" },
    observedWeight: { type: "number" },
    totalWeight: { type: "number" },
    observedWeightedMean: { type: "number" },
  },
  required: [
    "weightedSum",
    "observedWeight",
    "totalWeight",
    "observedWeightedMean",
  ],
} as const;
/** Aggregate already weighted research item contributions with explicit observed and missing weight budgets, without a scale scoring key or clinical interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { weightedScores, eligibleWeights, missingWeights } = request;
  const compute = (): Output => {
    H.sameLength(weightedScores, eligibleWeights);
    H.domain(
      [...eligibleWeights, ...missingWeights].every((x) => x >= 0) &&
        eligibleWeights.reduce((a, b) => a + b, 0) > 0,
    );
    return {
      weightedSum: weightedScores.reduce((a, b) => a + b, 0),
      observedWeight: eligibleWeights.reduce((a, b) => a + b, 0),
      totalWeight:
        eligibleWeights.reduce((a, b) => a + b, 0) +
        missingWeights.reduce((a, b) => a + b, 0),
      observedWeightedMean:
        weightedScores.reduce((a, b) => a + b, 0) /
        eligibleWeights.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    weightedScores: [2, 6],
    eligibleWeights: [1, 2],
    missingWeights: [1],
  },
  output: {
    weightedSum: 8,
    observedWeight: 3,
    totalWeight: 4,
    observedWeightedMean: 2.6666666666666665,
  },
} satisfies ToolExample<Input, Output>;
export const orthopedicResearchScoreItemDenominatorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "orthopedics/orthopedic-research-score-item-denominator",
      title: "Orthopedic Research Score Item Denominator Tool",
      description:
        "Aggregate already weighted research item contributions with explicit observed and missing weight budgets, without a scale scoring key or clinical interpretation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          weightedScores: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          eligibleWeights: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          missingWeights: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
        },
        required: ["weightedScores", "eligibleWeights", "missingWeights"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          weightedSum: { type: "number" },
          observedWeight: { type: "number" },
          totalWeight: { type: "number" },
          observedWeightedMean: { type: "number" },
        },
        required: [
          "weightedSum",
          "observedWeight",
          "totalWeight",
          "observedWeightedMean",
        ],
      },
      ports: {
        inputs: [
          {
            id: "weightedScores",
            label: "Weighted Scores",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "eligibleWeights",
            label: "Eligible Weights",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "missingWeights",
            label: "Missing Weights",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
        ],
        outputs: [
          {
            id: "weightedSum",
            label: "Weighted Sum",
            valueType: { type: "number" },
          },
          {
            id: "observedWeight",
            label: "Observed Weight",
            valueType: { type: "number" },
          },
          {
            id: "totalWeight",
            label: "Total Weight",
            valueType: { type: "number" },
          },
          {
            id: "observedWeightedMean",
            label: "Observed Weighted Mean",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = orthopedicResearchScoreItemDenominatorTool.execute;
export default orthopedicResearchScoreItemDenominatorTool;
