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
  const header = String(i.bytes.length)
    .split("")
    .map((c) => c.charCodeAt(0));
  H.check(header.length + i.bytes.length + 2 <= 128);
  return H.finish({ bytes: [...header, 58, ...i.bytes, 44] });
};
export const example = {
  input: { bytes: [0, 255] },
  output: { result: { bytes: [50, 58, 0, 255, 44] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "framing/netstring-byte-record-encoder",
  title: "Netstring Byte Record Encoder",
  description:
    "Encode a single byte netstring with ASCII decimal byte length, colon and comma; binary payload bytes are not converted to text.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { bytes: { type: "array", items: { type: "number" } } },
        required: ["bytes"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
