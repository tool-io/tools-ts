import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startValue: number;
  readonly preResetValue: number;
  readonly postResetValue: number;
  readonly endValue: number;
};
export type Output = { readonly increment: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startValue: { type: "number" },
    preResetValue: { type: "number" },
    postResetValue: { type: "number" },
    endValue: { type: "number" },
  },
  required: ["startValue", "preResetValue", "postResetValue", "endValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { increment: { type: "number" } },
  required: ["increment"],
} as const;
/** Combine two supplied monotone rainfall accumulation segments around one explicit reset. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startValue, preResetValue, postResetValue, endValue } = request;
  const compute = (): Output => {
    H.domain(preResetValue >= startValue && endValue >= postResetValue);
    return {
      increment: preResetValue - startValue + endValue - postResetValue,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { startValue: 10, preResetValue: 20, postResetValue: 0, endValue: 5 },
  output: { increment: 15 },
} satisfies ToolExample<Input, Output>;
export const rainfallAccumulationResetIncrementTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrometeorology/rainfall-accumulation-reset-increment",
    title: "Rainfall Accumulation Reset Increment Tool",
    description:
      "Combine two supplied monotone rainfall accumulation segments around one explicit reset.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startValue: { type: "number" },
        preResetValue: { type: "number" },
        postResetValue: { type: "number" },
        endValue: { type: "number" },
      },
      required: ["startValue", "preResetValue", "postResetValue", "endValue"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { increment: { type: "number" } },
      required: ["increment"],
    },
    ports: {
      inputs: [
        {
          id: "startValue",
          label: "Start Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "preResetValue",
          label: "Pre Reset Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "postResetValue",
          label: "Post Reset Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "endValue",
          label: "End Value",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "increment", label: "Increment", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = rainfallAccumulationResetIncrementTool.execute;
export default rainfallAccumulationResetIncrementTool;
