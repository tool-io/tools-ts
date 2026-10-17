import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ type: number; channel: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "type", label: "type", kind: "integer" },
  { id: "channel", label: "channel", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.int(i.type, 8, 14);
  H.int(i.channel, 0, 15);
  return H.finish({ status: i.type * 16 + i.channel });
};
export const example = {
  input: { type: 9, channel: 2 },
  output: { result: { status: 146 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["MIDI Status Byte Channel Join", "MIDI", "music"],
    collections: ["encode-decode"],
    fields: ["MIDI", "music"],
    keywords: ["MIDI", "music"],
  },
  id: "midi/status-byte-channel-join",
  title: "MIDI Status Byte Channel Join",
  description:
    "Join MIDI 1.0 channel-message type 8\u201314 with zero-based channel 0\u201315; system message types are rejected.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { status: { type: "number" } },
        required: ["status"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
