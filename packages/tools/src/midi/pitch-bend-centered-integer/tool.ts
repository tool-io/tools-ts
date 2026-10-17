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
  return H.finish({ centered: i.lsb + 128 * i.msb - 8192 });
};
export const example = {
  input: { lsb: 0, msb: 64 },
  output: { result: { centered: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["MIDI Pitch Bend Centered Integer", "MIDI", "music"],
    collections: ["encode-decode"],
    fields: ["MIDI", "music"],
    keywords: ["MIDI", "music"],
  },
  id: "midi/pitch-bend-centered-integer",
  title: "MIDI Pitch Bend Centered Integer",
  description:
    "Decode MIDI pitch-bend data bytes to signed centered -8192..8191 integer displacement; not a semitone range conversion.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { centered: { type: "number" } },
        required: ["centered"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
