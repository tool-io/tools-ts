import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly value: string };
export type Output = {
  readonly charset: string;
  readonly language: string;
  readonly encodedValue: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { value: { type: "string", maxLength: 8192 } },
  required: ["value"],
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
/** Compute content disposition rfc 5987 language field from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { value } = input;
  const compute = (): Output => {
    const m = /^([^\x27\s]+)\x27([^\x27\s]*)\x27(.*)(?![\s\S])/.exec(value);
    domain(m && !/[\r\n]/.test(value));
    return { charset: m[1], language: m[2], encodedValue: m[3] };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { value: "UTF-8'en'report%20one.txt" },
  output: {
    charset: "UTF-8",
    language: "en",
    encodedValue: "report%20one.txt",
  },
} satisfies ToolExample<Input, Output>;
export const contentDispositionRfc5987LanguageFieldTool =
  defineSchemaCalculation<Input, Output>({
    id: "web/content-disposition-rfc5987-language-field",
    title: "Content Disposition RFC 5987 Language Field Tool",
    description:
      "Compute content disposition rfc 5987 language field from explicit bounded inputs.",
    calculate,
    inputSchema,
    outputSchema,
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
        { id: "charset", label: "Charset", valueType: { type: "string" } },
        { id: "language", label: "Language", valueType: { type: "string" } },
        {
          id: "encodedValue",
          label: "Encoded Value",
          valueType: { type: "string" },
        },
      ],
    },
  });
export const run = contentDispositionRfc5987LanguageFieldTool.execute;
export default contentDispositionRfc5987LanguageFieldTool;
