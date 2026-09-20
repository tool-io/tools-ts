import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly x: number; readonly width: number };
export type Output = { readonly derivative: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    x: { type: "number" },
    width: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["x", "width"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { derivative: { type: "number" } },
  required: ["derivative"],
} as const;
/** Differentiate exp(-(x/width)²) with respect to positive width. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { x, width } = request;
  const compute = (): Output => {
    H.positive(width);
    const z = x / width;
    if (!Number.isFinite(z) || Math.abs(z) > 40) return { derivative: 0 };
    return { derivative: (2 * z * z * Math.exp(-z * z)) / width };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { x: 2, width: 2 },
  output: { derivative: 0.36787944117144233 },
} satisfies ToolExample<Input, Output>;
export const gaussianActivationWidthSensitivityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "activation/gaussian-activation-width-sensitivity",
    title: "Gaussian Activation Width Sensitivity Tool",
    description:
      "Differentiate exp(-(x/width)²) with respect to positive width.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        x: { type: "number" },
        width: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["x", "width"],
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
          id: "width",
          label: "Width",
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
export const run = gaussianActivationWidthSensitivityTool.execute;
export default gaussianActivationWidthSensitivityTool;
