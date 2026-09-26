import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly payload: number; readonly moreGroups: boolean };
export type Output = { readonly byte: number; readonly hex: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    payload: { type: "integer", minimum: 0, maximum: 127 },
    moreGroups: { type: "boolean" },
  },
  required: ["payload", "moreGroups"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    byte: { type: "integer" },
    hex: { type: "string", maxLength: 8192 },
  },
  required: ["byte", "hex"],
} as const;
/** Construct one unsigned base-128 varint octet from an explicit seven-bit group and continuation flag. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { payload, moreGroups } = request;
  const compute = (): Output => {
    H.integer(payload, 0, 127);
    const byte = payload + (moreGroups ? 128 : 0);
    return { byte, hex: byte.toString(16).padStart(2, "0") };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { payload: 44, moreGroups: true },
  output: { byte: 172, hex: "ac" },
} satisfies ToolExample<Input, Output>;
export const varintSevenBitGroupWriterTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "encode/varint-seven-bit-group-writer",
    title: "Varint Seven Bit Group Writer Tool",
    description:
      "Construct one unsigned base-128 varint octet from an explicit seven-bit group and continuation flag.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        payload: { type: "integer", minimum: 0, maximum: 127 },
        moreGroups: { type: "boolean" },
      },
      required: ["payload", "moreGroups"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        byte: { type: "integer" },
        hex: { type: "string", maxLength: 8192 },
      },
      required: ["byte", "hex"],
    },
    ports: {
      inputs: [
        {
          id: "payload",
          label: "Payload",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "moreGroups",
          label: "More Groups",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "byte", label: "Byte", valueType: { type: "integer" } },
        { id: "hex", label: "Hex", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = varintSevenBitGroupWriterTool.execute;
export default varintSevenBitGroupWriterTool;
