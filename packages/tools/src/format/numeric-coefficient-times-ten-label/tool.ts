import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly coefficient: string; readonly exponent: number };
export type Output = { readonly text: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coefficient: { type: "string", maxLength: 8192 },
    exponent: { type: "integer" },
  },
  required: ["coefficient", "exponent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { text: { type: "string", maxLength: 8192 } },
  required: ["text"],
} as const;
/** Compose a coefficient-times-ten label with an explicitly parenthesized integer exponent. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { coefficient, exponent } = input;
  const compute = (): Output => {
    H.domain(coefficient.length > 0);
    return { text: coefficient + " × 10^(" + exponent + ")" };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { coefficient: "1.25", exponent: 3 },
  output: { text: "1.25 × 10^(3)" },
} satisfies ToolExample<Input, Output>;
export const numericCoefficientTimesTenLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "format/numeric-coefficient-times-ten-label",
    title: "Numeric Coefficient Times Ten Label Tool",
    description:
      "Compose a coefficient-times-ten label with an explicitly parenthesized integer exponent.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coefficient: { type: "string", maxLength: 8192 },
        exponent: { type: "integer" },
      },
      required: ["coefficient", "exponent"],
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
          id: "coefficient",
          label: "Coefficient",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "exponent",
          label: "Exponent",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "text", label: "Text", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = numericCoefficientTimesTenLabelTool.execute;
export default numericCoefficientTimesTenLabelTool;
