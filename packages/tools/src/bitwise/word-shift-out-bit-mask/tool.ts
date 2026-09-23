import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  word: string;
  width: number;
  shift: number;
  direction: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "word", label: "Word", kind: "string" },
  { id: "width", label: "Width", kind: "integer" },
  { id: "shift", label: "Shift", kind: "integer" },
  {
    id: "direction",
    label: "Direction",
    kind: "string",
    enum: ["left", "right"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const x = H.word(i.word, i.width);
  H.int(i.shift, 0, i.width);
  H.choice(i.direction, ["left", "right"]);
  const out =
    i.direction === "left"
      ? x >> BigInt(i.width - i.shift)
      : x & (2n ** BigInt(i.shift) - 1n);
  return H.finish({ shiftedOutWord: String(out), shiftedOutCount: i.shift });
};
export const example = {
  input: { word: "129", width: 8, shift: 2, direction: "left" },
  output: { result: { shiftedOutWord: "2", shiftedOutCount: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bitwise/word-shift-out-bit-mask",
  title: "Bitwise: Word Shift Out Bit Mask Tool",
  description:
    "Extract the bits shifted out of an explicit fixed-width word, compacted in original bit order; not an arithmetic signed shift.",
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
          shiftedOutCount: { type: "number" },
          shiftedOutWord: { type: "string" },
        },
        required: ["shiftedOutCount", "shiftedOutWord"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
