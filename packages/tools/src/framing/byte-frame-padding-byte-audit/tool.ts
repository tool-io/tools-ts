import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  bytes: readonly number[];
  start: number;
  paddingByte: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "bytes", kind: "numberList", label: "bytes" },
  { id: "start", kind: "integer", label: "start" },
  { id: "paddingByte", kind: "integer", label: "paddingByte" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.bytes(i.bytes);
  H.int(i.start, 0, i.bytes.length);
  H.int(i.paddingByte, 0, 255);
  return H.finish({
    violations: i.bytes.flatMap((x, j) =>
      j >= i.start && x !== i.paddingByte ? [{ index: j, byte: x }] : [],
    ),
  });
};
export const example = {
  input: { bytes: [1, 0, 2, 0], start: 1, paddingByte: 0 },
  output: { result: { violations: [{ index: 2, byte: 2 }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "framing/byte-frame-padding-byte-audit",
  title: "Byte Frame Padding Byte Audit",
  description:
    "Audit every byte in a caller-declared padding suffix against one exact expected padding byte; no padding-format auto-detection.",
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
          violations: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                index: { type: "number" },
                byte: { type: "number" },
              },
              required: ["index", "byte"],
            },
          },
        },
        required: ["violations"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
