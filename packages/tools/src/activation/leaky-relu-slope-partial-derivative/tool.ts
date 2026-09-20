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
/** Return the negative-branch slope-parameter derivative of leaky ReLU, including zero at the origin. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { x } = input;
  const compute = (): Output => {
    return { derivative: x < 0 ? x : 0 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { x: -3 },
  output: { derivative: -3 },
} satisfies ToolExample<Input, Output>;
export const leakyReluSlopePartialDerivativeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "activation/leaky-relu-slope-partial-derivative",
    title: "Leaky ReLU Slope Partial Derivative Tool",
    description:
      "Return the negative-branch slope-parameter derivative of leaky ReLU, including zero at the origin.",
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
export const run = leakyReluSlopePartialDerivativeTool.execute;
export default leakyReluSlopePartialDerivativeTool;
