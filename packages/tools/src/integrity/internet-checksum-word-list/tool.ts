import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ bytes: readonly number[] }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "bytes", kind: "numberList", label: "bytes" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.bytes(i.bytes);
  return H.finish({
    words: Array.from(
      { length: Math.ceil(i.bytes.length / 2) },
      (_, j) => i.bytes[j * 2] * 256 + (i.bytes[j * 2 + 1] ?? 0),
    ),
    padded: i.bytes.length % 2 === 1,
  });
};
export const example = {
  input: { bytes: [1, 2, 3] },
  output: { result: { words: [258, 768], padded: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "integrity/internet-checksum-word-list",
  title: "Internet Checksum Word List Builder",
  description:
    "Build Internet-checksum big-endian 16-bit words from explicit bytes, zero-padding the low byte of an odd final pair; does not calculate a checksum.",
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
          words: { type: "array", items: { type: "number" } },
          padded: { type: "boolean" },
        },
        required: ["words", "padded"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
