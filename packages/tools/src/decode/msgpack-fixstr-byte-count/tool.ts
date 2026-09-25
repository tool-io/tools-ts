import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly octet: number };
export type Output = { readonly bytes: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { octet: { type: "integer", minimum: 160, maximum: 191 } },
  required: ["octet"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { bytes: { type: "integer" } },
  required: ["bytes"],
} as const;
/** Calculate msgpack fixstr byte count from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { octet } = input;
  const compute = (): Output => {
    H.integer(octet, 160, 191);
    return { bytes: octet - 160 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { octet: 165 },
  output: { bytes: 5 },
} satisfies ToolExample<Input, Output>;
export const msgpackFixstrByteCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "decode/msgpack-fixstr-byte-count",
    title: "Msgpack Fixstr Byte Count Tool",
    description:
      "Calculate msgpack fixstr byte count from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { octet: { type: "integer", minimum: 160, maximum: 191 } },
      required: ["octet"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { bytes: { type: "integer" } },
      required: ["bytes"],
    },
    ports: {
      inputs: [
        {
          id: "octet",
          label: "Octet",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "bytes", label: "Bytes", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = msgpackFixstrByteCountTool.execute;
export default msgpackFixstrByteCountTool;
