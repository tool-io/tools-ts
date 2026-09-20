import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly x: number; readonly output: number };
export type Output = { readonly bias: number; readonly feasible: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { x: { type: "number" }, output: { type: "number", minimum: 0 } },
  required: ["x", "output"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { bias: { type: "number" }, feasible: { type: "boolean" } },
  required: ["bias", "feasible"],
} as const;
/** Recover a candidate nonnegative squareplus bias and flag whether the supplied output is feasible. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { x, output } = input;
  const compute = (): Output => {
    H.domain(output >= 0);
    const bias = 4 * output * (output - x);
    return { bias, feasible: output === 0 ? x <= 0 : bias >= 0 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { x: 1, output: 2 },
  output: { bias: 8, feasible: true },
} satisfies ToolExample<Input, Output>;
export const squareplusOutputBiasFeasibilityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "activation/squareplus-output-bias-feasibility",
    title: "Squareplus Output Bias Feasibility Tool",
    description:
      "Recover a candidate nonnegative squareplus bias and flag whether the supplied output is feasible.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        x: { type: "number" },
        output: { type: "number", minimum: 0 },
      },
      required: ["x", "output"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { bias: { type: "number" }, feasible: { type: "boolean" } },
      required: ["bias", "feasible"],
    },
    ports: {
      inputs: [
        { id: "x", label: "X", required: true, valueType: { type: "number" } },
        {
          id: "output",
          label: "Output",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "bias", label: "Bias", valueType: { type: "number" } },
        { id: "feasible", label: "Feasible", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = squareplusOutputBiasFeasibilityTool.execute;
export default squareplusOutputBiasFeasibilityTool;
