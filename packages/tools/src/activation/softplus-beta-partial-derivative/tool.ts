import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
import { sigmoid, softplus } from "../batch61-analytic.js";
export type Input = { readonly x: number; readonly beta: number };
export type Output = { readonly derivative: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    x: { type: "number" },
    beta: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["x", "beta"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { derivative: { type: "number" } },
  required: ["derivative"],
} as const;
/** Differentiate log(1+exp(beta*x))/beta with respect to positive beta at a fixed input. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { x, beta } = input;
  const compute = (): Output => {
    H.positive(beta);
    const z = beta * x;
    H.finite(z);
    return { derivative: (z * sigmoid(z) - softplus(z)) / (beta * beta) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { x: 0, beta: 1 },
  output: { derivative: -0.6931471805599453 },
} satisfies ToolExample<Input, Output>;
export const softplusBetaPartialDerivativeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "activation/softplus-beta-partial-derivative",
    title: "Softplus Beta Partial Derivative Tool",
    description:
      "Differentiate log(1+exp(beta*x))/beta with respect to positive beta at a fixed input.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        x: { type: "number" },
        beta: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["x", "beta"],
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
          id: "beta",
          label: "Beta",
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
export const run = softplusBetaPartialDerivativeTool.execute;
export default softplusBetaPartialDerivativeTool;
