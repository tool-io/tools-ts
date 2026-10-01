import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
import { utf8Encode } from "../../core/encoding.js";
export type Input = { readonly prefix: string };
export type Output = { readonly utf8Bytes: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { prefix: { type: "string", maxLength: 8192 } },
  required: ["prefix"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { utf8Bytes: { type: "integer" } },
  required: ["utf8Bytes"],
} as const;
/** Count the UTF-8 bytes of an explicit comment prefix without language-specific comment parsing. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { prefix } = request;
  const compute = (): Output => {
    return { utf8Bytes: utf8Encode(prefix).length };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { prefix: "// " },
  output: { utf8Bytes: 3 },
} satisfies ToolExample<Input, Output>;
export const commentPrefixByteCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "parse/comment-prefix-byte-count",
    title: "Comment Prefix Byte Count Tool",
    description:
      "Count the UTF-8 bytes of an explicit comment prefix without language-specific comment parsing.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { prefix: { type: "string", maxLength: 8192 } },
      required: ["prefix"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { utf8Bytes: { type: "integer" } },
      required: ["utf8Bytes"],
    },
    ports: {
      inputs: [
        {
          id: "prefix",
          label: "Prefix",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "utf8Bytes", label: "Utf8Bytes", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = commentPrefixByteCountTool.execute;
export default commentPrefixByteCountTool;
