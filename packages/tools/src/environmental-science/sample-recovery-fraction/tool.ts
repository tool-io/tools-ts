import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly recovered: number; readonly expected: number };
export type Output = { readonly fraction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recovered: { type: "number" },
    expected: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["recovered", "expected"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" } },
  required: ["fraction"],
} as const;
/** Compute measured recovery against an explicit same-basis reference; values outside [0,1] are retained. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recovered, expected } = request;
  const compute = (): Output => {
    H.positive(expected);
    return { fraction: recovered / expected };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recovered: 8, expected: 10 },
  output: { fraction: 0.8 },
} satisfies ToolExample<Input, Output>;
export const sampleRecoveryFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-science/sample-recovery-fraction",
    title: "Sample Recovery Fraction Tool",
    description:
      "Compute measured recovery against an explicit same-basis reference; values outside [0,1] are retained.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recovered: { type: "number" },
        expected: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["recovered", "expected"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { fraction: { type: "number" } },
      required: ["fraction"],
    },
    ports: {
      inputs: [
        {
          id: "recovered",
          label: "Recovered",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "expected",
          label: "Expected",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = sampleRecoveryFractionTool.execute;
export default sampleRecoveryFractionTool;
