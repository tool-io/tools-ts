import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly x: number };
export type Output = { readonly derivative: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { x: { type: "number" } },
  required: ["x"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { derivative: { type: "number" } },
  required: ["derivative"],
} as const;
/** Evaluate the analytic second derivative of exact GELU x*Phi(x), rather than a tanh approximation. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { x } = input;
  const compute = (): Output => {
    if (Math.abs(x) > 40) return { derivative: 0 };
    return {
      derivative:
        ((2 - x * x) * Math.exp((-x * x) / 2)) / Math.sqrt(2 * Math.PI),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { x: 0 },
  output: { derivative: 0.7978845608028654 },
} satisfies ToolExample<Input, Output>;
export const geluExactScalarSecondDerivativeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "activation/gelu-exact-scalar-second-derivative",
    title: "GELU Exact Scalar Second Derivative Tool",
    description:
      "Evaluate the analytic second derivative of exact GELU x*Phi(x), rather than a tanh approximation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { x: { type: "number" } },
      required: ["x"],
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
export const run = geluExactScalarSecondDerivativeTool.execute;
export default geluExactScalarSecondDerivativeTool;
