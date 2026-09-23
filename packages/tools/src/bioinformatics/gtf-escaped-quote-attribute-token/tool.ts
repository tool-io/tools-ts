import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly value: string };
export type Output = { readonly quoted: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { value: { type: "string", maxLength: 8192 } },
  required: ["value"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { quoted: { type: "string", maxLength: 8192 } },
  required: ["quoted"],
} as const;
/** Quote one GTF-style attribute value by escaping backslash and double quote; reject control characters. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value } = request;
  const compute = (): Output => {
    H.domain(!/[\x00-\x1f\x7f]/.test(value));
    return {
      quoted: '"' + value.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"',
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: "alpha" },
  output: { quoted: '"alpha"' },
} satisfies ToolExample<Input, Output>;
export const gtfEscapedQuoteAttributeTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioinformatics/gtf-escaped-quote-attribute-token",
    title: "GTF Escaped Quote Attribute Token Tool",
    description:
      "Quote one GTF-style attribute value by escaping backslash and double quote; reject control characters.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { value: { type: "string", maxLength: 8192 } },
      required: ["value"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { quoted: { type: "string", maxLength: 8192 } },
      required: ["quoted"],
    },
    ports: {
      inputs: [
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "quoted", label: "Quoted", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = gtfEscapedQuoteAttributeTokenTool.execute;
export default gtfEscapedQuoteAttributeTokenTool;
