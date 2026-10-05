import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly text: string };
export type Output = { readonly normalized: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { text: { type: "string", maxLength: 8192 } },
  required: ["text"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { normalized: { type: "string", maxLength: 8192 } },
  required: ["normalized"],
} as const;
/** Replace only Eastern Arabic/Persian digits U+06F0–U+06F9 with ASCII digits, preserving all separators and other text. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { text } = request;
  const compute = (): Output => {
    return {
      normalized: text.replace(/[۰-۹]/g, (c) =>
        String(c.charCodeAt(0) - 0x6f0),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { text: "۱۲۳٫۴۵" },
  output: { normalized: "123٫45" },
} satisfies ToolExample<Input, Output>;
export const persianNumeralDigitNormalizerTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "middle-eastern-studies/persian-numeral-digit-normalizer",
    title: "Persian Numeral Digit Normalizer Tool",
    description:
      "Replace only Eastern Arabic/Persian digits U+06F0–U+06F9 with ASCII digits, preserving all separators and other text.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { text: { type: "string", maxLength: 8192 } },
      required: ["text"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { normalized: { type: "string", maxLength: 8192 } },
      required: ["normalized"],
    },
    ports: {
      inputs: [
        {
          id: "text",
          label: "Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "normalized",
          label: "Normalized",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = persianNumeralDigitNormalizerTool.execute;
export default persianNumeralDigitNormalizerTool;
