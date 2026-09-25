import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly trainMinimum: number;
  readonly trainMaximum: number;
};
export type Output = {
  readonly scaled: number;
  readonly belowRange: number;
  readonly aboveRange: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    trainMinimum: { type: "number" },
    trainMaximum: { type: "number" },
  },
  required: ["value", "trainMinimum", "trainMaximum"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scaled: { type: "number" },
    belowRange: { type: "number" },
    aboveRange: { type: "number" },
  },
  required: ["scaled", "belowRange", "aboveRange"],
} as const;
/** Apply training anchors without clipping a test observation outside its training range. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, trainMinimum, trainMaximum } = request;
  const compute = (): Output => {
    H.domain(trainMaximum > trainMinimum);
    return {
      scaled: (value - trainMinimum) / (trainMaximum - trainMinimum),
      belowRange: Math.max(0, trainMinimum - value),
      aboveRange: Math.max(0, value - trainMaximum),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: 12, trainMinimum: 2, trainMaximum: 10 },
  output: { scaled: 1.25, belowRange: 0, aboveRange: 2 },
} satisfies ToolExample<Input, Output>;
export const minmaxFeatureTrainTestRangeGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "data-science/minmax-feature-train-test-range-gap",
    title: "Minmax Feature Train Test Range Gap Tool",
    description:
      "Apply training anchors without clipping a test observation outside its training range.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number" },
        trainMinimum: { type: "number" },
        trainMaximum: { type: "number" },
      },
      required: ["value", "trainMinimum", "trainMaximum"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scaled: { type: "number" },
        belowRange: { type: "number" },
        aboveRange: { type: "number" },
      },
      required: ["scaled", "belowRange", "aboveRange"],
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
          id: "trainMinimum",
          label: "Train Minimum",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "trainMaximum",
          label: "Train Maximum",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "scaled", label: "Scaled", valueType: { type: "number" } },
        {
          id: "belowRange",
          label: "Below Range",
          valueType: { type: "number" },
        },
        {
          id: "aboveRange",
          label: "Above Range",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = minmaxFeatureTrainTestRangeGapTool.execute;
export default minmaxFeatureTrainTestRangeGapTool;
