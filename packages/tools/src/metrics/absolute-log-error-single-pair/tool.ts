import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly actual: number; readonly predicted: number };
export type Output = { readonly error: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actual: { type: "number", exclusiveMinimum: 0 },
    predicted: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["actual", "predicted"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { error: { type: "number" } },
  required: ["error"],
} as const;
/** Calculate absolute log error single pair from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { actual, predicted } = input;
  const compute = (): Output => {
    H.positive(actual);
    H.positive(predicted);
    return { error: Math.abs(Math.log(predicted / actual)) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { actual: 2, predicted: 4 },
  output: { error: 0.6931471805599453 },
} satisfies ToolExample<Input, Output>;
export const absoluteLogErrorSinglePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "metrics/absolute-log-error-single-pair",
    title: "Absolute Log Error Single Pair Tool",
    description:
      "Calculate absolute log error single pair from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        actual: { type: "number", exclusiveMinimum: 0 },
        predicted: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["actual", "predicted"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { error: { type: "number" } },
      required: ["error"],
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
      outputs: [{ id: "error", label: "Error", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = absoluteLogErrorSinglePairTool.execute;
export default absoluteLogErrorSinglePairTool;
