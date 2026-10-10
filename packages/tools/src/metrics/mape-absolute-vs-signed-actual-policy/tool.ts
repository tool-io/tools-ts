import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly actual: number;
  readonly predicted: number;
  readonly absoluteActualDenominator: boolean;
};
export type Output = { readonly errorFraction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actual: { type: "number" },
    predicted: { type: "number" },
    absoluteActualDenominator: { type: "boolean" },
  },
  required: ["actual", "predicted", "absoluteActualDenominator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { errorFraction: { type: "number" } },
  required: ["errorFraction"],
} as const;
/** Calculate one absolute prediction-error ratio with an explicit absolute or signed actual-denominator policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { actual, predicted, absoluteActualDenominator } = request;
  const compute = (): Output => {
    H.domain(actual !== 0, "actual");
    return {
      errorFraction:
        Math.abs(predicted - actual) /
        (absoluteActualDenominator ? Math.abs(actual) : actual),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { actual: -10, predicted: -8, absoluteActualDenominator: true },
  output: { errorFraction: 0.2 },
} satisfies ToolExample<Input, Output>;
export const mapeAbsoluteVsSignedActualPolicyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["ai", "data"],
      fields: ["metrics", "evaluation metrics", "computer science"],
      keywords: ["evaluation metrics", "computer science"],
    },
    id: "metrics/mape-absolute-vs-signed-actual-policy",
    title: "Mape Absolute Vs Signed Actual Policy",
    description:
      "Calculate one absolute prediction-error ratio with an explicit absolute or signed actual-denominator policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        actual: { type: "number" },
        predicted: { type: "number" },
        absoluteActualDenominator: { type: "boolean" },
      },
      required: ["actual", "predicted", "absoluteActualDenominator"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { errorFraction: { type: "number" } },
      required: ["errorFraction"],
    },
    ports: {
      inputs: [
        {
          id: "actual",
          label: "Actual",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "predicted",
          label: "Predicted",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "absoluteActualDenominator",
          label: "Absolute Actual Denominator",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "errorFraction",
          label: "Error Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = mapeAbsoluteVsSignedActualPolicyTool.execute;
export default mapeAbsoluteVsSignedActualPolicyTool;
