import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly actual: number; readonly predicted: number };
export type Output = { readonly derivative: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { actual: { type: "number" }, predicted: { type: "number" } },
  required: ["actual", "predicted"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { derivative: { type: "number" } },
  required: ["derivative"],
} as const;
/** Differentiate an unnormalized weighted squared-error term with respect to its weight. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { actual, predicted } = input;
  const compute = (): Output => {
    return { derivative: (predicted - actual) ** 2 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { actual: 3, predicted: 5 },
  output: { derivative: 4 },
} satisfies ToolExample<Input, Output>;
export const squaredErrorWeightSensitivityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "metrics/squared-error-weight-sensitivity",
    title: "Squared Error Weight Sensitivity Tool",
    description:
      "Differentiate an unnormalized weighted squared-error term with respect to its weight.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { actual: { type: "number" }, predicted: { type: "number" } },
      required: ["actual", "predicted"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { derivative: { type: "number" } },
      required: ["derivative"],
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
      ],
      outputs: [
        {
          id: "derivative",
          label: "Derivative",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = squaredErrorWeightSensitivityTool.execute;
export default squaredErrorWeightSensitivityTool;
