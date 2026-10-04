import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstFlow: number;
  readonly secondFlow: number;
  readonly duration: number;
  readonly trapezoid: boolean;
};
export type Output = { readonly volumeIncrement: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstFlow: { type: "number" },
    secondFlow: { type: "number" },
    duration: { type: "number", minimum: 0 },
    trapezoid: { type: "boolean" },
  },
  required: ["firstFlow", "secondFlow", "duration", "trapezoid"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { volumeIncrement: { type: "number" } },
  required: ["volumeIncrement"],
} as const;
/** Integrate one supplied research trace interval by an explicit trapezoid or left-held rule; no uroflow diagnosis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstFlow, secondFlow, duration, trapezoid } = request;
  const compute = (): Output => {
    H.domain(duration >= 0);
    return {
      volumeIncrement:
        (trapezoid ? (firstFlow + secondFlow) / 2 : firstFlow) * duration,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstFlow: 2, secondFlow: 4, duration: 3, trapezoid: true },
  output: { volumeIncrement: 9 },
} satisfies ToolExample<Input, Output>;
export const uroflowSampleVolumeIncrementTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urology/uroflow-sample-volume-increment",
    title: "Uroflow Sample Volume Increment Tool",
    description:
      "Integrate one supplied research trace interval by an explicit trapezoid or left-held rule; no uroflow diagnosis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstFlow: { type: "number" },
        secondFlow: { type: "number" },
        duration: { type: "number", minimum: 0 },
        trapezoid: { type: "boolean" },
      },
      required: ["firstFlow", "secondFlow", "duration", "trapezoid"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { volumeIncrement: { type: "number" } },
      required: ["volumeIncrement"],
    },
    ports: {
      inputs: [
        {
          id: "firstFlow",
          label: "First Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondFlow",
          label: "Second Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "duration",
          label: "Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "trapezoid",
          label: "Trapezoid",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "volumeIncrement",
          label: "Volume Increment",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = uroflowSampleVolumeIncrementTool.execute;
export default uroflowSampleVolumeIncrementTool;
