import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ messagesJson: string; msbController: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "messagesJson", label: "messagesJson", kind: "string" },
  { id: "msbController", label: "msbController", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const r = H.midiRecords(i.messagesJson);
  H.int(i.msbController, 0, 31);
  return H.finish({
    channels: Array.from({ length: 16 }, (_, channel) => {
      const msb = r.flatMap((v, index) =>
          (v.status & 15) === channel &&
          v.status >> 4 === 11 &&
          v.data[0] === i.msbController
            ? [index]
            : [],
        ),
        lsb = r.flatMap((v, index) =>
          (v.status & 15) === channel &&
          v.status >> 4 === 11 &&
          v.data[0] === i.msbController + 32
            ? [index]
            : [],
        );
      return {
        channel,
        msb,
        lsb,
        unambiguous: msb.length === 1 && lsb.length === 1,
        value:
          msb.length === 1 && lsb.length === 1
            ? r[msb[0]].data[1] * 128 + r[lsb[0]].data[1]
            : null,
      };
    }).filter((v) => v.msb.length || v.lsb.length),
  });
};
export const example = {
  input: {
    messagesJson: '[{"status":176,"data":[1,64]},{"status":176,"data":[33,2]}]',
    msbController: 1,
  },
  output: {
    result: {
      channels: [
        { channel: 0, msb: [0], lsb: [1], unambiguous: true, value: 8194 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["MIDI Fourteen Bit Controller Pair Audit", "MIDI", "music"],
    collections: ["encode-decode"],
    fields: ["MIDI", "music"],
    keywords: ["MIDI", "music"],
  },
  id: "midi/controller-fourteen-bit-pair-audit",
  title: "MIDI Fourteen Bit Controller Pair Audit",
  description:
    "Audit explicit MSB/LSB controller-pair occurrences per channel; only a unique pair yields a fourteen-bit value, no temporal pairing guesses.",
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
          channels: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                channel: { type: "number" },
                msb: { type: "array", items: { type: "number" } },
                lsb: { type: "array", items: { type: "number" } },
                unambiguous: { type: "boolean" },
                value: { anyOf: [{ type: "number" }, { type: "null" }] },
              },
              required: ["channel", "msb", "lsb", "unambiguous", "value"],
            },
          },
        },
        required: ["channels"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
