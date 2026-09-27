import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recommendationProbability: number;
  readonly obeyPayoff: number;
  readonly deviatePayoff: number;
};
export type Output = { readonly obedienceContribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recommendationProbability: { type: "number", minimum: 0, maximum: 1 },
    obeyPayoff: { type: "number" },
    deviatePayoff: { type: "number" },
  },
  required: ["recommendationProbability", "obeyPayoff", "deviatePayoff"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { obedienceContribution: { type: "number" } },
  required: ["obedienceContribution"],
} as const;
/** One joint recommendation-profile term in a correlated-equilibrium incentive constraint. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recommendationProbability, obeyPayoff, deviatePayoff } = request;
  const compute = (): Output => {
    H.probability(recommendationProbability);
    return {
      obedienceContribution:
        recommendationProbability * (obeyPayoff - deviatePayoff),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recommendationProbability: 0.25, obeyPayoff: 6, deviatePayoff: 2 },
  output: { obedienceContribution: 1 },
} satisfies ToolExample<Input, Output>;
export const correlatedDeviceOneObedienceTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "game-theory/correlated-device-one-obedience-term",
    title: "Correlated Device One Obedience Term Tool",
    description:
      "One joint recommendation-profile term in a correlated-equilibrium incentive constraint.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recommendationProbability: { type: "number", minimum: 0, maximum: 1 },
        obeyPayoff: { type: "number" },
        deviatePayoff: { type: "number" },
      },
      required: ["recommendationProbability", "obeyPayoff", "deviatePayoff"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { obedienceContribution: { type: "number" } },
      required: ["obedienceContribution"],
    },
    ports: {
      inputs: [
        {
          id: "recommendationProbability",
          label: "Recommendation Probability",
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
          id: "deviatePayoff",
          label: "Deviate Payoff",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "obedienceContribution",
          label: "Obedience Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = correlatedDeviceOneObedienceTermTool.execute;
export default correlatedDeviceOneObedienceTermTool;
