import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly players: number;
  readonly coalitionSize: number;
  readonly withoutValue: number;
  readonly withValue: number;
};
export type Output = {
  readonly marginalContribution: number;
  readonly permutationWeight: number;
  readonly weightedContribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    players: { type: "integer", minimum: 1, maximum: 100 },
    coalitionSize: { type: "integer", minimum: 0 },
    withoutValue: { type: "number" },
    withValue: { type: "number" },
  },
  required: ["players", "coalitionSize", "withoutValue", "withValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    marginalContribution: { type: "number" },
    permutationWeight: { type: "number" },
    weightedContribution: { type: "number" },
  },
  required: [
    "marginalContribution",
    "permutationWeight",
    "weightedContribution",
  ],
} as const;
/** One Shapley summand with weight |S|!(n-|S|-1)!/n!, evaluated through a binomial-product denominator. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { players, coalitionSize, withoutValue, withValue } = request;
  const compute = (): Output => {
    H.integer(players, 1, 100);
    H.integer(coalitionSize, 0, players - 1);
    return {
      marginalContribution: withValue - withoutValue,
      permutationWeight:
        1 /
        (players *
          Array.from(
            { length: coalitionSize },
            (_, j) => (players - 1 - j) / (j + 1),
          ).reduce((a, b) => a * b, 1)),
      weightedContribution:
        (withValue - withoutValue) /
        (players *
          Array.from(
            { length: coalitionSize },
            (_, j) => (players - 1 - j) / (j + 1),
          ).reduce((a, b) => a * b, 1)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { players: 4, coalitionSize: 1, withoutValue: 10, withValue: 22 },
  output: {
    marginalContribution: 12,
    permutationWeight: 0.08333333333333333,
    weightedContribution: 1,
  },
} satisfies ToolExample<Input, Output>;
export const shapleyOneCoalitionMarginalTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "game-theory/shapley-one-coalition-marginal-term",
    title: "Shapley One Coalition Marginal Term Tool",
    description:
      "One Shapley summand with weight |S|!(n-|S|-1)!/n!, evaluated through a binomial-product denominator.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        players: { type: "integer", minimum: 1, maximum: 100 },
        coalitionSize: { type: "integer", minimum: 0 },
        withoutValue: { type: "number" },
        withValue: { type: "number" },
      },
      required: ["players", "coalitionSize", "withoutValue", "withValue"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        marginalContribution: { type: "number" },
        permutationWeight: { type: "number" },
        weightedContribution: { type: "number" },
      },
      required: [
        "marginalContribution",
        "permutationWeight",
        "weightedContribution",
      ],
    },
    ports: {
      inputs: [
        {
          id: "players",
          label: "Players",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "coalitionSize",
          label: "Coalition Size",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "withoutValue",
          label: "Without Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "withValue",
          label: "With Value",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "marginalContribution",
          label: "Marginal Contribution",
          valueType: { type: "number" },
        },
        {
          id: "permutationWeight",
          label: "Permutation Weight",
          valueType: { type: "number" },
        },
        {
          id: "weightedContribution",
          label: "Weighted Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = shapleyOneCoalitionMarginalTermTool.execute;
export default shapleyOneCoalitionMarginalTermTool;
