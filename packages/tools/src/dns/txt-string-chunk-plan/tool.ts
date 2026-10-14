import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ bytes: readonly number[]; chunkBytes: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "bytes", kind: "numberList", label: "bytes" },
  { id: "chunkBytes", kind: "integer", label: "chunkBytes" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.bytes(i.bytes);
  H.int(i.chunkBytes, 1, 255);
  return H.finish({
    chunks: i.bytes.length
      ? Array.from(
          { length: Math.ceil(i.bytes.length / i.chunkBytes) },
          (_, j) => i.bytes.slice(j * i.chunkBytes, (j + 1) * i.chunkBytes),
        )
      : [[]],
  });
};
export const example = {
  input: { bytes: [1, 2, 3, 4, 5], chunkBytes: 2 },
  output: { result: { chunks: [[1, 2], [3, 4], [5]] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dns/txt-string-chunk-plan",
  title: "DNS TXT String Chunk Plan",
  description:
    "Plan explicit DNS TXT octet chunks under a supplied 1\u2013255 byte per-string limit; empty data becomes one empty TXT string, no Unicode byte splitting inference.",
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
          chunks: {
            type: "array",
            items: { type: "array", items: { type: "number" } },
          },
        },
        required: ["chunks"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
