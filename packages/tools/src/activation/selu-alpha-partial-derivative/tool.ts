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
/** Differentiate SELU with respect to alpha at a fixed positive scale. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { x, scale } = input;
  const compute = (): Output => {
    H.positive(scale);
    return { derivative: x < 0 ? scale * Math.expm1(x) : 0 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { x: -0.6931471805599453, scale: 2 },
  output: { derivative: -1 },
} satisfies ToolExample<Input, Output>;
export const seluAlphaPartialDerivativeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "activation/selu-alpha-partial-derivative",
    title: "SELU Alpha Partial Derivative Tool",
    description:
      "Differentiate SELU with respect to alpha at a fixed positive scale.",
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
export const run = seluAlphaPartialDerivativeTool.execute;
export default seluAlphaPartialDerivativeTool;
