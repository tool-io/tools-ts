import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly omittedEffect: number;
  readonly covariance: number;
  readonly includedVariance: number;
};
export type Output = { readonly bias: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    omittedEffect: { type: "number" },
    covariance: { type: "number" },
    includedVariance: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["omittedEffect", "covariance", "includedVariance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { bias: { type: "number" } },
  required: ["bias"],
} as const;
/** Calculate omitted variable bias supplied covariance term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { omittedEffect, covariance, includedVariance } = request;
  const compute = (): Output => {
    H.positive(includedVariance);
    return { bias: (omittedEffect * covariance) / includedVariance };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { omittedEffect: 2, covariance: 3, includedVariance: 4 },
  output: { bias: 1.5 },
} satisfies ToolExample<Input, Output>;
export const omittedVariableBiasSuppliedCovarianceTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "econometrics/omitted-variable-bias-supplied-covariance-term",
      title: "Omitted Variable Bias Supplied Covariance Term Tool",
      description:
        "Calculate omitted variable bias supplied covariance term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          omittedEffect: { type: "number" },
          covariance: { type: "number" },
          includedVariance: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["omittedEffect", "covariance", "includedVariance"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { bias: { type: "number" } },
        required: ["bias"],
      },
      ports: {
        inputs: [
          {
            id: "omittedEffect",
            label: "Omitted Effect",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "covariance",
            label: "Covariance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "includedVariance",
            label: "Included Variance",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [{ id: "bias", label: "Bias", valueType: { type: "number" } }],
      },
    },
    calculate,
  });
export const run = omittedVariableBiasSuppliedCovarianceTermTool.execute;
export default omittedVariableBiasSuppliedCovarianceTermTool;
