import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly utf8Bytes: number };
export type Output = { readonly octet: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { utf8Bytes: { type: "integer", minimum: 0, maximum: 31 } },
  required: ["utf8Bytes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { octet: { type: "integer" } },
  required: ["octet"],
} as const;
/** Calculate msgpack fixstr length prefix from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { utf8Bytes } = input;
  const compute = (): Output => {
    H.integer(utf8Bytes, 0, 31);
    return { octet: 160 + utf8Bytes };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { utf8Bytes: 5 },
  output: { octet: 165 },
} satisfies ToolExample<Input, Output>;
export const msgpackFixstrLengthPrefixTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "encode/msgpack-fixstr-length-prefix",
    title: "Msgpack Fixstr Length Prefix Tool",
    description:
      "Calculate msgpack fixstr length prefix from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { utf8Bytes: { type: "integer", minimum: 0, maximum: 31 } },
      required: ["utf8Bytes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { octet: { type: "integer" } },
      required: ["octet"],
    },
    ports: {
      inputs: [
        {
          id: "utf8Bytes",
          label: "Utf8Bytes",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "octet", label: "Octet", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = msgpackFixstrLengthPrefixTool.execute;
export default msgpackFixstrLengthPrefixTool;
