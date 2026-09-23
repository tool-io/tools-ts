import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly input: number;
  readonly value: number;
  readonly secondDerivative: number;
};
export type Output = { readonly elasticity: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    input: { type: "number" },
    value: { type: "number" },
    secondDerivative: { type: "number" },
  },
  required: ["input", "value", "secondDerivative"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { elasticity: { type: "number" } },
  required: ["elasticity"],
} as const;
/** Calculate second order relative elasticity from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { input, value, secondDerivative } = request;
  const compute = (): Output => {
    H.domain(value !== 0);
    return { elasticity: (input * input * secondDerivative) / value };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { input: 2, value: 4, secondDerivative: 2 },
  output: { elasticity: 2 },
} satisfies ToolExample<Input, Output>;
export const secondOrderRelativeElasticityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "calculus/second-order-relative-elasticity",
    title: "Second Order Relative Elasticity Tool",
    description:
      "Calculate second order relative elasticity from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        input: { type: "number" },
        value: { type: "number" },
        secondDerivative: { type: "number" },
      },
      required: ["input", "value", "secondDerivative"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { elasticity: { type: "number" } },
      required: ["elasticity"],
    },
    ports: {
      inputs: [
        {
          id: "input",
          label: "Input",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondDerivative",
          label: "Second Derivative",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "elasticity",
          label: "Elasticity",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = secondOrderRelativeElasticityTool.execute;
export default secondOrderRelativeElasticityTool;
