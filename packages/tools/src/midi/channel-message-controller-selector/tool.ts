import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ messagesJson: string; controller: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "messagesJson", label: "messagesJson", kind: "string" },
  { id: "controller", label: "controller", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const r = H.midiRecords(i.messagesJson);
  H.int(i.controller, 0, 127);
  return H.finish({
    messages: r.filter(
      (v) => v.status >> 4 === 11 && v.data[0] === i.controller,
    ),
  });
};
export const example = {
  input: {
    messagesJson:
      '[{"status":176,"data":[7,100]},{"status":144,"data":[60,100]}]',
    controller: 7,
  },
  output: { result: { messages: [{ status: 176, data: [7, 100] }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["MIDI Channel Message Controller Selector", "MIDI", "music"],
    collections: ["encode-decode"],
    fields: ["MIDI", "music"],
    keywords: ["MIDI", "music"],
  },
  id: "midi/channel-message-controller-selector",
  title: "MIDI Channel Message Controller Selector",
  description:
    "Select explicit MIDI control-change records for a supplied seven-bit controller number, preserving channels and occurrence order.",
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
          messages: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                status: { type: "number" },
                data: { type: "array", items: { type: "number" } },
              },
              required: ["status", "data"],
            },
          },
        },
        required: ["messages"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
