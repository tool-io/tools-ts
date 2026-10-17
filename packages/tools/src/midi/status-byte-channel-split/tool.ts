import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ status: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "status", label: "status", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.int(i.status, 128, 239);
  return H.finish({
    type: i.status >> 4,
    channel: i.status & 15,
    dataBytes: H.midiCount(i.status),
  });
};
export const example = {
  input: { status: 146 },
  output: { result: { type: 9, channel: 2, dataBytes: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["MIDI Status Byte Channel Split", "MIDI", "music"],
    collections: ["encode-decode"],
    fields: ["MIDI", "music"],
    keywords: ["MIDI", "music"],
  },
  id: "midi/status-byte-channel-split",
  title: "MIDI Status Byte Channel Split",
  description:
    "Split a MIDI 1.0 channel status byte into message type nibble, zero-based channel and required data byte count; excludes system statuses.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          type: { type: "number" },
          channel: { type: "number" },
          dataBytes: { type: "number" },
        },
        required: ["type", "channel", "dataBytes"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
