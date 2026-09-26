import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly charset: string;
  readonly encoding: string;
  readonly payload: string;
};
export type Output = { readonly word: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    charset: { type: "string", maxLength: 8192 },
    encoding: { type: "string", maxLength: 8192 },
    payload: { type: "string", maxLength: 8192 },
  },
  required: ["charset", "encoding", "payload"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { word: { type: "string", maxLength: 8192 } },
  required: ["word"],
} as const;
/** Compute rfc 2047 encoded word charset token from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { charset, encoding, payload } = input;
  const compute = (): Output => {
    domain(
      /^[A-Za-z0-9._-]+(?![\s\S])/.test(charset) &&
        /^[BQ](?![\s\S])/.test(encoding) &&
        /^[^?\s]*(?![\s\S])/.test(payload),
    );
    const word = "=?" + charset + "?" + encoding + "?" + payload + "?=";
    domain(word.length <= 75);
    return { word };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { charset: "UTF-8", encoding: "B", payload: "YWJj" },
  output: { word: "=?UTF-8?B?YWJj?=" },
} satisfies ToolExample<Input, Output>;
export const rfc2047EncodedWordCharsetTokenTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "encode/rfc2047-encoded-word-charset-token",
  title: "RFC 2047 Encoded Word Charset Token Tool",
  description:
    "Compute rfc 2047 encoded word charset token from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "charset",
        label: "Charset",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "encoding",
        label: "Encoding",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "payload",
        label: "Payload",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [{ id: "word", label: "Word", valueType: { type: "string" } }],
  },
});
export const run = rfc2047EncodedWordCharsetTokenTool.execute;
export default rfc2047EncodedWordCharsetTokenTool;
