import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly bytes: readonly number[] };
export type Output = { readonly unsigned: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bytes: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["bytes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { unsigned: { type: "number" } },
  required: ["unsigned"],
} as const;
/** Compute protocol buffers fixed32 byte order field from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { bytes } = input;
  const compute = (): Output => {
    domain(bytes.length === 4 && bytes.every((x) => x >= 0 && x <= 255));
    return { unsigned: bytes.reduce((s, x, i) => s + x * 256 ** i, 0) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { bytes: [120, 86, 52, 18] },
  output: { unsigned: 305419896 },
} satisfies ToolExample<Input, Output>;
export const protobufFixed32ByteOrderFieldTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "decode/protobuf-fixed32-byte-order-field",
  title: "Protocol Buffers Fixed32 Byte Order Field Tool",
  description:
    "Compute protocol buffers fixed32 byte order field from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "bytes",
        label: "Bytes",
        required: true,
        valueType: { type: "list", items: { type: "integer" } },
      },
    ],
    outputs: [
      { id: "unsigned", label: "Unsigned", valueType: { type: "number" } },
    ],
  },
});
export const run = protobufFixed32ByteOrderFieldTool.execute;
export default protobufFixed32ByteOrderFieldTool;
