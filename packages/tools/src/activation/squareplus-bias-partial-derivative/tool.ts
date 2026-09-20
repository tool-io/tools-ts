import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly x: number; readonly bias: number };
export type Output = { readonly derivative: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    x: { type: "number" },
    bias: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["x", "bias"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { derivative: { type: "number" } },
  required: ["derivative"],
} as const;
/** Return the partial derivative of (x+sqrt(x²+bias))/2 with respect to positive bias. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { x, bias } = input;
  const compute = (): Output => {
    H.positive(bias);
    return { derivative: 1 / (4 * Math.hypot(x, Math.sqrt(bias))) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { x: 0, bias: 4 },
  output: { derivative: 0.125 },
} satisfies ToolExample<Input, Output>;
export const squareplusBiasPartialDerivativeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "activation/squareplus-bias-partial-derivative",
    title: "Squareplus Bias Partial Derivative Tool",
    description:
      "Return the partial derivative of (x+sqrt(x²+bias))/2 with respect to positive bias.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        x: { type: "number" },
        bias: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["x", "bias"],
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
          id: "bias",
          label: "Bias",
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
export const run = squareplusBiasPartialDerivativeTool.execute;
export default squareplusBiasPartialDerivativeTool;
