import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly mean: number;
  readonly weight: number;
};
export type Output = { readonly contribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    mean: { type: "number" },
    weight: { type: "number", minimum: 0 },
  },
  required: ["value", "mean", "weight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { contribution: { type: "number" } },
  required: ["contribution"],
} as const;
/** Calculate third central moment single deviation from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { value, mean, weight } = input;
  const compute = (): Output => {
    H.domain(weight >= 0);
    return { contribution: weight * (value - mean) ** 3 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { value: 5, mean: 3, weight: 0.5 },
  output: { contribution: 4 },
} satisfies ToolExample<Input, Output>;
export const thirdCentralMomentSingleDeviationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "statistics/third-central-moment-single-deviation",
    title: "Third Central Moment Single Deviation Tool",
    description:
      "Calculate third central moment single deviation from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number" },
        mean: { type: "number" },
        weight: { type: "number", minimum: 0 },
      },
      required: ["value", "mean", "weight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { contribution: { type: "number" } },
      required: ["contribution"],
    },
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
          id: "weight",
          label: "Weight",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "contribution",
          label: "Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = thirdCentralMomentSingleDeviationTool.execute;
export default thirdCentralMomentSingleDeviationTool;
