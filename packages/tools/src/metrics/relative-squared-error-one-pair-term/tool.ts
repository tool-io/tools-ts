import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly actual: number;
  readonly predicted: number;
  readonly reference: number;
};
export type Output = { readonly ratio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actual: { type: "number" },
    predicted: { type: "number" },
    reference: { type: "number" },
  },
  required: ["actual", "predicted", "reference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ratio: { type: "number" } },
  required: ["ratio"],
} as const;
/** Calculate relative squared error one pair term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { actual, predicted, reference } = request;
  const compute = (): Output => {
    const denominator = (actual - reference) ** 2;
    H.positive(denominator);
    return { ratio: (actual - predicted) ** 2 / denominator };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { actual: 10, predicted: 8, reference: 6 },
  output: { ratio: 0.25 },
} satisfies ToolExample<Input, Output>;
export const relativeSquaredErrorOnePairTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "metrics/relative-squared-error-one-pair-term",
    title: "Relative Squared Error One Pair Term Tool",
    description:
      "Calculate relative squared error one pair term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        actual: { type: "number" },
        predicted: { type: "number" },
        reference: { type: "number" },
      },
      required: ["actual", "predicted", "reference"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { ratio: { type: "number" } },
      required: ["ratio"],
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
          id: "reference",
          label: "Reference",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "ratio", label: "Ratio", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = relativeSquaredErrorOnePairTermTool.execute;
export default relativeSquaredErrorOnePairTermTool;
