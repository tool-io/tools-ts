import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly output: number; readonly alpha: number };
export type Output = { readonly input: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    output: { type: "number", exclusiveMaximum: 0 },
    alpha: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["output", "alpha"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { input: { type: "number" } },
  required: ["input"],
} as const;
/** Invert the strictly negative ELU output branch with supplied positive alpha. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { output, alpha } = request;
  const compute = (): Output => {
    H.positive(alpha);
    H.domain(output < 0 && output > -alpha);
    return { input: Math.log1p(output / alpha) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { output: -1, alpha: 2 },
  output: { input: -0.6931471805599453 },
} satisfies ToolExample<Input, Output>;
export const eluNegativeOutputInverseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "activation/elu-negative-output-inverse",
    title: "ELU Negative Output Inverse Tool",
    description:
      "Invert the strictly negative ELU output branch with supplied positive alpha.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        output: { type: "number", exclusiveMaximum: 0 },
        alpha: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["output", "alpha"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { input: { type: "number" } },
      required: ["input"],
    },
    ports: {
      inputs: [
        {
          id: "output",
          label: "Output",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "alpha",
          label: "Alpha",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "input", label: "Input", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = eluNegativeOutputInverseTool.execute;
export default eluNegativeOutputInverseTool;
