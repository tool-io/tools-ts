import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly probability: number; readonly success: boolean };
export type Output = { readonly logLikelihood: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    probability: { type: "number", minimum: 0, maximum: 1 },
    success: { type: "boolean" },
  },
  required: ["probability", "success"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { logLikelihood: { type: "number" } },
  required: ["logLikelihood"],
} as const;
/** Return one finite Bernoulli log-likelihood term. An impossible observation is rejected because its negative-infinite log-likelihood is not portable JSON. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { probability, success } = request;
  const compute = (): Output => {
    (H.domain(probability >= 0 && probability <= 1, "probability"),
      probability);
    H.domain(success ? probability > 0 : probability < 1, "probability");
    return {
      logLikelihood: success ? Math.log(probability) : Math.log1p(-probability),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { probability: 0.5, success: true },
  output: { logLikelihood: -0.6931471805599453 },
} satisfies ToolExample<Input, Output>;
export const bernoulliLogLikelihoodTrialTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "probability/bernoulli-log-likelihood-trial",
    title: "Bernoulli Log Likelihood Trial Tool",
    description:
      "Return one finite Bernoulli log-likelihood term. An impossible observation is rejected because its negative-infinite log-likelihood is not portable JSON.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        probability: { type: "number", minimum: 0, maximum: 1 },
        success: { type: "boolean" },
      },
      required: ["probability", "success"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { logLikelihood: { type: "number" } },
      required: ["logLikelihood"],
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
          id: "success",
          label: "Success",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "logLikelihood",
          label: "Log Likelihood",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = bernoulliLogLikelihoodTrialTool.execute;
export default bernoulliLogLikelihoodTrialTool;
