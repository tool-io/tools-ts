import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly charset: string };
export type Output = { readonly parameter: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { charset: { type: "string", maxLength: 8192 } },
  required: ["charset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { parameter: { type: "string", maxLength: 8192 } },
  required: ["parameter"],
} as const;
/** Format a single unquoted HTTP charset parameter from an ASCII token, lowercasing its case-insensitive name. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { charset } = request;
  const compute = (): Output => {
    H.domain(/^[!#$%&'*+.^_`|~0-9A-Za-z-]+(?![\s\S])/.test(charset), "charset");
    return { parameter: "charset=" + charset.toLowerCase() };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { charset: "UTF-8" },
  output: { parameter: "charset=utf-8" },
} satisfies ToolExample<Input, Output>;
export const contentTypeCharsetSingleParameterTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "web/content-type-charset-single-parameter",
    title: "Content Type Charset Single Parameter Tool",
    description:
      "Format a single unquoted HTTP charset parameter from an ASCII token, lowercasing its case-insensitive name.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { charset: { type: "string", maxLength: 8192 } },
      required: ["charset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { parameter: { type: "string", maxLength: 8192 } },
      required: ["parameter"],
    },
    ports: {
      inputs: [
        {
          id: "charset",
          label: "Charset",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "parameter", label: "Parameter", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = contentTypeCharsetSingleParameterTool.execute;
export default contentTypeCharsetSingleParameterTool;
