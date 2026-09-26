import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly value: number };
export type Output = { readonly bytes: readonly number[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { value: { type: "integer", minimum: 0, maximum: 4294967295 } },
  required: ["value"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bytes: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["bytes"],
} as const;
/** Compute protocol buffers fixed32 octet fields from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { value } = input;
  const compute = (): Output => {
    integer(value, 0, 4294967295);
    return {
      bytes: Array.from(
        { length: 4 },
        (_, i) => Math.floor(value / 256 ** i) % 256,
      ),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { value: 305419896 },
  output: { bytes: [120, 86, 52, 18] },
} satisfies ToolExample<Input, Output>;
export const protobufFixed32OctetFieldsTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "encode/protobuf-fixed32-octet-fields",
  title: "Protocol Buffers Fixed32 Octet Fields Tool",
  description:
    "Compute protocol buffers fixed32 octet fields from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "value",
        label: "Value",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      {
        id: "bytes",
        label: "Bytes",
        valueType: { type: "list", items: { type: "integer" } },
      },
    ],
  },
});
export const run = protobufFixed32OctetFieldsTool.execute;
export default protobufFixed32OctetFieldsTool;
