import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly x: number; readonly scale: number };
export type Output = { readonly derivative: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    x: { type: "number" },
    scale: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["x", "scale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { derivative: { type: "number" } },
  required: ["derivative"],
} as const;
/** Differentiate x/(scale+abs(x)) with respect to its positive scale. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { x, scale } = request;
  const compute = (): Output => {
    H.positive(scale);
    return { derivative: -x / (scale + Math.abs(x)) ** 2 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { x: 2, scale: 2 },
  output: { derivative: -0.125 },
} satisfies ToolExample<Input, Output>;
export const softsignScaleParameterSensitivityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "activation/softsign-scale-parameter-sensitivity",
    title: "Softsign Scale Parameter Sensitivity Tool",
    description:
      "Differentiate x/(scale+abs(x)) with respect to its positive scale.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        x: { type: "number" },
        scale: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["x", "scale"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { derivative: { type: "number" } },
      required: ["derivative"],
    },
    ports: {
      inputs: [
        { id: "x", label: "X", required: true, valueType: { type: "number" } },
        {
          id: "scale",
          label: "Scale",
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
export const run = softsignScaleParameterSensitivityTool.execute;
export default softsignScaleParameterSensitivityTool;
