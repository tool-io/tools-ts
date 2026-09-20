import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly x: number; readonly alpha: number };
export type Output = { readonly derivative: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    x: { type: "number" },
    alpha: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["x", "alpha"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { derivative: { type: "number" } },
  required: ["derivative"],
} as const;
/** Return the SELU scale partial while holding the input and positive alpha fixed. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { x, alpha } = input;
  const compute = (): Output => {
    H.positive(alpha);
    return { derivative: x >= 0 ? x : alpha * Math.expm1(x) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { x: 3, alpha: 2 },
  output: { derivative: 3 },
} satisfies ToolExample<Input, Output>;
export const seluScalePartialDerivativeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "activation/selu-scale-partial-derivative",
    title: "SELU Scale Partial Derivative Tool",
    description:
      "Return the SELU scale partial while holding the input and positive alpha fixed.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        x: { type: "number" },
        alpha: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["x", "alpha"],
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
          id: "alpha",
          label: "Alpha",
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
export const run = seluScalePartialDerivativeTool.execute;
export default seluScalePartialDerivativeTool;
