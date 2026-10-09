import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly suppliedUniformDraw: number;
  readonly winProbability: number;
  readonly winningReward: number;
  readonly losingReward: number;
};
export type Output = { readonly won: boolean; readonly realizedReward: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suppliedUniformDraw: { type: "number", minimum: 0, exclusiveMaximum: 1 },
    winProbability: { type: "number", minimum: 0, maximum: 1 },
    winningReward: { type: "number" },
    losingReward: { type: "number" },
  },
  required: [
    "suppliedUniformDraw",
    "winProbability",
    "winningReward",
    "losingReward",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { won: { type: "boolean" }, realizedReward: { type: "number" } },
  required: ["won", "realizedReward"],
} as const;
/** Resolve an explicit lottery draw in [0,1) against a supplied win probability using draw<p, without generating randomness. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { suppliedUniformDraw, winProbability, winningReward, losingReward } =
    request;
  const compute = (): Output => {
    H.domain(
      suppliedUniformDraw >= 0 && suppliedUniformDraw < 1,
      "suppliedUniformDraw",
    );
    (H.domain(winProbability >= 0 && winProbability <= 1, "winProbability"),
      winProbability);
    return {
      won: suppliedUniformDraw < winProbability,
      realizedReward:
        suppliedUniformDraw < winProbability ? winningReward : losingReward,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    suppliedUniformDraw: 0.2,
    winProbability: 0.25,
    winningReward: 10,
    losingReward: 0,
  },
  output: { won: true, realizedReward: 10 },
} satisfies ToolExample<Input, Output>;
export const experimentRewardLotteryRealizationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "experimental-psychology/experiment-reward-lottery-realization",
    title: "Experiment Reward Lottery Realization Tool",
    description:
      "Resolve an explicit lottery draw in [0,1) against a supplied win probability using draw<p, without generating randomness.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        suppliedUniformDraw: {
          type: "number",
          minimum: 0,
          exclusiveMaximum: 1,
        },
        winProbability: { type: "number", minimum: 0, maximum: 1 },
        winningReward: { type: "number" },
        losingReward: { type: "number" },
      },
      required: [
        "suppliedUniformDraw",
        "winProbability",
        "winningReward",
        "losingReward",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        won: { type: "boolean" },
        realizedReward: { type: "number" },
      },
      required: ["won", "realizedReward"],
    },
    ports: {
      inputs: [
        {
          id: "suppliedUniformDraw",
          label: "Supplied Uniform Draw",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "winProbability",
          label: "Win Probability",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "winningReward",
          label: "Winning Reward",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "losingReward",
          label: "Losing Reward",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "won", label: "Won", valueType: { type: "boolean" } },
        {
          id: "realizedReward",
          label: "Realized Reward",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = experimentRewardLotteryRealizationTool.execute;
export default experimentRewardLotteryRealizationTool;
