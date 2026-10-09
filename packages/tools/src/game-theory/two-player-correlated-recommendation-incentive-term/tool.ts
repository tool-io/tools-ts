import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly jointRecommendationProbability: number;
  readonly obeyPayoff: number;
  readonly deviationPayoff: number;
};
export type Output = { readonly incentiveContribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    jointRecommendationProbability: { type: "number", minimum: 0, maximum: 1 },
    obeyPayoff: { type: "number" },
    deviationPayoff: { type: "number" },
  },
  required: ["jointRecommendationProbability", "obeyPayoff", "deviationPayoff"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { incentiveContribution: { type: "number" } },
  required: ["incentiveContribution"],
} as const;
/** Calculate one probability-weighted obey-minus-deviate payoff contribution to an explicit correlated-equilibrium incentive inequality. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { jointRecommendationProbability, obeyPayoff, deviationPayoff } =
    request;
  const compute = (): Output => {
    (H.domain(
      jointRecommendationProbability >= 0 &&
        jointRecommendationProbability <= 1,
      "jointRecommendationProbability",
    ),
      jointRecommendationProbability);
    return {
      incentiveContribution:
        jointRecommendationProbability * (obeyPayoff - deviationPayoff),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    jointRecommendationProbability: 0.25,
    obeyPayoff: 8,
    deviationPayoff: 4,
  },
  output: { incentiveContribution: 1 },
} satisfies ToolExample<Input, Output>;
export const twoPlayerCorrelatedRecommendationIncentiveTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "game-theory/two-player-correlated-recommendation-incentive-term",
      title: "Two Player Correlated Recommendation Incentive Term Tool",
      description:
        "Calculate one probability-weighted obey-minus-deviate payoff contribution to an explicit correlated-equilibrium incentive inequality.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          jointRecommendationProbability: {
            type: "number",
            minimum: 0,
            maximum: 1,
          },
          obeyPayoff: { type: "number" },
          deviationPayoff: { type: "number" },
        },
        required: [
          "jointRecommendationProbability",
          "obeyPayoff",
          "deviationPayoff",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { incentiveContribution: { type: "number" } },
        required: ["incentiveContribution"],
      },
      ports: {
        inputs: [
          {
            id: "jointRecommendationProbability",
            label: "Joint Recommendation Probability",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "obeyPayoff",
            label: "Obey Payoff",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "deviationPayoff",
            label: "Deviation Payoff",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "incentiveContribution",
            label: "Incentive Contribution",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = twoPlayerCorrelatedRecommendationIncentiveTermTool.execute;
export default twoPlayerCorrelatedRecommendationIncentiveTermTool;
