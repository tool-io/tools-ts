import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ startBit: number; bitLength: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "startBit", kind: "integer", label: "startBit" },
  { id: "bitLength", kind: "integer", label: "bitLength" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.int(i.startBit);
  H.int(i.bitLength);
  const startByte = Math.floor(i.startBit / 8),
    endByte = i.bitLength
      ? Math.ceil((i.startBit + i.bitLength) / 8)
      : startByte;
  return H.finish({ startByte, endByte, bytes: endByte - startByte });
};
export const example = {
  input: { startBit: 7, bitLength: 2 },
  output: { result: { startByte: 0, endByte: 2, bytes: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "binary/bit-range-byte-envelope",
  title: "Bit Range Byte Envelope",
  description:
    "Find the smallest half-open byte envelope of a bit range; empty bit ranges return an empty envelope.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          startByte: { type: "number" },
          endByte: { type: "number" },
          bytes: { type: "number" },
        },
        required: ["startByte", "endByte", "bytes"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
