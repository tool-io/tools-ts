import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
import { sigmoid } from "../batch61-analytic.js";
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
/** Evaluate the third input derivative of beta-scaled softplus; zero is the inflection point. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { x, beta } = input;
  const compute = (): Output => {
    H.positive(beta);
    const s = sigmoid(H.finite(beta * x));
    return { derivative: beta * beta * s * (1 - s) * (1 - 2 * s) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { x: 0, beta: 2 },
  output: { derivative: 0 },
} satisfies ToolExample<Input, Output>;
export const softplusScalarThirdDerivativeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "activation/softplus-scalar-third-derivative",
    title: "Softplus Scalar Third Derivative Tool",
    description:
      "Evaluate the third input derivative of beta-scaled softplus; zero is the inflection point.",
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
export const run = softplusScalarThirdDerivativeTool.execute;
export default softplusScalarThirdDerivativeTool;
