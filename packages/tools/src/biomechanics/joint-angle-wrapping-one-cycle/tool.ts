import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly angle: number;
  readonly lower: number;
  readonly period: number;
};
export type Output = { readonly wrapped: number; readonly cycles: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    angle: { type: "number" },
    lower: { type: "number" },
    period: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["angle", "lower", "period"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { wrapped: { type: "number" }, cycles: { type: "integer" } },
  required: ["wrapped", "cycles"],
} as const;
/** Wrap into [lower,lower+period) using a caller-selected angular unit and period. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { angle, lower, period } = request;
  const compute = (): Output => {
    H.positive(period);
    return {
      wrapped: lower + H.mod(angle - lower, period),
      cycles: Math.floor((angle - lower) / period),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { angle: 370, lower: 0, period: 360 },
  output: { wrapped: 10, cycles: 1 },
} satisfies ToolExample<Input, Output>;
export const jointAngleWrappingOneCycleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biomechanics/joint-angle-wrapping-one-cycle",
    title: "Joint Angle Wrapping One Cycle Tool",
    description:
      "Wrap into [lower,lower+period) using a caller-selected angular unit and period.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        angle: { type: "number" },
        lower: { type: "number" },
        period: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["angle", "lower", "period"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { wrapped: { type: "number" }, cycles: { type: "integer" } },
      required: ["wrapped", "cycles"],
    },
    ports: {
      inputs: [
        {
          id: "angle",
          label: "Angle",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lower",
          label: "Lower",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "period",
          label: "Period",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "wrapped", label: "Wrapped", valueType: { type: "number" } },
        { id: "cycles", label: "Cycles", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = jointAngleWrappingOneCycleTool.execute;
export default jointAngleWrappingOneCycleTool;
