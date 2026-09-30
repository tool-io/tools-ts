import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly actual: number;
  readonly predicted: number;
  readonly factor: number;
};
export type Output = {
  readonly error: number;
  readonly undefinedPair: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actual: { type: "number" },
    predicted: { type: "number" },
    factor: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["actual", "predicted", "factor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { error: { type: "number" }, undefinedPair: { type: "boolean" } },
  required: ["error", "undefinedPair"],
} as const;
/** Evaluate a caller-scaled absolute symmetric percentage-error term, explicitly flagging the 0/0 convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { actual, predicted, factor } = request;
  const compute = (): Output => {
    H.positive(factor);
    const d = Math.abs(actual) + Math.abs(predicted);
    return {
      error: d === 0 ? 0 : (factor * Math.abs(predicted - actual)) / d,
      undefinedPair: d === 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { actual: 2, predicted: 6, factor: 2 },
  output: { error: 1, undefinedPair: false },
} satisfies ToolExample<Input, Output>;
export const symmetricMapeDenominatorConventionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "metrics/symmetric-mape-denominator-convention",
    title: "Symmetric Mape Denominator Convention Tool",
    description:
      "Evaluate a caller-scaled absolute symmetric percentage-error term, explicitly flagging the 0/0 convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        actual: { type: "number" },
        predicted: { type: "number" },
        factor: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["actual", "predicted", "factor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        error: { type: "number" },
        undefinedPair: { type: "boolean" },
      },
      required: ["error", "undefinedPair"],
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
          id: "factor",
          label: "Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "error", label: "Error", valueType: { type: "number" } },
        {
          id: "undefinedPair",
          label: "Undefined Pair",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = symmetricMapeDenominatorConventionTool.execute;
export default symmetricMapeDenominatorConventionTool;
