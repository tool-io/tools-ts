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
  return H.finish({
    dataBytes: H.midiCount(i.status),
    totalBytes: H.midiCount(i.status) + 1,
  });
};
export const example = {
  input: { status: 192 },
  output: { result: { dataBytes: 1, totalBytes: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["MIDI Channel Message Byte Count", "MIDI", "music"],
    collections: ["encode-decode"],
    fields: ["MIDI", "music"],
    keywords: ["MIDI", "music"],
  },
  id: "midi/channel-message-byte-count",
  title: "MIDI Channel Message Byte Count",
  description:
    "Return required MIDI 1.0 channel-message byte counts from an explicit status, excluding running-status omission and system messages.",
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
          dataBytes: { type: "number" },
          totalBytes: { type: "number" },
        },
        required: ["dataBytes", "totalBytes"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
