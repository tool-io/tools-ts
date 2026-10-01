import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly extendedValue: string };
export type Output = {
  readonly charset: string;
  readonly language: string;
  readonly encodedValue: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { extendedValue: { type: "string", maxLength: 8192 } },
  required: ["extendedValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    charset: { type: "string", maxLength: 8192 },
    language: { type: "string", maxLength: 8192 },
    encodedValue: { type: "string", maxLength: 8192 },
  },
  required: ["charset", "language", "encodedValue"],
} as const;
/** Split the charset/language/value fields of a supplied extended MIME parameter without percent decoding. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { extendedValue } = request;
  const compute = (): Output => {
    const match = /^([^']*)'([^']*)'([\s\S]*)(?![\s\S])/.exec(extendedValue);
    H.domain(match !== null);
    return { charset: match[1], language: match[2], encodedValue: match[3] };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { extendedValue: "UTF-8'en'hello%20world" },
  output: { charset: "UTF-8", language: "en", encodedValue: "hello%20world" },
} satisfies ToolExample<Input, Output>;
export const mimeParameterLanguageSeparatorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "parse/mime-parameter-language-separator",
    title: "Mime Parameter Language Separator Tool",
    description:
      "Split the charset/language/value fields of a supplied extended MIME parameter without percent decoding.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { extendedValue: { type: "string", maxLength: 8192 } },
      required: ["extendedValue"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        charset: { type: "string", maxLength: 8192 },
        language: { type: "string", maxLength: 8192 },
        encodedValue: { type: "string", maxLength: 8192 },
      },
      required: ["charset", "language", "encodedValue"],
    },
    ports: {
      inputs: [
        {
          id: "extendedValue",
          label: "Extended Value",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "charset", label: "Charset", valueType: { type: "string" } },
        { id: "language", label: "Language", valueType: { type: "string" } },
        {
          id: "encodedValue",
          label: "Encoded Value",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = mimeParameterLanguageSeparatorTool.execute;
export default mimeParameterLanguageSeparatorTool;
