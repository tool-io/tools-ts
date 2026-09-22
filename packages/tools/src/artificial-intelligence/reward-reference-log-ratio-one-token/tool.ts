import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly policyProbability: number;
  readonly referenceProbability: number;
  readonly beta: number;
};
export type Output = {
  readonly logRatio: number;
  readonly scaledReward: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    policyProbability: { type: "number", exclusiveMinimum: 0, maximum: 1 },
    referenceProbability: { type: "number", exclusiveMinimum: 0, maximum: 1 },
    beta: { type: "number", minimum: 0 },
  },
  required: ["policyProbability", "referenceProbability", "beta"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    logRatio: { type: "number" },
    scaledReward: { type: "number" },
  },
  required: ["logRatio", "scaledReward"],
} as const;
/** One supplied policy/reference log-ratio term, not a learned reward or preference-model assessment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { policyProbability, referenceProbability, beta } = request;
  const compute = (): Output => {
    H.domain(
      policyProbability > 0 &&
        policyProbability <= 1 &&
        referenceProbability > 0 &&
        referenceProbability <= 1 &&
        beta >= 0,
    );
    return {
      logRatio: Math.log(policyProbability / referenceProbability),
      scaledReward: beta * Math.log(policyProbability / referenceProbability),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { policyProbability: 0.4, referenceProbability: 0.2, beta: 2 },
  output: { logRatio: 0.6931471805599453, scaledReward: 1.3862943611198906 },
} satisfies ToolExample<Input, Output>;
export const rewardReferenceLogRatioOneTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "artificial-intelligence/reward-reference-log-ratio-one-token",
    title: "Reward Reference Log Ratio One Token Tool",
    description:
      "One supplied policy/reference log-ratio term, not a learned reward or preference-model assessment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        policyProbability: { type: "number", exclusiveMinimum: 0, maximum: 1 },
        referenceProbability: {
          type: "number",
          exclusiveMinimum: 0,
          maximum: 1,
        },
        beta: { type: "number", minimum: 0 },
      },
      required: ["policyProbability", "referenceProbability", "beta"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        logRatio: { type: "number" },
        scaledReward: { type: "number" },
      },
      required: ["logRatio", "scaledReward"],
    },
    ports: {
      inputs: [
        {
          id: "policyProbability",
          label: "Policy Probability",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceProbability",
          label: "Reference Probability",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "beta",
          label: "Beta",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "logRatio", label: "Log Ratio", valueType: { type: "number" } },
        {
          id: "scaledReward",
          label: "Scaled Reward",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = rewardReferenceLogRatioOneTokenTool.execute;
export default rewardReferenceLogRatioOneTokenTool;
