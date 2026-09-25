import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly word: string };
export type Output = {
  readonly charset: string;
  readonly encoding: string;
  readonly payload: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { word: { type: "string", maxLength: 8192 } },
  required: ["word"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    charset: { type: "string", maxLength: 8192 },
    encoding: { type: "string", maxLength: 8192 },
    payload: { type: "string", maxLength: 8192 },
  },
  required: ["charset", "encoding", "payload"],
} as const;
/** Compute rfc 2047 encoded word header fields from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { word } = input;
  const compute = (): Output => {
    const m = /^=\?([^?\s]+)\?([bBqQ])\?([^?\s]*)\?=(?![\s\S])/.exec(word);
    domain(m && word.length <= 75);
    return { charset: m[1], encoding: m[2].toUpperCase(), payload: m[3] };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { word: "=?UTF-8?B?YWJj?=" },
  output: { charset: "UTF-8", encoding: "B", payload: "YWJj" },
} satisfies ToolExample<Input, Output>;
export const rfc2047EncodedWordHeaderFieldsTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "decode/rfc2047-encoded-word-header-fields",
  title: "RFC 2047 Encoded Word Header Fields Tool",
  description:
    "Compute rfc 2047 encoded word header fields from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "word",
        label: "Word",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "charset", label: "Charset", valueType: { type: "string" } },
      { id: "encoding", label: "Encoding", valueType: { type: "string" } },
      { id: "payload", label: "Payload", valueType: { type: "string" } },
    ],
  },
});
export const run = rfc2047EncodedWordHeaderFieldsTool.execute;
export default rfc2047EncodedWordHeaderFieldsTool;
