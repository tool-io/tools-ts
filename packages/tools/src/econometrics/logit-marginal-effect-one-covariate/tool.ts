import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly probability: number;
  readonly coefficient: number;
};
export type Output = { readonly effect: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    probability: { type: "number", minimum: 0, maximum: 1 },
    coefficient: { type: "number" },
  },
  required: ["probability", "coefficient"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { effect: { type: "number" } },
  required: ["effect"],
} as const;
/** Continuous-covariate partial effect at a supplied logit probability, not a discrete dummy-variable contrast. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { probability, coefficient } = request;
  const compute = (): Output => {
    H.probability(probability);
    return { effect: coefficient * probability * (1 - probability) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { probability: 0.5, coefficient: 2 },
  output: { effect: 0.5 },
} satisfies ToolExample<Input, Output>;
export const logitMarginalEffectOneCovariateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "econometrics/logit-marginal-effect-one-covariate",
    title: "Logit Marginal Effect One Covariate Tool",
    description:
      "Continuous-covariate partial effect at a supplied logit probability, not a discrete dummy-variable contrast.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        probability: { type: "number", minimum: 0, maximum: 1 },
        coefficient: { type: "number" },
      },
      required: ["probability", "coefficient"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { effect: { type: "number" } },
      required: ["effect"],
    },
    ports: {
      inputs: [
        {
          id: "probability",
          label: "Probability",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "coefficient",
          label: "Coefficient",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "effect", label: "Effect", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = logitMarginalEffectOneCovariateTool.execute;
export default logitMarginalEffectOneCovariateTool;
