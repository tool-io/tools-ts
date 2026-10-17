import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ centered: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "centered", label: "centered", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.int(i.centered, -8192, 8191);
  return H.finish({
    lsb: (i.centered + 8192) % 128,
    msb: Math.floor((i.centered + 8192) / 128),
  });
};
export const example = {
  input: { centered: -8192 },
  output: { result: { lsb: 0, msb: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["MIDI Pitch Bend Centered Byte Pair", "MIDI", "music"],
    collections: ["encode-decode"],
    fields: ["MIDI", "music"],
    keywords: ["MIDI", "music"],
  },
  id: "midi/pitch-bend-centered-byte-pair",
  title: "MIDI Pitch Bend Centered Byte Pair",
  description:
    "Encode a signed centered MIDI pitch-bend integer to least/most-significant seven-bit data bytes; no bend-range assumption.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { lsb: { type: "number" }, msb: { type: "number" } },
        required: ["lsb", "msb"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
