import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ chunksJson: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "chunksJson", kind: "string", label: "chunksJson" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const chunks = H.arr(i.chunksJson).map((v) => {
    H.check(Array.isArray(v));
    H.bytes(v as number[]);
    return v as number[];
  });
  const bytes = chunks.flat();
  H.check(bytes.length <= 128);
  let offset = 0;
  const spans = chunks.map((v) => {
    const start = offset;
    offset += v.length;
    return [start, offset];
  });
  return H.finish({ bytes, spans });
};
export const example = {
  input: { chunksJson: "[[1,2],[],[3]]" },
  output: {
    result: {
      bytes: [1, 2, 3],
      spans: [
        [0, 2],
        [2, 2],
        [2, 3],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "framing/byte-frame-chunk-rejoin",
  title: "Byte Frame Chunk Rejoin Tool",
  description:
    "Rejoin explicit bounded byte chunks and report each chunk\u2019s half-open source span, preserving empty-chunk provenance.",
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
          bytes: { type: "array", items: { type: "number" } },
          spans: {
            type: "array",
            items: { type: "array", items: { type: "number" } },
          },
        },
        required: ["bytes", "spans"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
