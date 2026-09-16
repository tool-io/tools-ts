import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ startByte: number; byteLength: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "startByte", kind: "integer", label: "startByte" },
  { id: "byteLength", kind: "integer", label: "byteLength" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.startByte);
  H.int(i.byteLength);
  return H.finish({
    startBit: i.startByte * 8,
    endBit: (i.startByte + i.byteLength) * 8,
  });
};
export const example = {
  input: { startByte: 3, byteLength: 2 },
  output: { result: { startBit: 24, endBit: 40 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "binary/byte-range-bit-offset",
  title: "Byte Range Bit Offset",
  description:
    "Map a nonnegative half-open byte range to bit offsets; empty ranges stay empty.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
