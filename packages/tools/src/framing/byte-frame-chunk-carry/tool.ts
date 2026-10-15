import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  carry: readonly number[];
  chunk: readonly number[];
  frameBytes: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "carry", kind: "numberList", label: "carry" },
  { id: "chunk", kind: "numberList", label: "chunk" },
  { id: "frameBytes", kind: "integer", label: "frameBytes" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.bytes(i.carry);
  H.bytes(i.chunk);
  H.int(i.frameBytes, 1, 128);
  H.check(i.carry.length < i.frameBytes);
  const all = [...i.carry, ...i.chunk],
    complete = Math.floor(all.length / i.frameBytes);
  return H.finish({
    frames: Array.from({ length: complete }, (_, j) =>
      all.slice(j * i.frameBytes, (j + 1) * i.frameBytes),
    ),
    carry: all.slice(complete * i.frameBytes),
  });
};
export const example = {
  input: { carry: [1], chunk: [2, 3, 4], frameBytes: 3 },
  output: { result: { frames: [[1, 2, 3]], carry: [4] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "framing/byte-frame-chunk-carry",
  title: "Byte Frame Chunk Carry Tool",
  description:
    "Advance one fixed-byte streaming frame chunk with explicit incomplete carry, emitting complete frames and retaining the new tail; no sync search.",
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
          carry: { type: "array", items: { type: "number" } },
        },
        required: ["frames", "carry"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
