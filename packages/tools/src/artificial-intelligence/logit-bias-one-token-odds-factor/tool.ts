import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly bias: number; readonly baseProbability: number };
export type Output = {
  readonly oddsMultiplier: number;
  readonly adjustedProbability: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bias: { type: "number" },
    baseProbability: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["bias", "baseProbability"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oddsMultiplier: { type: "number" },
    adjustedProbability: { type: "number" },
  },
  required: ["oddsMultiplier", "adjustedProbability"],
} as const;
/** Apply an additive bias to one token with all other logits fixed; its odds against the rest multiply by exp(bias). */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bias, baseProbability } = request;
  const compute = (): Output => {
    H.probability(baseProbability);
    return {
      oddsMultiplier: Math.exp(bias),
      adjustedProbability:
        baseProbability === 0
          ? 0
          : baseProbability === 1
            ? 1
            : 1 /
              (1 + ((1 - baseProbability) / baseProbability) * Math.exp(-bias)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bias: 0.6931471805599453, baseProbability: 0.25 },
  output: { oddsMultiplier: 2, adjustedProbability: 0.4 },
} satisfies ToolExample<Input, Output>;
export const logitBiasOneTokenOddsFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "artificial-intelligence/logit-bias-one-token-odds-factor",
    title: "Logit Bias One Token Odds Factor Tool",
    description:
      "Apply an additive bias to one token with all other logits fixed; its odds against the rest multiply by exp(bias).",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bias: { type: "number" },
        baseProbability: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["bias", "baseProbability"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        oddsMultiplier: { type: "number" },
        adjustedProbability: { type: "number" },
      },
      required: ["oddsMultiplier", "adjustedProbability"],
    },
    ports: {
      inputs: [
        {
          id: "bias",
          label: "Bias",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "baseProbability",
          label: "Base Probability",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "oddsMultiplier",
          label: "Odds Multiplier",
          valueType: { type: "number" },
        },
        {
          id: "adjustedProbability",
          label: "Adjusted Probability",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = logitBiasOneTokenOddsFactorTool.execute;
export default logitBiasOneTokenOddsFactorTool;
