import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
import { sigmoid } from "../batch61-analytic.js";
export type Input = { readonly x: number; readonly beta: number };
export type Output = { readonly derivative: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { x: { type: "number" }, beta: { type: "number" } },
  required: ["x", "beta"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { derivative: { type: "number" } },
  required: ["derivative"],
} as const;
/** Differentiate x*sigmoid(beta*x) with respect to beta, allowing zero and negative beta. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { x, beta } = input;
  const compute = (): Output => {
    const s = sigmoid(H.finite(beta * x));
    if (s === 0 || s === 1) return { derivative: 0 };
    return { derivative: x * x * s * (1 - s) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { x: 2, beta: 0 },
  output: { derivative: 1 },
} satisfies ToolExample<Input, Output>;
export const swishBetaPartialDerivativeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "activation/swish-beta-partial-derivative",
    title: "Swish Beta Partial Derivative Tool",
    description:
      "Differentiate x*sigmoid(beta*x) with respect to beta, allowing zero and negative beta.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { x: { type: "number" }, beta: { type: "number" } },
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
export const run = swishBetaPartialDerivativeTool.execute;
export default swishBetaPartialDerivativeTool;
