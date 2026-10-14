import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ bytes: readonly number[]; offset: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "bytes", kind: "numberList", label: "bytes" },
  { id: "offset", kind: "integer", label: "offset" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.bytes(i.bytes);
  H.int(i.offset, 0, i.bytes.length - 1);
  let p = i.offset;
  const labels: number[][] = [];
  while (true) {
    H.check(p < i.bytes.length);
    const n = i.bytes[p++];
    H.check(n <= 63, "Compression and extended labels unsupported");
    if (n === 0) break;
    H.check(p + n <= i.bytes.length);
    labels.push(i.bytes.slice(p, p + n));
    p += n;
    H.check(p - i.offset <= 255);
  }
  return H.finish({ labels, endOffset: p });
};
export const example = {
  input: { bytes: [9, 1, 97, 2, 98, 99, 0, 8], offset: 1 },
  output: { result: { labels: [[97], [98, 99]], endOffset: 7 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dns/uncompressed-wire-name-parser",
  title: "DNS Uncompressed Wire Name Parser",
  description:
    "Parse one uncompressed DNS wire name at an explicit byte offset, returning the next offset; pointers and extended labels are rejected, trailing packet bytes remain unread.",
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
          labels: {
            type: "array",
            items: { type: "array", items: { type: "number" } },
          },
          endOffset: { type: "number" },
        },
        required: ["labels", "endOffset"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
