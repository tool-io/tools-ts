import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly value: number };
export type Output = { readonly unsigned64: string; readonly bytes: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { value: { type: "integer", minimum: -2147483648, maximum: -1 } },
  required: ["value"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unsigned64: { type: "string", maxLength: 8192 },
    bytes: { type: "integer" },
  },
  required: ["unsigned64", "bytes"],
} as const;
/** Compute protocol buffers enum negative wire representation from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { value } = input;
  const compute = (): Output => {
    integer(value, -2147483648, -1);
    return {
      unsigned64: BigInt.asUintN(64, BigInt(value)).toString(),
      bytes: 10,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { value: -1 },
  output: { unsigned64: "18446744073709551615", bytes: 10 },
} satisfies ToolExample<Input, Output>;
export const protobufEnumNegativeWireRepresentationTool =
  defineSchemaCalculation<Input, Output>({
    id: "encode/protobuf-enum-negative-wire-representation",
    title: "Protocol Buffers Enum Negative Wire Representation Tool",
    description:
      "Compute protocol buffers enum negative wire representation from explicit bounded inputs.",
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
          id: "unsigned64",
          label: "Unsigned64",
          valueType: { type: "string" },
        },
        { id: "bytes", label: "Bytes", valueType: { type: "integer" } },
      ],
    },
  });
export const run = protobufEnumNegativeWireRepresentationTool.execute;
export default protobufEnumNegativeWireRepresentationTool;
