import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  positive,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly value: number;
  readonly mean: number;
  readonly totalWeight: number;
};
export type Output = { readonly derivative: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    mean: { type: "number" },
    totalWeight: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["value", "mean", "totalWeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { derivative: { type: "number" } },
  required: ["derivative"],
} as const;
/** Compute weighted mean one weight sensitivity from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { value, mean, totalWeight } = input;
  const compute = (): Output => {
    positive(totalWeight);
    return { derivative: (value - mean) / totalWeight };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { value: 8, mean: 4, totalWeight: 2 },
  output: { derivative: 2 },
} satisfies ToolExample<Input, Output>;
export const weightedMeanOneWeightSensitivityTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "statistics/weighted-mean-one-weight-sensitivity",
  title: "Weighted Mean One Weight Sensitivity Tool",
  description:
    "Compute weighted mean one weight sensitivity from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "value",
        label: "Value",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "mean",
        label: "Mean",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "totalWeight",
        label: "Total Weight",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      { id: "derivative", label: "Derivative", valueType: { type: "number" } },
    ],
  },
});
export const run = weightedMeanOneWeightSensitivityTool.execute;
export default weightedMeanOneWeightSensitivityTool;
