import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ rawStreamWord: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "rawStreamWord", label: "Raw stream word", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const x = H.word(i.rawStreamWord, 32);
  return H.finish({
    reservedBitSet: x >= 0x80000000n,
    streamId: String(x & 0x7fffffffn),
  });
};
export const example = {
  input: { rawStreamWord: "2147483649" },
  output: { result: { reservedBitSet: true, streamId: "1" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/http2-stream-reserved-bit-check",
  title: "Network: Http2 Stream Reserved Bit Check Tool",
  description:
    "Inspect an HTTP/2 frame stream-identifier word, reporting the reserved high bit separately from the 31-bit identifier; reserved-bit presence is not treated as frame rejection.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          reservedBitSet: { type: "boolean" },
          streamId: { type: "string" },
        },
        required: ["reservedBitSet", "streamId"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
