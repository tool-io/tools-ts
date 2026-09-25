import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string };
export type Output = { readonly text: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { text: { type: "string", maxLength: 8192 } },
  required: ["text"],
} as const;
/** Decode one RFC 4180 doubled quote token inside an already quoted CSV field. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { token } = input;
  const compute = (): Output => {
    H.domain(token === String.fromCharCode(34, 34));
    return { text: String.fromCharCode(34) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { token: '""' },
  output: { text: '"' },
} satisfies ToolExample<Input, Output>;
export const csvDoubledQuoteTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "decode/csv-doubled-quote-token",
    title: "CSV Doubled Quote Token Tool",
    description:
      "Decode one RFC 4180 doubled quote token inside an already quoted CSV field.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
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
          id: "token",
          label: "Token",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "text", label: "Text", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = csvDoubledQuoteTokenTool.execute;
export default csvDoubledQuoteTokenTool;
