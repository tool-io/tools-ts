import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly successObserved: boolean;
  readonly predictedProbability: number;
};
export type Output = { readonly residual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    successObserved: { type: "boolean" },
    predictedProbability: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["successObserved", "predictedProbability"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { residual: { type: "number" } },
  required: ["residual"],
} as const;
/** Subtract an explicit predicted Bernoulli success probability from a supplied zero-or-one observation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { successObserved, predictedProbability } = request;
  const compute = (): Output => {
    (H.domain(
      predictedProbability >= 0 && predictedProbability <= 1,
      "predictedProbability",
    ),
      predictedProbability);
    return { residual: (successObserved ? 1 : 0) - predictedProbability };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { successObserved: true, predictedProbability: 0.25 },
  output: { residual: 0.75 },
} satisfies ToolExample<Input, Output>;
export const bernoulliTrialSignedResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["probability", "mathematics"],
      keywords: ["probability", "mathematics"],
    },
    id: "probability/bernoulli-trial-signed-residual",
    title: "Bernoulli Trial Signed Residual",
    description:
      "Subtract an explicit predicted Bernoulli success probability from a supplied zero-or-one observation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        successObserved: { type: "boolean" },
        predictedProbability: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["successObserved", "predictedProbability"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { residual: { type: "number" } },
      required: ["residual"],
    },
    ports: {
      inputs: [
        {
          id: "successObserved",
          label: "Success Observed",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "predictedProbability",
          label: "Predicted Probability",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = bernoulliTrialSignedResidualTool.execute;
export default bernoulliTrialSignedResidualTool;
