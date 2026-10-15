import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  bytes: readonly number[];
  lengthBytes: number;
  littleEndian: boolean;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "bytes", kind: "numberList", label: "bytes" },
  { id: "lengthBytes", kind: "integer", label: "lengthBytes" },
  { id: "littleEndian", kind: "boolean", label: "littleEndian" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.bytes(i.bytes);
  H.int(i.lengthBytes, 1, 4);
  const frames: number[][] = [];
  let p = 0;
  while (p < i.bytes.length) {
    const n = Number(H.wordValue(i.bytes, p, i.lengthBytes, i.littleEndian));
    p += i.lengthBytes;
    H.check(p + n <= i.bytes.length);
    frames.push(i.bytes.slice(p, p + n));
    p += n;
  }
  return H.finish({ frames });
};
export const example = {
  input: { bytes: [2, 1, 2, 1, 3], lengthBytes: 1, littleEndian: false },
  output: { result: { frames: [[1, 2], [3]] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "framing/length-field-frame-split",
  title: "Length Field Frame Splitter",
  description:
    "Split a complete length-field byte stream with explicit 1\u20134 byte unsigned payload lengths and byte order; truncation is rejected, no checksum or sync inference.",
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
          frames: {
            type: "array",
            items: { type: "array", items: { type: "number" } },
          },
        },
        required: ["frames"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
