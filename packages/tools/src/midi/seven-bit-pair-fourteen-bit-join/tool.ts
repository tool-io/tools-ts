import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ lsb: number; msb: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "lsb", label: "lsb", kind: "integer" },
  { id: "msb", label: "msb", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.int(i.lsb, 0, 127);
  H.int(i.msb, 0, 127);
  return H.finish({ value: i.lsb + 128 * i.msb });
};
export const example = {
  input: { lsb: 1, msb: 64 },
  output: { result: { value: 8193 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["MIDI Seven Bit Pair Fourteen Bit Join", "MIDI", "music"],
    collections: ["encode-decode"],
    fields: ["MIDI", "music"],
    keywords: ["MIDI", "music"],
  },
  id: "midi/seven-bit-pair-fourteen-bit-join",
  title: "MIDI Seven Bit Pair Fourteen Bit Join",
  description:
    "Join MIDI least-significant then most-significant seven-bit data bytes into an unsigned fourteen-bit integer.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "number" } },
        required: ["value"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
