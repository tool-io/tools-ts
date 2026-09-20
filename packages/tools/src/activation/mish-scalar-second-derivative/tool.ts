import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
import { sigmoid, softplus, tanh } from "../batch61-analytic.js";
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
/** Evaluate the analytic second input derivative of x*tanh(softplus(x)) with reused stable forward cores. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { x } = input;
  const compute = (): Output => {
    const p = sigmoid(x),
      t = tanh(softplus(x)),
      a = 1 - t * t;
    if (a === 0) return { derivative: 0 };
    return { derivative: a * (2 * p + x * (p * (1 - p) - 2 * t * p * p)) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { x: 0 },
  output: { derivative: 0.64 },
} satisfies ToolExample<Input, Output>;
export const mishScalarSecondDerivativeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "activation/mish-scalar-second-derivative",
    title: "Mish Scalar Second Derivative Tool",
    description:
      "Evaluate the analytic second input derivative of x*tanh(softplus(x)) with reused stable forward cores.",
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
export const run = mishScalarSecondDerivativeTool.execute;
export default mishScalarSecondDerivativeTool;
