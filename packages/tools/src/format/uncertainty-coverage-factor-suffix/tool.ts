import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly value: string; readonly factor: number };
export type Output = { readonly text: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "string", maxLength: 8192 },
    factor: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["value", "factor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { text: { type: "string", maxLength: 8192 } },
  required: ["text"],
} as const;
/** Append an explicit uncertainty coverage factor without assuming a confidence distribution. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { value, factor } = input;
  const compute = (): Output => {
    H.positive(factor);
    return { text: value + " (k=" + factor + ")" };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { value: "12 ± 2", factor: 2 },
  output: { text: "12 ± 2 (k=2)" },
} satisfies ToolExample<Input, Output>;
export const uncertaintyCoverageFactorSuffixTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "format/uncertainty-coverage-factor-suffix",
    title: "Uncertainty Coverage Factor Suffix Tool",
    description:
      "Append an explicit uncertainty coverage factor without assuming a confidence distribution.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "string", maxLength: 8192 },
        factor: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["value", "factor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { text: { type: "string", maxLength: 8192 } },
      required: ["text"],
    },
    ports: {
      inputs: [
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "factor",
          label: "Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "text", label: "Text", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = uncertaintyCoverageFactorSuffixTool.execute;
export default uncertaintyCoverageFactorSuffixTool;
